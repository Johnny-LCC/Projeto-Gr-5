// Global variables
var width;
var height;
var score1 = 0;
var score2 = 0;
var selectedProduct = null;
var selectedNumbers = [];
var selectedProductPos = null;
var level;

// Extend JogoPvE functionality
window.JogoPvE = class JogoPvE extends Phaser.Scene {
    constructor() {
        super('JogoPvE');
        this.width = null;
        this.height = null;
        this.score1 = 0;
        this.score2 = 0;
        this.selectedProduct = null;
        this.selectedNumbers = [];
        this.selectedProductPos = null;
        this.level = null;
        this.turnTime = { value: 10 };
        this.isPlayerTurn = true;
    }

    init(data) {
        this.level = data.level;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('btPVE1', 'assets/bt-level1.png');
        this.load.image('btPVE2', 'assets/bt-level2.png');
        this.load.image('btPVE3', 'assets/bt-level3.png');
        this.load.image('ampTempo', 'assets/ampulhetaTempo.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
        this.load.image('quadrado-azul', 'assets/quadrado-azul.png');
        this.load.image('quadrado-vermelho', 'assets/quadrado-vermelho.png');
        this.load.image('assinalaazul', 'assets/assinalaazul.png');
        this.load.image('assinalavermelho', 'assets/assinalavermelho.png');
    }

    create() {
        this.width = this.game.config.width;
        this.height = this.game.config.height;

        this.setupGameBoard();
        this.setupUIElements();

        // Start the player's turn
        this.startTurn(true);

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

        // PVE button based on level
        const pveButtonAsset = `btPVE${this.level}`;
        this.btPVP = this.add.sprite(0.135 * this.width, 0.18 * this.height, pveButtonAsset).setScale(1);

        // Timer setup
        this.ampulheta = this.add.sprite(0.135 * this.width, 0.4 * this.height, 'ampTempo').setScale(1);
        this.timeText = this.add.text(0.142 * this.width, 0.4 * this.height, this.turnTime.value, {
            fontSize: '64px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Turn indicator setup
        this.turnIndicator = this.add.text(0.285 * this.width, 0.4 * this.height, '', {
            fontSize: '48px',
            fill: '#fff', /////
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
                            1,
                            1,
                            0x56C8D7
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
                    fontSize: '64px',
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
                    if (this.isPlayerTurn) {
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
                if (this.isPlayerTurn) {
                    this.selectNumber(i);
                }
            });
        }
    }

    setupUIElements() {
        this.score1 = 0;
        this.score2 = 0;
        this.scoreText = this.add.text(180, 290, `${this.score1} - ${this.score2}`, { fontSize: '64px', fill: '#049' }); /////
        this.lapis = this.add.sprite(0.305 * this.width, 0.68 * this.height, 'lapis').setScale(1.2);
    }

    startTurn(isPlayer) {
        this.isPlayerTurn = isPlayer;
        this.turnIndicator.setText(isPlayer ? 'Jogador' : 'Máquina');
        this.turnIndicator.setColor(isPlayer ? '#FF0000' : '#0000FF');

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
                    this.time.removeEvent(this.turnTimer);
                    this.startTurn(!isPlayer);
                }
            },
            callbackScope: this,
            loop: true
        });

        if (!isPlayer) {
            this.time.delayedCall(3000, () => { //2500*this.level
                this.machineTurn();
            });
        }
    }

    machineTurn() {
        const unmarkedProducts = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (!this.quadradosGrid[i][j].marked) {
                    unmarkedProducts.push({ row: i, col: j, value: this.matriz[i][j] });
                }
            }
        }

        if (unmarkedProducts.length === 0) {
            this.endGame();
            return;
        }

        const randomProduct = Phaser.Utils.Array.GetRandom(unmarkedProducts);
        const { row, col, value } = randomProduct;

        let accuracy = 0.5;
        if (this.level === 2) accuracy = 0.75;
        else if (this.level === 3) accuracy = 0.9;

        const factors = this.findFactors(value);
        const isCorrect = Math.random() < accuracy;

        if (isCorrect && factors.length >= 2) {
            this.markGridPosition(row, col, false);
            this.updateScore(false);
        } else {
            this.markGridPosition(row, col, true);
            this.updateScore(true);
        }

        if (this.checkGameOver()) {
            this.endGame();
        } else {
            this.startTurn(true);
        }
    }

    findFactors(product) {
        let factors = [];
        for (let i = 0; i < this.numerosColuna.length; i++) {
            for (let j = 0; j < this.numerosColuna.length; j++) {
                if (this.numerosColuna[i] * this.numerosColuna[j] === product) {
                    factors.push(this.numerosColuna[i], this.numerosColuna[j]);
                    return factors;
                }
            }
        }
        return factors;
    }

    validateMultiplication() {
        if (this.selectedProduct === null || this.selectedNumbers.length !== 2) {
            return;
        }

        const num1 = this.selectedNumbers[0].value;
        const num2 = this.selectedNumbers[1].value;
        const product = this.selectedProduct;

        const isCorrect = (num1 * num2 === product);
        if (isCorrect) {
            this.markGridPosition(this.selectedProductPos.row, this.selectedProductPos.col, true);
            this.updateScore(true);
        } else {
            this.markGridPosition(this.selectedProductPos.row, this.selectedProductPos.col, false);
            this.updateScore(false);
        }

        if (this.checkGameOver()) {
            this.endGame();
        } else {
            this.startTurn(false);
        }
    }

    updateScore(isPlayer) {
        if (isPlayer) {
            this.score1++;
        } else {
            this.score2++;
        }
        this.scoreText.setText(`${this.score1} - ${this.score2}`);
    }

    markGridPosition(row, col, isPlayer) {
        const newBox = this.add.sprite(
            this.quadradosGrid[row][col].sprite.x,
            this.quadradosGrid[row][col].sprite.y,
            'quadrado'
        ).setScale(1.1).setDepth(1);

        const marker = this.add.sprite(
            this.quadradosGrid[row][col].sprite.x,
            this.quadradosGrid[row][col].sprite.y,
            isPlayer ? 'assinalavermelho' : 'assinalaazul'
        ).setOrigin(0.5).setDepth(1);

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
            resultText = "Maquina venceu!";
        } else {
            resultText = "Empate!";
        }

        const overlay = this.background.setDepth(2);
        const title = this.titulo.setDepth(2);

        const rect = this.add.rectangle(0.5 * width, 0.6 * height, 0.45 * width, 0.3 * height, 0x4270FE).setOrigin(0.5).setDepth(2);

        const gameOverText = this.add.text(
            this.width * 0.5,
            this.height * 0.5,
            resultText,
            {
                fontSize: '100px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                //padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setDepth(2);

        let newMenuButton = this.add.sprite(width * 0.5, height * 0.65, 'home').setScale(1.2).setInteractive({ useHandCursor: true }).setDepth(2);

        newMenuButton.on('pointerdown', () => {
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