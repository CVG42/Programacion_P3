import Phaser from "phaser";


export class Scene3 extends Phaser.Scene {

  private sonidoFX!: Phaser.Sound.BaseSound | any;
  
  constructor() {
     super( { key:"Scene3" } );
  }
 
  preload(){
    this.load.audio('Trompeta',['assets/trumpets.mp3']);
  }

  create(){
    this.sonidoFX = this.sound.add('Trompeta',  { loop: true });

    this.sonidoFX.play();
    this.sonidoFX.rate = 1;
    this.sonidoFX.volume = 0.1;

    this.input.keyboard.on('keydown-L', () => {

      this.sonidoFX.loop = !this.sonidoFX.loop;
      if (this.sonidoFX.loop) this.sonidoFX.play();

    });

    this.input.keyboard.on('keydown-P', () => {

      if (this.sonidoFX.isPlaying) this.sonidoFX.pause();
      else this.sonidoFX.resume();

    });
  }

}