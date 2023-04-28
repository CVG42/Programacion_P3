import Phaser from "phaser";

export class Tarea extends Phaser.Scene{
    
    private imagen!: Phaser.GameObjects.Image;
    private keyA!: Phaser.Input.Keyboard.Key;
       
    constructor(){
        super("Tarea");
    }

    preload(){
        this.load.image('character', 'assets/character.png');
    }

    create(){
        this.imagen = this.add.image(400,300, 'character');
        this.imagen.setScale(5);

        this.input.keyboard.on('keyup-D', (event : any) => {
            this.imagen.x += 10; //este this es mutabñe
            console.log('derecha')
        });

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.input.on('pointerdown', (event : any) =>{
            this.imagen.x = event.x;
            this.imagen.y = event.y;
        })

        this.input.keyboard.on('keyup-P', (event : any) =>{
            var physicsImage = this.physics.add.image(this.imagen.x,this.imagen.y,'character');
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100),-300);
        });

        this.input.keyboard.on('keyup', (e : any) =>{
            if(e.key == "2"){
                this.scene.start("Scene2");
            }

            if(e.key == "3"){
                this.scene.start("Scene3");
            }
        })
    }

    update(time:any){
        if(this.keyA.isDown){
            this.imagen.x --;
        }
    }
}