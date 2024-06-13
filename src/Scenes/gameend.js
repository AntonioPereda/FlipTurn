class gameend extends Phaser.Scene {
    constructor() {
        super("gameend");
        this.blinkerCD = 50;
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image("replay", "playAgain.png");
        this.load.image("victory", "victory.png");
        this.load.image("credits", "credits.png");


        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

       
    }

    create() {

        this.logo = this.add.image(525,100, "logo").setScale(0.3);
        this.instruct = this.add.image(500,250, "victory").setScale(0.7);
        this.play = this.add.image(500,450, "replay").setScale(0.8);
        this.credits = this.add.image(250, 750, "credits").setScale(0.6);
        

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
            this.scene.stop("gameover");
            this.scene.start("platformerScene");
        }
    }
    
}