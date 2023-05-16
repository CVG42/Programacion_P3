import Phaser from 'phaser';
import { instancia as eventos } from './EventCenter';

export class UIScene extends Phaser.Scene {
  private barraSalud!: Phaser.GameObjects.Graphics;
  private joyasLabel!: Phaser.GameObjects.Text;
  
  private ultimaSalud: number = 100;
  joyasCollected: number = 0;
 
  constructor() { 
    super('UIScene') 
  }

  preload(){
  }
 
  create(){
    this.barraSalud = this.add.graphics();
    this.setBarraSalud(100);

    this.joyasLabel = this.add.text(10, 35, 'Joyas: 0', {
			fontSize: '32px',
      fontFamily:'Segoe UI'
		})

    eventos.on('player-took-damage', this.barraSaludHandler,this);

    eventos.on('joya-collected', this.joyaHandler, this);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { 
      //para que no se esten añadiendo eventos cada vez que la escena se reinicie
			eventos.off('joya-collected', this.joyaHandler, this)//clereamos la referencia de las joyas aqui
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
}