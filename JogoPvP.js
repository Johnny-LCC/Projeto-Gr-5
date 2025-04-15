// Refactored and improved implementation of the PvP mode for the children's game.

// Extend JogoPvP functionality
window.JogoPvP = class JogoPvP extends Phaser.Scene {
    constructor() {
        super('JogoPvP');
        this.width = null;
        this.height = null;
        this.score1 = 0;
        this.score2 = 0;
        this.selectedProduct = null;
        this.selectedNumbers = [];
        this.selectedProductPos = null;
        this.turnTime = { value: 10 };
        this.currentPlayer = { value: 1 };
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
        this.load.image('ampTempo', 'assets/ampulhetaTempo.png');
        this.load.image('btPVP', 'assets/bt-level0.png');
    }

    create() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.setupGameBoard();
        this.setupUIElements();

        // Start the first player's turn
        this.startPlayerTurn();

        // Button interaction logic
        this.input.on('gameobjectover', (pointer, gameObject) => {
            gameObject.displayHeight += 5;
            gameObject.displayWidth += 5;
        });
        this.input.on('gameobjectout', (pointer, gameObject) => {
            gameObject.displayHeight -= 5;
            gameObject.displayWidth -= 5;
        });
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            this.handleButtonClick(gameObject);
        });
    }

    setupGameBoard() {
        // Background
        this.background = this.add.sprite(0.5 * this.width, 0.5 * this.height, 'background').setScale(1.5);

        // Title
        this.titulo = this.add.sprite(0.605 * this.width, 0.16 * this.height, 'titulo').setScale(1.7);

        // Home button
        this.btHome = this.add.sprite(0.07 * this.width, 0.89 * this.height, 'home').setScale(1.2).setInteractive({ useHandCursor: true });

        // PVP button
        this.btPVP = this.add.sprite(0.135 * this.width, 0.18 * this.height, 'btPVP').setScale(1);

        // Timer setup
        this.ampulheta = this.add.sprite(0.21 * this.width, 0.45 * this.height, 'ampTempo').setScale(0.8);
        this.timeText = this.add.text(0.21 * this.width, 0.45 * this.height, this.turnTime.value, {
            fontSize: '48px',
            fill: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Player turn indicator
        this.playerTurnText = this.add.text(0.21 * this.width, 0.35 * this.height, 'Jogador 1', {
            fontSize: '32px',
            fill: '#FF0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Generate factor column and product grid
        this.numerosColuna = this.gerarNumerosUnicos(5, 1, 9);
        this.matriz = Array.from({ length: 5 }, () => Array(5).fill(null));
        this.quadradosGrid = Array.from({ length: 5 }, () => Array(5).fill(null));
        this.quadradosNumeros = [];

        let produtos = [];
        for (let i = 0; i < this.numerosColuna.length; i++) {
            for (let j = 0; j < this.numerosColuna.length; j++) {
                produtos.push(this.numerosColuna[i] * this.numerosColuna[j]);
            }
        }

        Phaser.Utils.Array.Shuffle(produtos);
        produtos = produtos.slice(0, 24);

        const midRow = Math.floor(5 / 2);
        const midCol = Math.floor(5 / 2);
        let prodIndex = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (i === midRow && j === midCol) {
                    this.quadradosGrid[midRow][midCol] = {
                        sprite: this.add.rectangle(
                            (0.4 + midCol * 0.07) * this.width,
                            (0.38 + midRow * 0.12) * this.height,
                            64,
                            64,
                            0x000000
                        ).setOrigin(0.5),
                        marked: true,
                        value: null,
                        marker: null
                    };
                    continue;
                }

                this.matriz[i][j] = produtos[prodIndex++];
                const quad = this.add.sprite((0.4 + j * 0.07) * this.width, (0.38 + i * 0.12) * this.height, 'quadrado').setScale(1.1).setInteractive({ useHandCursor: true });
                const prodText = this.add.text(quad.x, quad.y, this.matriz[i][j], {
                    fontSize: '36px',
                    color: '#000',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                this.quadradosGrid[i][j] = {
                    sprite: quad,
                    text: prodText,
                    value: this.matriz[i][j],
                    marked: false,
                    marker: null
                };

                quad.on('pointerdown', () => {
                    if (this.turnTime.value > 0) {
                        this.selectProduct(i, j);
                    }
                });
            }
        }

        for (let i = 0; i < 5; i++) {
            const quad = this.add.sprite(0.85 * this.width, (0.43 + i * 0.1) * this.height, 'quadrado').setScale(1).setInteractive({ useHandCursor: true });
            const numText = this.add.text(quad.x, quad.y, this.numerosColuna[i], {
                fontSize: '64px',
                color: '#000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.quadradosNumeros.push({
                sprite: quad,
                text: numText,
                value: this.numerosColuna[i]
            });

            quad.on('pointerdown', () => {
                if (this.turnTime.value > 0) {
                    this.selectNumber(i);
                }
            });
        }
    }

    setupUIElements() {
        this.score1 = 0;
        this.score2 = 0;
        this.scoreText = this.add.text(180, 290, `${this.score1}-${this.score2}`, { fontSize: '64px', fill: '#049' });
        this.lapis = this.add.sprite(0.305 * this.width, 0.68 * this.height, 'lapis').setScale(1.2);
    }

    startPlayerTurn() {
        this.playerTurnText.setText(`Jogador ${this.currentPlayer.value}`);
        this.playerTurnText.setColor(this.currentPlayer.value === 1 ? '#FF0000' : '#0000FF');
        this.turnTime.value = 10;
        this.timeText.setText(this.turnTime.value);

        this.selectedProduct = null;
        this.selectedNumbers = [];
        this.selectedProductPos = null;

        if (this.turnTimer) {
            this.time.removeEvent(this.turnTimer);
        }

        this.turnTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.turnTime.value--;
                this.timeText.setText(this.turnTime.value);

                if (this.turnTime.value <= 0) {
                    this.switchPlayer();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    switchPlayer() {
        this.currentPlayer.value = this.currentPlayer.value === 1 ? 2 : 1;
        this.startPlayerTurn();
    }

    validateMultiplication() {
        if (this.selectedProduct === null || this.selectedNumbers.length !== 2) {
            return;
        }

        const num1 = this.selectedNumbers[0].value;
        const num2 = this.selectedNumbers[1].value;
        const product = this.selectedProduct;

        const isCorrect = (num1 * num2 === product);
        const scoringPlayer = isCorrect ? this.currentPlayer.value : (this.currentPlayer.value === 1 ? 2 : 1);

        this.markGridPosition(this.selectedProductPos.row, this.selectedProductPos.col, scoringPlayer);
        this.updateScore(scoringPlayer);

        if (this.checkGameOver()) {
            this.endGame();
        } else {
            this.switchPlayer();
        }
    }

    updateScore(scoringPlayer) {
        if (scoringPlayer === 1) {
            this.score1++;
        } else {
            this.score2++;
        }
        this.scoreText.setText(`${this.score1}-${this.score2}`);
    }

    markGridPosition(row, col, player) {
        const marker = this.add.text(
            this.quadradosGrid[row][col].sprite.x,
            this.quadradosGrid[row][col].sprite.y,
            player === 1 ? 'X' : 'O',
            {
                fontSize: '48px',
                fontFamily: 'Arial',
                color: player === 1 ? '#FF0000' : '#0000FF'
            }
        ).setOrigin(0.5);

        this.quadradosGrid[row][col].marked = true;
        this.quadradosGrid[row][col].marker = marker;
    }

    checkGameOver() {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!this.quadradosGrid[i][j].marked) {
                    return false;
                }
            }
        }
        return true;
    }

    endGame() {
        if (this.turnTimer) {
            this.time.removeEvent(this.turnTimer);
            this.turnTimer = null;
        }

        let resultText;
        if (this.score1 > this.score2) {
            resultText = "Jogador 1 venceu!";
        } else if (this.score2 > this.score1) {
            resultText = "Jogador 2 venceu!";
        } else {
            resultText = "Empate!";
        }

        const overlay = this.add.rectangle(
            this.width * 0.5,
            this.height * 0.5,
            this.width,
            this.height,
            0x000000,
            0.7
        );

        const gameOverText = this.add.text(
            this.width * 0.5,
            this.height * 0.5,
            resultText,
            {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setDepth(1);

        const menuButtonBg = this.add.rectangle(
            this.width * 0.5,
            this.height * 0.6,
            200,
            50,
            0x000000
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);

        const menuButton = this.add.text(
            this.width * 0.5,
            this.height * 0.6,
            "Voltar ao Menu",
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                padding: { x: 15, y: 8 }
            }
        ).setOrigin(0.5).setDepth(2);

        menuButtonBg.on('pointerdown', () => {
            this.cleanupGameObjects();
            this.scene.start('Menu');
        });
    }

    selectProduct(row, col) {
        if (this.quadradosGrid[row][col].marked) {
            return;
        }

        if (this.selectedProduct !== null) {
            const prev = this.selectedProductPos;
            if (prev) {
                this.quadradosGrid[prev.row][prev.col].sprite.setTint(0xffffff);
            }
        }

        this.selectedProduct = this.matriz[row][col];
        this.selectedProductPos = { row, col };
        this.quadradosGrid[row][col].sprite.setTint(0xffff00);

        if (this.selectedNumbers.length === 2) {
            this.validateMultiplication();
        }
    }

    selectNumber(index) {
        const number = this.numerosColuna[index];

        if (this.selectedNumbers.length === 2) {
            this.selectedNumbers = [];
            this.quadradosNumeros.forEach(num => {
                num.sprite.setTint(0xffffff);
            });
        }

        this.selectedNumbers.push({
            index,
            value: number
        });

        this.quadradosNumeros[index].sprite.setTint(0xffff00);

        if (this.selectedProduct !== null && this.selectedNumbers.length === 2) {
            this.validateMultiplication();
        }
    }

    handleButtonClick(gameObject) {
        if (gameObject === this.btHome) {
            this.cleanupGameObjects();
            this.scene.start('Menu');
        }
    }

    gerarNumerosUnicos(qtd, min, max) {
        let numeros = new Set();
        while (numeros.size < qtd) {
            numeros.add(Phaser.Math.Between(min, max));
        }
        return Array.from(numeros);
    }

    cleanupGameObjects() {
        this.selectedProduct = null;
        this.selectedNumbers = [];
        this.selectedProductPos = null;

        if (this.turnTimer) {
            this.time.removeEvent(this.turnTimer);
            this.turnTimer = null;
        }
    }
};