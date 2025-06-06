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
//var multText = "";

// Make JogoPvP globally accessible
class JogoPvP extends Phaser.Scene {

    constructor() {
        super('JogoPvP');
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('btPVP', 'assets/bt-level0.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
        this.load.image('ampTempo', 'assets/ampulhetaTempo.png');
        this.load.image('quadrado-azul', 'assets/quadrado-azul.png');
        this.load.image('quadrado-vermelho', 'assets/quadrado-vermelho.png');
        this.load.image('quadrado-verde', 'assets/quadrado-verde.png');
        this.load.image('quadrado-amarelo', 'assets/quadrado-amarelo.png');
        this.load.image('quadrado-roxo', 'assets/quadrado-roxo.png');
        this.load.image('assinalaazul', 'assets/assinalaazul.png');
        this.load.image('assinalavermelho', 'assets/assinalavermelho.png');
   }

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

    update() {}

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
        this.ampTempo = this.add.sprite(0.135 * width, 0.4 * height, 'ampTempo').setScale(1);
        timeText = this.add.text(0.142 * width, 0.4 * height, 10, {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Player turn indicator
        this.playerTurnText = this.add.text(0.285 * width, 0.4 * height, 'Jogador 1', {
            fontSize: '48px',
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
                            1,
                            1,
                            0x56C8D7
                        ).setOrigin(0.5).setScale(1.1),
                        marked: true,
                        value: null,
                        marker: null
                    };
                    continue;
                }

                this.matriz[i][j] = produtos[prodIndex++];
                let quad = this.add.sprite((0.4 + j * 0.07) * width, (0.38 + i * 0.12) * height, 'quadrado').setScale(1.1).setInteractive({ useHandCursor: true });
                let prodText = this.add.text(quad.x, quad.y, this.matriz[i][j], {
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
                value: this.numerosColuna[i],
            });

            quad.on('pointerdown', () => this.selectNumber(i));
        }
    }

    // Setup UI elements
    setupUIElements() {
        score1 = 0;
        score2 = 0;
        scoreText = this.add.text(180, 290, `${score1} - ${score2}`, { fontSize: '64px', fill: '#049' });
        this.multText = "";
        this.mult = this.add.text(0.545 * width, 0.95 * height, this.multText, { fontFamily: 'Arial', fontSize: '48px', fill: '#ffffff' }).setOrigin(0.5);
        this.lapis = this.add.sprite(0.3 * width, 0.68 * height, 'lapis').setScale(1.2);
        this.lapis.setInteractive({useHandCursor: true});
        this.lapis.on('pointerdown', () => {
            this.quadradosNumeros.forEach(num => {
                num.sprite.setTexture('quadrado');
            });
            selectedNumbers = [];
            selectedProduct = null;
            selectedProductPos = null;
            this.multText = "";
            this.mult.setText(this.multText);
        });
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
        this.multText = "";
        this.mult.setText(this.multText);

        if (this.turnTimer.value) {
            this.turnTimer.value.remove();
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
        this.quadradosNumeros.forEach(num => {
            num.sprite.setTexture('quadrado');
        });
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
        if (isCorrect) {
            // Format the complete equation with the correct product
            this.multText = num1 + " X " + num2 + " = " + product;
            this.mult.setText(this.multText);
            
            this.markGridPosition(selectedProductPos.row, selectedProductPos.col, this.currentPlayer.value);
            this.updateScore(this.currentPlayer.value);
            
            this.time.delayedCall(1500, () => {
                this.quadradosNumeros.forEach(num => {
                    num.sprite.setTexture('quadrado');
                });

                this.multText = "";
                this.mult.setText(this.multText);

                if (this.checkGameOver()) {
                    this.endGame();
                } else {
                    this.switchPlayer();
                }
            });
        } else {
            // Format the complete equation with the incorrect product
            this.multText = num1 + " X " + num2 + " = " + product;
            this.mult.setText(this.multText);
            
            this.time.delayedCall(1500, () => {
                this.quadradosNumeros.forEach(num => {
                    num.sprite.setTexture('quadrado');
                });

                this.multText = "";
                this.mult.setText(this.multText);

                if (this.checkGameOver()) {
                    this.endGame();
                } else {
                    this.switchPlayer();
                }
            });
        }
    }

    // Mark a grid position
    markGridPosition(row, col, player) {
        const marker = this.add.sprite(
            this.quadradosGrid[row][col].sprite.x,
            this.quadradosGrid[row][col].sprite.y,
            player === 1 ? 'assinalavermelho' : 'assinalaazul'
        ).setOrigin(0.5).setDepth(1);

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
        scoreText.setText(`${score1} - ${score2}`);
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
            this.turnTimer.value.remove(); 
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
        
        const overlay = this.background.setDepth(2);
        const title = this.titulo.setDepth(2);

        const rect = this.add.rectangle(0.5 * width, 0.6 * height, 0.45 * width, 0.3 * height, 0x4270FE).setOrigin(0.5).setDepth(2);
        
        const gameOverText = this.add.text(
            width * 0.5,
            height * 0.5,
            resultText,
            {
                fontSize: '100px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
            }
        ).setOrigin(0.5).setDepth(2);

        let newMenuButton = this.add.sprite(width * 0.5, height * 0.65, 'home').setScale(1.2).setInteractive({ useHandCursor: true }).setDepth(2);

        newMenuButton.on('pointerdown', () => {
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
        }

        selectedProduct = this.matriz[row][col];
        selectedProductPos = { row, col };

        if (selectedNumbers.length === 2) {
            this.validateMultiplication();
        }
    }

    // Handle number selection
    selectNumber(index) {
        const number = this.numerosColuna[index];
        var quadrado = this.quadradosNumeros[index]; 

        if (selectedNumbers.length === 2) {
            selectedNumbers = [];
            this.quadradosNumeros.forEach(num => {
                num.sprite.setTexture('quadrado');
            });

            this.multText = "";
            this.mult.setText(this.multText);
        }
        
        selectedNumbers.push({
            index,
            value: number
        });
        
        if (selectedNumbers.length === 2 && selectedNumbers[1].value === selectedNumbers[0].value) {
            quadrado.sprite.setTexture('quadrado-roxo');
        } else {
            this.currentPlayer.value === 1 ? quadrado.sprite.setTexture('quadrado-vermelho') : quadrado.sprite.setTexture('quadrado-azul');
        }

        if (selectedNumbers.length === 1) {
            this.multText = number + " X ";
        } else if (selectedNumbers.length === 2) {
            this.multText = selectedNumbers[0].value + " X " + number + " =";
        }
        this.mult.setText(this.multText);
        
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
            this.turnTimer.value.remove();
            this.turnTimer.value = null;
        }
        this.multText = "";
    }
}