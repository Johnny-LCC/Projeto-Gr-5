var width;
var height;
var callOnce = 0;

var score1 = 0;
var score2 = 0;
var scoreText;
var time = 10.0;
var timeText;
var level = 1;

var nome = "";
var nome2 = "";
var please = "";

var x;
var y;
var di = x + "-09-01";
var df = y + "-08-31";

var infoUser = new loginInfo();

// Make Menu globally accessible
window.Menu = class Menu extends Phaser.Scene {

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
        this.load.image('fullscreenBT1','assets/fullscreenBT-1.png');
        this.load.image('fullscreenBT2','assets/fullscreenBT-2.png');
        this.load.image('btLogin','assets/login-bt.png');
        this.load.image('btLogout','assets/logout-bt.png');
        this.load.image('login','assets/login.png'); //
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
        this.btCreditos = this.add.sprite(0.935 * width, 0.90 * height, 'btCreditos');
        this.btCreditos.setScale(1.2);
        this.btCreditos.setInteractive({ useHandCursor: true });

        //Instrucoes-bt
        this.btInstrucoes = this.add.sprite(0.935 * width, 0.74 * height, 'btInstrucoes');
        this.btInstrucoes.setScale(1.2);
        this.btInstrucoes.setInteractive({ useHandCursor: true });

        //Top-bt
        this.btTop = this.add.sprite(0.935 * width, 0.58 * height, 'btTop');
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
        this.creditos = this.add.sprite(0.5*width, 0.5*height, 'creditos');
        this.creditos.setScale(1.5);
        this.creditos.visible = false;

        //Instrucoes-img
        this.instrucoes = this.add.sprite(0.5*width, 0.5*height, 'instrucoes');
        this.instrucoes.setScale(1.5);
        this.instrucoes.visible = false;

        //bt-fechar
        this.btFechar = this.add.sprite(0.935*width, 0.1*height, 'btFechar');
        this.btFechar.setScale(1.1);
        this.btFechar.setInteractive({useHandCursor: true});
        this.btFechar.visible = false;      
        
        //FullscreenBT1
        this.fullscreenBT1 = this.add.sprite(0.07 * width ,0.9 * height,'fullscreenBT1');
        this.fullscreenBT1.setScale(1.1);
        this.fullscreenBT1.setInteractive({ useHandCursor: true });
        if (isIphone()) {
            console.log("É um iphone");
            this.fullscreenBT1.visible = false;
        } else {
            console.log("Não é um iphone");
        }

        //FullscreenBT2
        this.fullscreenBT2 = this.add.sprite(0.07 * width, 0.9 * height,'fullscreenBT2');
        this.fullscreenBT2.visible = false;
        this.fullscreenBT2.setScale(1.1);
        this.fullscreenBT2.setInteractive({ useHandCursor: true });

        //bt-login
        this.btLogin = this.add.sprite(0.935 * width, 0.42 * height, 'btLogin');
        this.btLogin.setScale(0.8);
        this.btLogin.setInteractive({useHandCursor: true});
        
        //bt-logout
        this.btLogout = this.add.sprite(0.935 * width, 0.42 * height, 'btLogout');
        this.btLogout.setScale(0.8);
        this.btLogout.setInteractive({useHandCursor: true});
        this.btLogout.visible = false;
        
        //login
        this.login = this.add.sprite(0.5 * width, 0.5 * height, 'login');
        this.login.setScale(1.5);
        this.login.visible = false;
        
        this.btLogin2 = this.add.sprite(0.5 * width, 0.7 * height, 'btLogin');
        this.btLogin2.setScale(0.8);
        this.btLogin2.setInteractive({useHandCursor: true});
        this.btLogin2.visible = false;
        
        //olaMSG
        this.ola = this.add.text(0.38 * game.config.width ,0.25 * game.config.height,"Olá " + nome,{ fontFamily: 'Arial',fontSize: 80,color: '#0D870F',align: 'center'});
        this.ola.visible = false;
        
        //loginErrorMsg
        this.loginErrorMsg = this.add.text(0.38 * game.config.width, 0.316 * game.config.height,"Utilizador ou Password Errados",{ fontFamily: 'Arial',fontSize: 35,color: '#B40404',align: 'center'});
        this.loginErrorMsg.visible = false;

        //loginErrorMsg2
        this.loginErrorMsg2 = this.add.text(0.38 * game.config.width, 0.316 * game.config.height,"Está registado como professor!",{ fontFamily: 'Arial',fontSize: 35,color: '#B40404',align: 'center'});
        this.loginErrorMsg2.visible = false;

        let userH = `<input type="text" name="username" style="font-size: 15px;font-family:'Arial';text-align:center;">`;
        let passH = `<input type="password" name="password" style="font-size: 15px;font-family:'Arial';text-align:center;">`;

        x = this.add.dom(0.52 * width, 0.4 * height).createFromHTML(userH);
        x.setScale(2.7);
        x.visible = false;

        y = this.add.dom(0.52 * width, 0.52 * height).createFromHTML(passH);
        y.setScale(2.7);

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
                    console.log('PVP entrado');
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
                    this.creditos.visible = true;
                    this.instrucoes.visible = false;
                    this.btFechar.visible = true;
                    this.titulo.visible = false;
                    this.btPVP.visible = false;
                    this.btLvl1.visible = false;
                    this.btLvl2.visible = false;
                    this.btLvl3.visible = false;
                    this.lapis.visible = false;
                    this.login.visible = false;
                    this.btLogin.visible = true;
                    this.btLogin2.visible = false;
                    x.visible = false;
                    y.visible = false;
                    break;
                case this.btInstrucoes:
                    this.creditos.visible = false;
                    this.instrucoes.visible = true;
                    this.btFechar.visible = true;
                    this.titulo.visible = false;
                    this.btPVP.visible = false;
                    this.btLvl1.visible = false;
                    this.btLvl2.visible = false;
                    this.btLvl3.visible = false;
                    this.lapis.visible = false;
                    this.login.visible = false;
                    this.btLogin.visible = true;
                    this.btLogin2.visible = false;
                    x.visible = false;
                    y.visible = false;
                    break;
                case this.btFechar:
                    this.creditos.visible = false;
                    this.instrucoes.visible = false;
                    this.btFechar.visible = false;
                    this.titulo.visible = true;
                    this.btPVP.visible = true;
                    this.btLvl1.visible = true;
                    this.btLvl2.visible = true;
                    this.btLvl3.visible = true;
                    this.lapis.visible = true;
                    this.btLogin.visible = true;
                    this.btLogin2.visible = false;
                    this.login.visible = false;
                    x.visible = false;
                    y.visible = false;
                    break;
                case this.fullscreenBT1:
                    this.scale.startFullscreen();
                    console.log("Botão fullscreen");
                    this.fullscreenBT1.visible = false;
                    this.fullscreenBT2.visible = true;
                    break;
                case this.fullscreenBT2:
                    this.scale.stopFullscreen();
                    this.fullscreenBT2.visible = false;
                    this.fullscreenBT1.visible = true;
                    break;
                case this.btLogin:
                    this.creditos.visible = false;
                    this.instrucoes.visible = false;
                    this.btFechar.visible = true;
                    this.titulo.visible = false;
                    this.btPVP.visible = false;
                    this.btLvl1.visible = false;
                    this.btLvl2.visible = false;
                    this.btLvl3.visible = false;
                    this.lapis.visible = false;
                    this.btLogin.visible = false;
                    this.btLogin2.visible = true;
                    this.login.visible = true;
                    this.loginErrorMsg.visible = false;
                    this.loginErrorMsg2.visible = false;
                    x.visible = true;
                    y.visible = true;
                    this.btLogin2.on('pointerup', function () {
                        let username = x.getChildByName("username").value //node.value
                        let password = y.getChildByName("password").value
                        if (username != '' && password != '') {
                            let r = login(username, password, this);
                            x.getChildByName("username").value = '';
                            y.getChildByName("password").value = '';
                        }
                    }, this);
                    //
                    if(infoUser.user!='' && infoUser.user != 'prof') {
                        nome = infoUser.firstName.split(" ");
                        nome2 = nome[0];
                        this.ola.setText(['Olá ' + nome2]);
                        this.ola.visible = true;
                        this.btLogout.visible = true;
                        this.btLogin.visible = false;
                        this.btLogin2.visible = false;
                        this.loginErrorMsg.visible = false;
                        x.visible = false;
                        y.visible = false;
                        this.btFechar.visible = false;
                        this.login.visible = false;
                        this.btPVP.visible = true;
                        this.btLvl1.visible = true;
                        this.btLvl2.visible = true;
                        this.btLvl3.visible = true;
                    }
                    //
                    break;
                case this.btLogout:
                    this.btLogout.visible = false;
                    this.btLogin.visible = true;
                    this.ola.visible = false;
                    infoUser.logout();
                    break;
                case this.btTop:
                    getTOP(di, df, "", "", this);
                    flag = true;
                    break;
                default:
                    break;
            }    
        },this);
    }

    update() {
        if (callOnce == 0) {
            //sessionVerify();
            callOnce = 1000;
        }

        width = game.config.width;
        height = game.config.height;
        
        if(this.scale.isFullscreen){
            this.fullscreenBT1.visible = false;
            this.fullscreenBT2.visible = true;
        }
        else{
            this.fullscreenBT1.visible = true;
            this.fullscreenBT2.visible = false;
        }
    }
}

function isIphone() {
    console.log("Verificando se é um iphone...")
    return /iPhone/i.test(navigator.userAgent);
}