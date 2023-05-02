import Phaser from "phaser";

export class Sidescroller extends Phaser.Scene {
  
  constructor() { 
    super('Sidescroller') 
  }

  preload() 
  {
    this.load.atlas('player','/assets/player.png','/assets/player.json');
    this.load.image('mapa','/assets/monochrome_tilemap_transparent_packed.png');
    this.load.tilemapTiledJSON('tilemap','/assets/darkworld.json');
  }
 
  create(){
    const map = this.make.tilemap({key:'tilemap'});
    const tileset = map.addTilesetImage('darkworld','mapa'); //'darkworld' = conjunto de patrones en tiled
    const ground = map.createLayer('Suelo', tileset!);

    //colisiones de Tilemap
    ground?.setCollisionByProperty({collides:true});
    this.matter.world.convertTilemapLayer(ground!);

    //acceder a capa de objetos
    const capaObjetos = map.getObjectLayer("Objetos");
    capaObjetos?.objects.forEach(objData => {
      const{x = 0, y = 0, name, width=0, height=0} = objData;

      switch(name){
        case 'Player-spawn': this.matter.add.sprite(x+(width*.05),y,'player');
        break;
      }
    })
    
    /*
    const {width,height} = this.scale;
    this.matter.add.sprite(width/2 - 300,height/2 - 30,'player');
    */
  }

  update(time: any){

   
  }

}