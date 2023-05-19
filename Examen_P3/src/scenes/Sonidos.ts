import Phaser from 'phaser';
import { instancia as eventos } from './EventCenter';

export class Sonidos extends Phaser.Scene {
  private sonidoFX!: Phaser.Sound.BaseSound | any;

 
  constructor() { 
    super('Sonidos') 
  }

  preload(){
    this.load.audio('jump-sfx',['/assets/jump.mp3']);
  }
 
  create(){

    this.sonidoFX = this.sound.add('jump-sfx');
        
        this.sonidoFX.rate = 1;
        this.sonidoFX.volume = 0.5;

    eventos.on('jump', this.Jump, this);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { 
      //para que no se esten añadiendo eventos cada vez que la escena se reinicie
      eventos.on('jump', this.Jump, this);
		})
  }

 

  private Jump(){ //manejamos el evento de joya-collected
    this.sonidoFX.play();
  }
}