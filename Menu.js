let width ;
let height;
let callOnce = 0;

let score1 = 0;
let score2 = 0;
let scoreText;
let time = 10.0;
let timeText;
let level = 1;

class Menu extends Phaser.Scene {

    constructor() {
        super('Menu');
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.image('titulo','assets/titulo.png');
        this.load.image('btCreditos','assets/bt-creditos.png');
        this.load.image('btInstrucoes', 'assets/bt-instrucoes.png');
        this.load.image('btTop', 'assets/bt-top.png');
        this.load.image('btPVP', 'assets/bt-level0.png');
        this.load.image('btLvl1', 'assets/bt-level1.png');
        this.load.image('btLvl2', 'assets/bt-level2.png');
        this.load.image('btLvl3', 'assets/bt-level3.png');
        this.load.image('lapis', 'assets/lapis.png');

        this.load.image('creditos', 'assets/creditos-img.png');
        this.load.image('instrucoes', 'assets/instrucoes-img.png');
        this.load.image('btFechar', 'assets/bt-fechar.png');
    }

    create() {
        //Variáveis a ser usadas para adicionar os sprites
        width = game.config.width;
        height = game.config.height;

        //Background
        this.background = this.add.sprite(0.5 * width, 0.5 * height,'background');     
        this.background.setScale(1.5);
        
        //Titulo
        this.titulo = this.add.sprite(0.6 * width, 0.16 * height,'titulo');
        this.titulo.setScale(1.7);

        //Creditos-bt
        this.btCreditos = this.add.sprite(0.94 * width, 0.90 * height, 'btCreditos');
        this.btCreditos.setScale(1.2);
        this.btCreditos.setInteractive({ useHandCursor: true });

        //Instrucoes-bt
        this.btInstrucoes = this.add.sprite(0.94 * width, 0.74 * height, 'btInstrucoes');
        this.btInstrucoes.setScale(1.2);
        this.btInstrucoes.setInteractive({ useHandCursor: true });

        //Top-bt
        this.btTop = this.add.sprite(0.94 * width, 0.58 * height, 'btTop');
        this.btTop.setScale(1.2);
        this.btTop.setInteractive({useHandCursor: true});

        //PVP
        this.btPVP = this.add.sprite(0.565 * width, 0.365 * height, 'btPVP');
        this.btPVP.setScale(1);
        this.btPVP.setInteractive({useHandCursor: true});

        //Level1
        this.btLvl1 = this.add.sprite(0.565 * width, 0.54 * height, 'btLvl1');
        this.btLvl1.setScale(1);
        this.btLvl1.setInteractive({useHandCursor: true});

        //Level2
        this.btLvl2 = this.add.sprite(0.565 * width, 0.715 * height, 'btLvl2');
        this.btLvl2.setScale(1);
        this.btLvl2.setInteractive({useHandCursor: true});
        
        //level3
        this.btLvl3 = this.add.sprite(0.565 * width, 0.89 * height, 'btLvl3');
        this.btLvl3.setScale(1);
        this.btLvl3.setInteractive({useHandCursor: true});

        //Lapis
        this.lapis = this.add.sprite(0.435 * width, 0.66 * height, 'lapis');
        this.lapis.setScale(1.35);

        //Creditos-img
        this.cerditos = this.add.sprite(0.5*width, 0.5*height, 'creditos');
        this.cerditos.setScale(1.5);
        this.cerditos.visible = false;

        //Instrucoes-img
        this.instrucoes = this.add.sprite(0.5*width, 0.5*height, 'instrucoes');
        this.instrucoes.setScale(1.5);
        this.instrucoes.visible = false;

        //bt-fechar
        this.btFechar = this.add.sprite(0.94*width, 0.1*height, 'btFechar');
        this.btFechar.setScale(1.1);
        this.btFechar.setInteractive({useHandCursor: true});
        this.btFechar.visible = false;        

        //BT Logic
        //BT Highlight
        this.input.on('gameobjectover',function(pointer, gameObject) {
            gameObject.displayHeight += 5;
            gameObject.displayWidth += 5;
        },this);
        this.input.on('gameobjectout',function(pointer, gameObject) {
            gameObject.displayHeight -= 5;
            gameObject.displayWidth -= 5;
        },this);
        this.input.on('gameobjectdown', function(pointer, gameObject) {
            switch(gameObject) {
                case this.btPVP:
                    this.scene.transition({ target: 'JogoPvP', duration: 10 });
                    break;
                case this.btLvl1:
                    this.scene.transition({ target: 'JogoPvE', duration: 10, data: {level: 1} });
                    break;
                case this.btLvl2:
                    this.scene.transition({ target: 'JogoPvE', duration: 10, data: {level: 2} });
                    break;
                case this.btLvl3:
                    this.scene.transition({ target: 'JogoPvE', duration: 10, data: {level: 3} });
                    break;
                case this.btCreditos:
                    this.cerditos.visible = true;
                    this.instrucoes.visible = false;
                    this.btFechar.visible = true;
                    this.titulo.visible = false;
                    this.btPVP.visible = false;
                    this.btLvl1.visible = false;
                    this.btLvl2.visible = false;
                    this.btLvl3.visible = false;
                    this.lapis.visible = false;
                    break;
                case this.btInstrucoes:
                    this.cerditos.visible = false;
                    this.instrucoes.visible = true;
                    this.btFechar.visible = true;
                    this.titulo.visible = false;
                    this.btPVP.visible = false;
                    this.btLvl1.visible = false;
                    this.btLvl2.visible = false;
                    this.btLvl3.visible = false;
                    this.lapis.visible = false;
                    break;
                case this.btFechar:
                    this.cerditos.visible = false;
                    this.instrucoes.visible = false;
                    this.btFechar.visible = false;
                    this.titulo.visible = true;
                    this.btPVP.visible = true;
                    this.btLvl1.visible = true;
                    this.btLvl2.visible = true;
                    this.btLvl3.visible = true;
                    this.lapis.visible = true;
                    break;
                default:
                    break;
            }    
        },this);
    }

    update() {
        width = game.config.width;
        height = game.config.height;
    }
}

class JogoPvP extends Phaser.Scene {

    constructor() {
        super('JogoPvP');
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.image('titulo','assets/titulo.png');
        this.load.image('btPVP', 'assets/bt-level0.png');
        this.load.image('home', 'assets/bt_home.png');
        this.load.image('quadrado', 'assets/quadrado-recebenumeros.png');
        this.load.image('lapis', 'assets/lapis.png');
    }

    create() {
        //Variáveis a ser usadas para adicionar os sprites
        width = game.config.width;
        height = game.config.height;

        //Background
        this.background = this.add.sprite(0.5 * width, 0.5 * height,'background');     
        this.background.setScale(1.5);
        
        //Titulo
        this.titulo = this.add.sprite(0.605 * width, 0.16 * height,'titulo');
        this.titulo.setScale(1.7);

        //Home
        this.btHome = this.add.sprite(0.07 * width, 0.89 * height, 'home');
        this.btHome.setScale(1.2);
        this.btHome.setInteractive({useHandCursor: true});

        //PVP
        this.btPVP = this.add.sprite(0.135 * width, 0.18 * height, 'btPVP');
        this.btPVP.setScale(1);
        //this.btPVP.setInteractive({useHandCursor: true});

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

        scoreText = this.add.text(180, 290, score1+'-'+score2, { fontSize: '100px', fill: '#049' });

        //BT Logic
        //BT Highlight
        this.input.on('gameobjectover',function(pointer, gameObject) {
            gameObject.displayHeight += 5;
            gameObject.displayWidth += 5;
        },this);
        this.input.on('gameobjectout',function(pointer, gameObject) {
            gameObject.displayHeight -= 5;
            gameObject.displayWidth -= 5;
        },this);
        this.input.on('gameobjectdown', function(pointer, gameObject) {
            switch (gameObject){
                case this.btHome:
                    this.scene.start('Menu');
                    break;
                default:
                    break;
            }
        }, this);
    }
    gerarNumerosUnicos(qtd, min, max) {
        let numeros = new Set();
        while (numeros.size < qtd) {
            numeros.add(Phaser.Math.Between(min, max));
        }
        return Array.from(numeros);
    }

    //update(){}
}

class JogoPvE extends Phaser.Scene {
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
        let width = this.game.config.width;
        let height = this.game.config.height;

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