class Scene1 extends Phaser.Scene{
    
    
    constructor(){
        super({key:"Scene1"});
    }

    preload(){
        this.load.image('character', 'assets/character.png');
    }

    create(){
        this.imagen = this.add.image(400,300, 'character');
        this.imagen.setScale(5);

        this.input.keyboard.on('keyup-D', function(event){
            this.imagen.x += 10; //este this es mutabñe
            console.log('derecha')
        }, this);

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.input.on('pointerdown', function(event){
            this.imagen.x = event.x;
            this.imagen.y = event.y;
        },this)

        this.input.keyboard.on('keyup-P', function(event){
            var physicsImage = this.physics.add.image(this.imagen.x,this.imagen.y,'character');
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100),-300);
        },this);

        this.input.keyboard.on('keyup', function(e){
            if(e.key == "2"){
                this.scene.start("Scene2");
            }

            if(e.key == "3"){
                this.scene.start("Scene3");
            }
        },this)
    }

    update(time,delta){
        if(this.keyA.isDown){
            this.imagen.x --;
        }
    }
}