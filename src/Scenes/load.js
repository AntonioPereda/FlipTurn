class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");


        // Load tilemap information
        //this.load.image("mapA", "mapA.png");      
        this.load.image("mapA_BG", "mapA_BG.png"); 
        this.load.image("mapA", "mapA.png"); 
        this.load.image("mapB", "mapB.png"); 
        this.load.image("lockedGate", "locked.png");
        this.load.image("gateSwitch", "switch.png");
        this.load.image("pixel", "pixel.png");


        this.load.image("charIdle","charIdle.png");
        this.load.image("charW1","charW1.png");
        this.load.image("charW2","charW2.png");

        this.load.image("charIdle_F","charIdle_F.png");
        this.load.image("charW1_F","charW1_F.png");
        this.load.image("charW2_F","charW2_F.png");
        

        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("BackgroundA", "mapA_BG.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("mainA", "mapA.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("mainB", "mapB.png", {
            frameWidth: 16,
            frameHeight: 16
        });


        this.load.multiatlas("kenny-particles", "kenny-particles.json");


        //LOAD AUDIO
        this.load.audio("leverFlip", "leverFlip.ogg");
        this.load.audio("footB", "footstepB.ogg");
        this.load.audio("footA", "footstepA.ogg");
        this.load.audio("flipBSound", "sound_flipB.ogg");
        this.load.audio("flipASound", "sound_flipA.ogg");
        this.load.audio("play", "gameStart.ogg");
        this.load.audio("gameOver", "gameComplete.ogg");
    }

    create() {
        this.anims.create({
            key: 'walkA',
            frames: [
                { key: "charW1" },
                { key: "charW2" },
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idleA',
            frames: [
                { key: "charIdle" },
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'walkB',
            frames: [
                { key: "charW1_F" },
                { key: "charW2_F" },
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idleB',
            frames: [
                { key: "charIdle_F" },
            ],
            repeat: -1
        });

      

         // ...and pass to the next Scene
         this.scene.start("mainmenu");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}