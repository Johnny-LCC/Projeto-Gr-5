// Global variables
var width;
var height;
var score1 = 0;
var score2 = 0;
var scoreText;
var timeText;
var selectedProduct = null;
var selectedNumbers = [];
var selectedProductPos = null;

// Make JogoPvP globally accessible
window.JogoPvP = class JogoPvP extends Phaser.Scene {

    constructor() {
        super('JogoPvP');
    }

    // Preload assets
    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('btPVP', 'assets/bt-level0.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
        this.load.image('ampTempo', 'assets/ampulhetaTempo.png');
    }

    // Create the game scene
    create() {
        width = game.config.width;
        height = game.config.height;

        this.setupGameBoard();
        this.setupUIElements();

        // Start the timer for the first player's turn
        this.turnTime = { value: 10 };
        this.currentPlayer = { value: 1 };
        this.turnTimer = { value: null };
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

    // Update the game state
    update() {
        // Add per-frame updates if needed
    }

    // Setup the game board
    setupGameBoard() {
        // Background
        this.background = this.add.sprite(0.5 * width, 0.5 * height, 'background').setScale(1.5);

        // Title
        this.titulo = this.add.sprite(0.605 * width, 0.16 * height, 'titulo').setScale(1.7);

        // Home button
        this.btHome = this.add.sprite(0.07 * width, 0.89 * height, 'home').setScale(1.2).setInteractive({ useHandCursor: true });

        // PVP button
        this.btPVP = this.add.sprite(0.135 * width, 0.18 * height, 'btPVP').setScale(1);

        // Timer setup
        this.ampulheta = this.add.sprite(0.21 * width, 0.45 * height, 'ampTempo').setScale(0.8);
        timeText = this.add.text(0.21 * width, 0.45 * height, 10, {
            fontSize: '48px',
            fill: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Player turn indicator
        this.playerTurnText = this.add.text(0.21 * width, 0.35 * height, 'Jogador 1', {
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
                            (0.4 + midCol * 0.07) * width,
                            (0.38 + midRow * 0.12) * height,
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
                let quad = this.add.sprite((0.4 + j * 0.07) * width, (0.38 + i * 0.12) * height, 'quadrado').setScale(1.1).setInteractive({ useHandCursor: true });
                let prodText = this.add.text(quad.x, quad.y, this.matriz[i][j], {
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

                quad.on('pointerdown', () => this.selectProduct(i, j));
            }
        }

        for (let i = 0; i < 5; i++) {
            let quad = this.add.sprite(0.85 * width, (0.43 + i * 0.1) * height, 'quadrado').setScale(1).setInteractive({ useHandCursor: true });
            let numText = this.add.text(quad.x, quad.y, this.numerosColuna[i], {
                fontSize: '64px',
                color: '#000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.quadradosNumeros.push({
                sprite: quad,
                text: numText,
                value: this.numerosColuna[i]
            });

            quad.on('pointerdown', () => this.selectNumber(i));
        }
    }

    // Setup UI elements
    setupUIElements() {
        score1 = 0;
        score2 = 0;
        scoreText = this.add.text(180, 290, `${score1}-${score2}`, { fontSize: '64px', fill: '#049' });
        this.lapis = this.add.sprite(0.305 * width, 0.68 * height, 'lapis').setScale(1.2);
    }

    // Start a player's turn
    startPlayerTurn() {
        this.playerTurnText.setText(`Jogador ${this.currentPlayer.value}`);
        this.playerTurnText.setColor(this.currentPlayer.value === 1 ? '#FF0000' : '#0000FF');
        this.turnTime.value = 10;
        timeText.setText(this.turnTime.value);

        selectedProduct = null;
        selectedNumbers = [];
        selectedProductPos = null;

        if (this.turnTimer.value) {
            this.time.removeEvent(this.turnTimer.value);
        }

        this.turnTimer.value = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.turnTime.value--;
                timeText.setText(this.turnTime.value);

                if (this.turnTime.value <= 0) {
                    this.switchPlayer();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    // Switch to the next player
    switchPlayer() {
        this.currentPlayer.value = this.currentPlayer.value === 1 ? 2 : 1;
        this.startPlayerTurn();
    }

    // Validate the selected multiplication
    validateMultiplication() {
        if (selectedProduct === null || selectedNumbers.length !== 2) {
            return;
        }

        const num1 = selectedNumbers[0].value;
        const num2 = selectedNumbers[1].value;
        const product = selectedProduct;

        const isCorrect = (num1 * num2 === product);
        const scoringPlayer = isCorrect ? this.currentPlayer.value : (this.currentPlayer.value === 1 ? 2 : 1);

        this.markGridPosition(selectedProductPos.row, selectedProductPos.col, scoringPlayer);
        this.updateScore(scoringPlayer);

        if (this.checkGameOver()) {
            this.endGame();
        } else {
            this.switchPlayer();
        }
    }

    // Mark a grid position
    markGridPosition(row, col, player) {
        const marker = this.add.text(
            this.quadradosGrid[row][col].sprite.x,
            this.quadradosGrid[row][col].sprite.y,
            player === 1 ? 'X' : 'O',
            {
                fontSize: '48px',
                color: player === 1 ? '#FF0000' : '#0000FF',
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5);

        this.quadradosGrid[row][col].marked = true;
        this.quadradosGrid[row][col].marker = marker;
    }

    // Update the score
    updateScore(scoringPlayer) {
        if (scoringPlayer === 1) {
            score1++;
        } else {
            score2++;
        }
        scoreText.setText(`${score1}-${score2}`);
    }

    // Check if the game is over
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

    // End the game
    endGame() {
        if (this.turnTimer.value) {
            this.time.removeEvent(this.turnTimer.value);
            this.turnTimer.value = null;
        }

        let resultText;
        if (score1 > score2) {
            resultText = "Jogador 1 venceu!";
        } else if (score2 > score1) {
            resultText = "Jogador 2 venceu!";
        } else {
            resultText = "Empate!";
        }

        const overlay = this.add.rectangle(
            width * 0.5,
            height * 0.5,
            width,
            height,
            0x000000,
            0.7
        );

        const gameOverText = this.add.text(
            width * 0.5,
            height * 0.5,
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
            width * 0.5,
            height * 0.6,
            200,
            50,
            0x000000
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);

        const menuButton = this.add.text(
            width * 0.5,
            height * 0.6,
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

    // Generate unique numbers
    gerarNumerosUnicos(qtd, min, max) {
        let numeros = new Set();
        while (numeros.size < qtd) {
            numeros.add(Phaser.Math.Between(min, max));
        }
        return Array.from(numeros);
    }

    // Handle product selection
    selectProduct(row, col) {
        if (this.quadradosGrid[row][col].marked) {
            return;
        }

        if (selectedProduct !== null) {
            const prev = selectedProductPos;
            if (prev) {
                this.quadradosGrid[prev.row][prev.col].sprite.setTint(0xffffff);
            }
        }

        selectedProduct = this.matriz[row][col];
        selectedProductPos = { row, col };
        this.quadradosGrid[row][col].sprite.setTint(0xffff00);

        if (selectedNumbers.length === 2) {
            this.validateMultiplication();
        }
    }

    // Handle number selection
    selectNumber(index) {
        const number = this.numerosColuna[index];

        if (selectedNumbers.length === 2) {
            selectedNumbers = [];
            this.quadradosNumeros.forEach(num => {
                num.sprite.setTint(0xffffff);
            });
        }

        selectedNumbers.push({
            index,
            value: number
        });

        this.quadradosNumeros[index].sprite.setTint(0xffff00);

        if (selectedProduct !== null && selectedNumbers.length === 2) {
            this.validateMultiplication();
        }
    }

    // Handle button clicks
    handleButtonClick(gameObject) {
        if (gameObject === this.btHome) {
            this.cleanupGameObjects();
            this.scene.start('Menu');
        }
    }

    // Clean up objects before transitioning scenes
    cleanupGameObjects() {
        selectedProduct = null;
        selectedNumbers = [];
        selectedProductPos = null;

        if (this.turnTimer.value) {
            this.time.removeEvent(this.turnTimer.value);
            this.turnTimer.value = null;
        }
    }
};