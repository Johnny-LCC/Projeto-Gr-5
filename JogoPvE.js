let width;
let height;

let score1 = 0;
let score2 = 0;
let scoreText;

let time = 10.0;
let timeText;

window.JogoPvE = class JogoPvE extends Phaser.Scene {
    constructor() {
        super('JogoPvE');
    }

    init(data){
        this.level = data.level;
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.image('titulo','assets/titulo.png');
        this.load.image('btPVE1', 'assets/bt-level1.png');
        this.load.image('btPVE2', 'assets/bt-level2.png');
        this.load.image('btPVE3', 'assets/bt-level3.png');
        this.load.image('ampTempo', 'assets/ampulhetaTempo.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
    }

    create() {
        width = this.game.config.width;
        height = this.game.config.height;

        this.background = this.add.sprite(0.5 * width, 0.5 * height,'background');     
        this.background.setScale(1.5);
        
        //Titulo
        this.titulo = this.add.sprite(0.605 * width, 0.16 * height,'titulo');
        this.titulo.setScale(1.7);

        //Home
        this.btHome = this.add.sprite(0.07 * width, 0.89 * height, 'home');
        this.btHome.setScale(1.2);
        this.btHome.setInteractive({useHandCursor: true});

        //PVE
        this.btPVE = this.add.sprite(0.135 * width, 0.18 * height, 'btPVE1');
        this.btPVE.setScale(1);

        //Ampulheta
        this.ampTempo = this.add.sprite(0.135 * width, 0.4 * height, 'ampTempo');
        this.ampTempo.setScale(1);

        this.tempoRestante = 10;
        this.contadorAtivo = false;
        this.textoTempo = this.add.text(this.ampTempo.x, this.ampTempo.y, this.tempoRestante, {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        let numerosColuna = gerarNumerosUnicos(5, 1, 9);

        // Criar lista de produtos únicos entre dois números distintos da coluna
        let produtos = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                produtos.push(numerosColuna[i] * numerosColuna[j]);
            }
        }
        
        // Embaralhar a lista de produtos para distribuição aleatória
        Phaser.Utils.Array.Shuffle(produtos);
        
        // Criar matriz vazia 5x5
        let matriz = Array.from({ length: 5 }, () => Array(5).fill(null));
        
        // Preencher a matriz aleatoriamente com os produtos
        let indicesLivres = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                indicesLivres.push({ i, j });
            }
        }
        
        // Embaralhar os índices para posicionamento aleatório
        Phaser.Utils.Array.Shuffle(indicesLivres);
        
        // Preencher a matriz com os produtos nos índices embaralhados
        for (let k = 0; k < produtos.length; k++) {
            let { i, j } = indicesLivres[k];
            matriz[i][j] = produtos[k];
        }
        
        // Exibir números na coluna à direita
        for (let i = 0; i < 5; i++) {
            let quad = this.add.sprite(0.85 * width, (0.43 + i * 0.1) * height, 'quadrado');
            quad.setScale(1);
            quad.setInteractive({useHandCursor: true});
            this.add.text(quad.x, quad.y, numerosColuna[i], {
                fontSize: '64px',
                color: '#000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            quad.on('pointerdown', () => {
                if (!this.contadorAtivo) {
                    this.iniciarContador();
                }
            });
        }
        
        // Exibir matriz com produtos posicionados aleatoriamente
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let quad = this.add.sprite((0.4 + j * 0.07) * width, (0.38 + i * 0.12) * height, 'quadrado');
                quad.setScale(1.1);
                if (i == 2 && j == 2) {
                    // Adiciona um retângulo azul em cima do sprite
                    const overlay = this.add.rectangle( quad.x, quad.y, quad.width, quad.height, 0x56C8D7);
                    overlay.setScale(1.1);
                    overlay.setDepth(1);
                }
                else {
                    quad.setInteractive({useHandCursor: true});
                    if (matriz[i][j] !== null) {
                        this.add.text(quad.x, quad.y, matriz[i][j], {
                            fontSize: '64px',
                            color: '#000',
                            fontFamily: 'Arial'
                        }).setOrigin(0.5);
                    }
                }
            }
        }

        //Lapis
        this.lapis = this.add.sprite(0.305 * width, 0.68 * height, 'lapis');
        this.lapis.setScale(1.2);

        // BT Logic
        this.input.on('gameobjectover', function(pointer, gameObject) {
            gameObject.displayHeight += 5;
            gameObject.displayWidth += 5;
        }, this);
        this.input.on('gameobjectout', function(pointer, gameObject) {
            gameObject.displayHeight -= 5;
            gameObject.displayWidth -= 5;
        }, this);
        this.input.on('gameobjectdown', function(pointer, gameObject) {
            switch (gameObject) {
                case this.btHome:
                    this.scene.start('Menu');
                    break;
                default:
                    break;
            }
        }, this);
    }
    iniciarContador() {
        this.contadorAtivo = true;
        this.temporizador = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.tempoRestante--;
                this.textoTempo.setText(this.tempoRestante);
                if (this.tempoRestante <= 0) {
                    this.temporizador.remove();
                    this.contadorAtivo = false;
                    // Aqui pode adicionar uma ação ao terminar o tempo
                    console.log('Tempo esgotado!');
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    
    //update(){}
}

function gerarNumerosUnicos(qtd, min, max) {
    let numeros = new Set();
    while (numeros.size < qtd) {
        numeros.add(Phaser.Math.Between(min, max));
    }
    return Array.from(numeros);
}