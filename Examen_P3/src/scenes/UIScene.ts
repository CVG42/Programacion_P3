import Phaser from 'phaser';
import { instancia as eventos } from './EventCenter';

export class UIScene extends Phaser.Scene {
  private barraSalud!: Phaser.GameObjects.Graphics;
  private joyasLabel!: Phaser.GameObjects.Text;
  private scoreLabel!: Phaser.GameObjects.Text;
  private sonidoFX!: Phaser.Sound.BaseSound | any;
  private coinFX!: Phaser.Sound.BaseSound | any;
  private gemFX!: Phaser.Sound.BaseSound | any;
  
  private ultimaSalud: number = 100;
  joyasCollected: number = 0;
  score: number = 0;
 
  constructor() { 
    super('UIScene') 
  }

  preload(){
    this.load.audio('jump-sfx',['/assets/jump.mp3']);
    this.load.audio('coin-sfx',['/assets/coin.mp3']);
    this.load.audio('gem-sfx',['/assets/gem.mp3']);
  }
 
  create(){

    this.sonidoFX = this.sound.add('jump-sfx');
        
        this.sonidoFX.rate = 1;
        this.sonidoFX.volume = 0.5;

        this.coinFX = this.sound.add('coin-sfx');
        this.coinFX.rate = 1;
        this.coinFX.volume = 1;

        this.gemFX = this.sound.add('gem-sfx');
        this.gemFX.rate = 1;
        this.gemFX.volume = 0.5;

    this.barraSalud = this.add.graphics();
    this.setBarraSalud(100);

    this.joyasLabel = this.add.text(10, 35, 'Joyas: 0', {
			fontSize: '32px',
      fontFamily:'Segoe UI'
		})

    this.scoreLabel = this.add.text(600, 10, 'Score: 0000', {
			fontSize: '32px',
      fontFamily:'Segoe UI'
		})

    eventos.on('player-took-damage', this.barraSaludHandler,this);

    eventos.on('joya-collected', this.joyaHandler, this);
    eventos.on('enemy-killed', this.scoreHandler, this);
    eventos.on('jump', this.Jump, this);
    eventos.on('coin', this.Coin, this);
    eventos.on('gem', this.Gem, this);
    eventos.on('reset',this.Reset,this);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { 
      //para que no se esten añadiendo eventos cada vez que la escena se reinicie
			eventos.off('joya-collected', this.joyaHandler, this)//clereamos la referencia de las joyas aqui
      eventos.off('enemy-killed', this.scoreHandler, this)
      eventos.off('reset',this.Reset,this);
		})
  }

  private setBarraSalud(salud:number){
    const ancho = 200;
    const porcentaje = salud*ancho/100;  //podriamos usar algo comoPhaser.Math.Clamp(value,0,100)/ancho

    this.barraSalud.clear();
    this.barraSalud.fillStyle(0x808080); //gris
    this.barraSalud.fillRoundedRect(10,10,ancho,20,2);

    if(porcentaje>0){
      this.barraSalud.fillStyle(0xffffff); //blanco
      this.barraSalud.fillRoundedRect(10,10,porcentaje,20,2);
    }
    
  }


  private barraSaludHandler(nuevaSalud:number){
    //animacion
    
    this.tweens.addCounter({
      from: this.ultimaSalud, //Tween que va ir de la ultima salud 
      to: nuevaSalud, //a la nueva
      duration: 100, //en 100 ms
      onUpdate: tween => {
        const value = tween.getValue(); //mientras se ejecute
        this.setBarraSalud(value);    //refrescara la barra
      }
    })

    this.ultimaSalud = nuevaSalud; //ya despues de iniciar el Tween actualizamos el valor
    
  }
  
  private joyaHandler(){ //manejamos el evento de joya-collected
    ++this.joyasCollected
		this.joyasLabel.text = `Joyas: ${this.joyasCollected}`
  }

  private scoreHandler(){ //manejamos el evento de joya-collected
    this.score += 15;
		this.scoreLabel.text = `Score: 00${this.score}`
  }

  private Jump(){ //manejamos el evento de joya-collected
    this.sonidoFX.play();
  }

  private Coin(){ //manejamos el evento de joya-collected
    this.coinFX.play();
  }

  private Gem(){ //manejamos el evento de joya-collected
    this.gemFX.play();
  }

  private Reset()
  {
    this.joyasCollected = 0;
    this.score = 0;
  }
}