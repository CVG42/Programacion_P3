class Scene2 extends Phaser.Scene{
      
    constructor(){
        super({key:"Scene2"});
    }

    create()
    {
        this.texto = this.add.text(0,0,"Bienvenido a la escena 2",{font:"40px Impact"});

        var miTween = this.tweens.add({
            targets: this.texto,
            x: 200,
            y: 300,
            duration: 2000,
            ease: "Elastic",
            easeParams: [1.5,0.5],
            delay: 300,
            onComplete: function(src,target){
                target[0].x = 0;
                target[0].y = 0;
                target[0].setColor("Red");
            }
        },this);

        this.tecla_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    }

    update(time,delta){
        if(this.tecla_1.isDown){
            this.scene.start("Scene1");
        }
    }

}