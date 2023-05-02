import Phaser from "phaser";

export class Tarea extends Phaser.Scene{
    
    private imagen!: Phaser.GameObjects.Image;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private keyW!: Phaser.Input.Keyboard.Key;
    private sonidoFX!: Phaser.Sound.BaseSound | any;
       
    constructor(){
        super("Tarea");
    }

    preload(){
        this.load.image('character', 'assets/character.png');
        this.load.audio('Yoshi',['assets/yoshi.mp3']);
    }
    
    create(){
        this.imagen = this.add.image(400,300, 'character');
        this.imagen.setScale(5);
        this.sonidoFX = this.sound.add('Yoshi');
        
        this.sonidoFX.rate = 1;
        this.sonidoFX.volume = 0.5;

        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);


        this.input.on('pointerdown', (event : any) =>{
            this.imagen.x = event.x;
            this.imagen.y = event.y;
        })

        this.input.keyboard.on('keyup-P', (event : any) =>{
            var physicsImage = this.physics.add.image(this.imagen.x,this.imagen.y,'character');
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100,100),-300);
        });

        this.input.keyboard.on('keyup', (e : any) =>{
            if(e.key == "1"){
                this.scene.start("Scene1");
            }
            
            if(e.key == "2"){
                this.scene.start("Scene2");
            }

            if(e.key == "3"){
                this.scene.start("Scene3");
            }
        })
    }

    update(time:any){
        if(this.keyA.isDown)
        {
            this.imagen.x = this.imagen.x - 5;
        }

        if(this.keyS.isDown)
        {
            this.imagen.y = this.imagen.y + 5;
        }

        if(this.keyD.isDown)
        {
            this.imagen.x = this.imagen.x + 5;
        }

        if(this.keyW.isDown)
        {
            this.imagen.y = this.imagen.y - 5;
        }

        if(this.imagen.x > 750 || this.imagen.x < 50 || this.imagen.y > 550 || this.imagen.y < 50)
        {
            var Tween = this.tweens.add({
                targets: this.imagen,
                x: 400,
                y: 300,
                duration: 300,
                ease:"Elastic",
                easeParams: [1.0,5.0],
            });
            this.sonidoFX.play();
        }
    }
}