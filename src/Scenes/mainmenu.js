class mainmenu extends Phaser.Scene {
    constructor() {
        super("mainmenu");
        this.blinkerCD = 50;
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image("logo", "flipturn_logo.png");
        this.load.image("instructions", "instruction.png");
        this.load.image("play", "toPlay.png");

        this.load.audio("gameStart", "gameStart.ogg");
        this.load.audio("gameEnd", "gameComplete.ogg");

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

       
    }

    create() {

        this.logo = this.add.image(500,200, "logo").setScale(0.85);
        this.instruct = this.add.image(500,450, "instructions").setScale(1);
        this.play = this.add.image(500,600, "play").setScale(0.9);
        

    }

    update() {

        let my = this.my;
        this.blinkerCD--;
        if (this.blinkerCD == 0) {
            this.play.visible = false;
        }
        if (this.blinkerCD == -50) {
            this.play.visible = true;
            this.blinkerCD = 50;
        }

        if(this.enterKey.isDown){
            this.sound.play("gameStart", {volume: 0.04});
            this.scene.stop("mainmenu");
            this.scene.start("platformerScene");
        

        }
    }
}