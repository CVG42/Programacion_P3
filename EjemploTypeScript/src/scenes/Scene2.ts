import Phaser from "phaser";
export class Scene2 extends Phaser.Scene {

  private texto!: Phaser.GameObjects.Text;
  private tecla_1!: Phaser.Input.Keyboard.Key;

  constructor() {
     super( { key:"Scene2" } );
  }
 
  create(){
    this.texto = this.add.text(0,0,"Bienvenido Al Test 2", {font:"40px Impact"});

    var miTween = this.tweens.add({ 
      targets: this.texto,
      x: 200,
      y: 250,
      duration: 2000,
      ease:"Elastic",
      easeParams: [1.5,0.5],
      delay: 500,
      onComplete: function( src,tgt ) { //callback, hay onComplete on progress, etc
        tgt[0].x = 0;
        tgt[0].y = 0;
        tgt[0].setColor("Yellow");
      }
    });


    this.tecla_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
  }

  update(time:any){
    if(this.tecla_1.isDown)
      this.scene.start("Test1");
  }

}