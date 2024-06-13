class platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.VELOCITY = 200; 
        this.DRAG = 1000;   
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2;
        this.CurrentMap = "A";
        this.direction = null;
        this.colliding = false;

        this.DoFlip = false;
        this.soundCD = 0;
        this.flipCD = 0;
    }

    create() {

        this.walkingA = this.sound.add("footA", {loop: true});
        this.walkingB = this.sound.add("footB", {loop: true});



        this.map = this.add.tilemap("platformer-level-1", 16, 16, 80, 800);


        //A SETUP
        const ABackGround = this.map.addTilesetImage("mapA_BG", "mapA_BG");
        const ALevel = this.map.addTilesetImage("mapA", "mapA");
        this.aBG = this.map.createLayer("BGA", "mapA_BG", 0, 0);
        this.aCollision = this.map.createLayer("GroundA", "mapA", 0, 0);
        this.aCollision.setCollisionByProperty({
            collides: true
        });



        //B SETUP
        const BLevel = this.map.addTilesetImage("mapB", "mapB");
        this.bCollision = this.map.createLayer("GroundB", "mapB", 0, 0);
        this.bCollision.setCollisionByProperty({
            collides: true
        });
        this.bCollision.visible = false;
        this.bCollision.active = false;
        this.bCollision.collisionMask = 0;
        

        //MAP FLIPPING
        this.aToB = this.map.createFromObjects("AToBFlips", {
            name: "flipToB",
            key: "mainA",
           frame: 643
        });
        this.physics.world.enable(this.aToB, Phaser.Physics.Arcade.STATIC_BODY);
        this.aFlip = this.add.group(this.aToB);

        this.bToA = this.map.createFromObjects("BToAFlips", {
            name: "flipToA",
            key: "mainB",
           frame: 68
        });
        this.physics.world.enable(this.bToA, Phaser.Physics.Arcade.STATIC_BODY);
        this.bFlip = this.add.group(this.bToA);
        for (let child of this.bFlip.children.entries){
            child.visible = false;
            child.active = false;
        }


        //Game Over
        this.endFlag = this.map.createFromObjects("GO", {
            name: "endflag",
            key: "mainA",
            frame: 636
        });
        this.endFlags = this.add.group(this.endFlag);
        this.physics.world.enable(this.endFlags, Phaser.Physics.Arcade.STATIC_BODY);
                
    
        // Player sprite
        my.sprite.player = this.physics.add.sprite(73, 1080, "platformer_characters", "tile_0000.png");
        my.sprite.player.setSize(20,30,true);
        my.sprite.player.setOffset(4,0);
        this.physics.add.collider(my.sprite.player, this.aCollision);
        this.physics.add.collider(my.sprite.player, this.bCollision);

        this.physics.add.overlap(my.sprite.player, this.aFlip, (obj1, obj2) => {
            this.DoFlip = true;
        });

        this.physics.add.overlap(my.sprite.player, this.endFlags, (obj1, obj2) => {
            this.scene.stop("platformerScene");
            this.stopWalkSFX();
            this.scene.start("gameend");
            this.sound.play("gameOver", {volume: 0.04});
        });

        //PLAYER ANIMATIONS
        

        this.stepFX = this.add.particles(0, 0, 'pixel', {
            speed: { start: 20, end: 1 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            gravityY: -200,
            tint: Math.random() * 0xE9DF0B,
            lifespan: { min: 50, max: 250, steps: 30 }
        })

        this.stepFX.startFollow(my.sprite.player, 0, 0, false);
        this.stepFX.y +=15;
        this.stepFX.stop();
             
        
        ///WALL SWITCH CREATION
        this.walls = [];
            this.walls.push(this.add.sprite(596, 342,"lockedGate").setScale(3)); //w1
            this.walls.push(this.add.sprite(33, 259,"lockedGate").setScale(4)); //w2
            this.walls.push(this.add.sprite(770, 62,"lockedGate").setScale(5.5)); //w3
            this.walls.push(this.add.sprite(60, 816,"lockedGate").setScale(8)); //w4
            this.walls.push(this.add.sprite(1054, 157,"lockedGate").setScale(3.25)); //w5
            this.walls.push(this.add.sprite(170, 327,"lockedGate").setScale(6)); //w6
            this.walls.push(this.add.sprite(626, 646,"lockedGate").setScale(4)); //w7


        this.switches = [];
            this.switches.push(this.add.sprite(861, 55,"gateSwitch").setScale(SCALE)); //s1 PINK
            this.switches.push(this.add.sprite(606, 488,"gateSwitch").setScale(SCALE)); //s2 GREEN
            this.switches.push(this.add.sprite(301, 355,"gateSwitch").setScale(SCALE)); //s3 GREY
            this.switches.push(this.add.sprite(784, 792,"gateSwitch").setScale(SCALE)); //s4 YEL
            this.switches.push(this.add.sprite(36, 916,"gateSwitch").setScale(SCALE)); //s5 BLUE
            this.switches.push(this.add.sprite(722, 397,"gateSwitch").setScale(SCALE)); //!s6 ORANGE
            this.switches.push(this.add.sprite(158, 398,"gateSwitch").setScale(SCALE)); //!s7 RED

            this.switches[5].visible = false;
            this.switches[5].active = false;
            this.switches[6].visible = false;
            this.switches[6].active = false;



        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.fKey = this.input.keyboard.addKey('F');

        this.physics.world.drawDebug = false;
        

        //CAMERA CODE

        my.sprite.player.setCollideWorldBounds(true);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setZoom(this.SCALE);
        

    }

    update() {
        //INTERACT BUTTON
        if(Phaser.Input.Keyboard.JustDown(this.fKey)){ 
            if (this.DoFlip == true) { ///FLIPPIN KRABBIE PATTIES
                if (this.CurrentMap == "A" && this.aFlip.active == true && this.flipCD == 0) {this.mapFlip("B");} 
                else if (this.CurrentMap == "B" && this.bFlip.active == true && this.flipCD == 0) {this.mapFlip("A");}
                this.flipCD = 32;

                ///LEVER INTERACTION
            } else {
                let z = 0;
                for (let lever of this.switches){
                    if(this.isColliding(my.sprite.player, lever, 0)) {
                        this.sound.play("leverFlip", {volume: 0.02});
                        lever.active = false;
                        lever.visible = false;
                        this.switches[z] = null;
                        this.walls[z].active = false;
                        this.walls[z].visible = false;
                        this.walls[z] = null;
                    }
                    z++;
                }
            }
        }if (this.DoFlip == true){this.DoFlip = false}
        
        




        //MOVEMENT
        if(cursors.left.isDown) {
            this.playWalkSFX();
            my.sprite.player.setVelocityX(-this.VELOCITY);
            this.direction = "L";
            my.sprite.player.setFlip(true, false);

            
            this.wallCheck();
            this.playWalk();
            

        } else if(cursors.right.isDown) {
            this.playWalkSFX();
            my.sprite.player.setVelocityX(this.VELOCITY);
            this.direction = "R";
            my.sprite.player.resetFlip();
            this.wallCheck();
            this.playWalk();
          
        } else if(cursors.up.isDown) {
            this.playWalkSFX();
            this.direction = "U";
            this.playWalk();
            my.sprite.player.setVelocityY(-this.VELOCITY);
            this.wallCheck();

        
        } else if(cursors.down.isDown) {
            this.playWalkSFX();
            this.direction = "D";
            this.playWalk();
            my.sprite.player.setVelocityY(this.VELOCITY);
            this.wallCheck();

        } else {
            this.stopWalkSFX();
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.body.setDragY(this.DRAG);
            this.playIdle();
        }        
        

        if (this.soundCD > 0){this.soundCD--;}
        if (this.flipCD > 0){this.flipCD--;}

    }




    //HELPER FUNCTIONS
    wallCheck(){
        for (let c of this.walls){
            while (this.isColliding(my.sprite.player,c, 0)){
                this.playWalkSFX();
                this.VELOCITY = 0;
                if (this.direction == "L"){
                    my.sprite.player.setVelocityX(200);
                    my.sprite.player.setFlip(true, false);    

                } else if (this.direction == "R"){
                    my.sprite.player.setVelocityX(-200);
                    my.sprite.player.setFlip();  

                } else if (this.direction == "U"){
                    my.sprite.player.setVelocityY(200);

                } else if (this.direction == "D"){
                    my.sprite.player.setVelocityY(-200);
                }
                break;
            }
            this.VELOCITY = 200;
        }
    }

    mapFlip(map){
        if (map == "B") {
            this.sound.play("flipBSound", {volume: 0.02});
            this.aFlip.active = false;
            this.aFlip.visible = false; 
            this.aToB.active = false;
            this.aCollision.visible = false; 
            this.aCollision.collisionMask = 0;
            this.aBG.visible = false;
            for (let child of this.aFlip.children.entries){
                child.visible = false;
                child.active = false;
            }
            this.bCollision.visible = true;
            this.bCollision.active = true;
            this.bCollision.collisionMask = 1;
            for (let child of this.bFlip.children.entries){
                child.visible = true;
                child.active = true;
            }
            this.CurrentMap = "B";
            this.switchFlip();
            this.playIdle();
        } else {
            this.sound.play("flipASound", {volume: 0.02});
            this.aFlip.active = true;
            this.aFlip.visible = true; 
            this.aToB.active = true;
            this.aCollision.visible = true; 
            this.aCollision.collisionMask = 1;
            this.aBG.visible = true;
            for (let child of this.aFlip.children.entries){
                child.visible = true;
                child.active = true;
            }
            this.bCollision.visible = false;
            this.bCollision.active = false;
            this.bCollision.collisionMask = 0;
            for (let child of this.bFlip.children.entries){
                child.visible = false;
                child.active = false;
            }
            this.CurrentMap = "A";
            this.switchFlip();
            this.playIdle();
        }
        this.stopWalkSFX();
    }

    isColliding(a, b, R) {
        if (a == null || b == null) return false;
        if (Math.abs((a.x) - (b.x)) > ((a.displayWidth/2 +R) + (b.displayWidth/2 +R))) return false;
        if (Math.abs((a.y) - (b.y)) > ((a.displayHeight/2 +R)+ (b.displayHeight/2 +R))) return false;
        return true;
    }

    switchFlip(){
        for (let wall of this.walls){
            if (wall != null){
                if (wall.visible){
                    wall.visible = false;
                    wall.active = false;
                    wall.x+= 3000;
                } else {
                    wall.visible = true;
                    wall.active = true;
                    wall.x-=3000;
                }
            }
        }
        for (let s of this.switches){
            if (s != null){
                if (s.visible){
                    s.visible = false;
                    s.active = false;
                } else {
                    s.visible = true;
                    s.active = true;
                }
                
            }
        }
    }

    playWalkSFX(){
        if (this.soundCD == 0){
            if (this.CurrentMap == "A"){
                this.walkingA.play({volume: 0.07});
                this.soundCD = 9;
            } else {
                this.walkingB.play({volume: 0.12});
                this.soundCD = 9;
            }
            
        }
    }

    stopWalkSFX(){
        this.walkingA.stop();
        this.walkingB.stop();
    }

    playWalk(){
        this.stepFX.start();
        if (this.CurrentMap == "A"){
            my.sprite.player.anims.play('walkA', true);
        } else{my.sprite.player.anims.play('walkB', true);}
    }

    playIdle(){
        this.stepFX.stop();
        if (this.CurrentMap == "A"){
            my.sprite.player.anims.play('idleA', true);
        } else{my.sprite.player.anims.play('idleB', true);}
    }
}

