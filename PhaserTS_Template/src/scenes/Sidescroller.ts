import Phaser from "phaser";
import PlayerController from "./PlayerController";
import ControladorObstaculos from "./ControladorObstaculos";
import EnemyController from "./EnemyController";

export class Sidescroller extends Phaser.Scene {
  private PlayerSprite!: Phaser.Physics.Matter.Sprite;
  private EnemySprite!: Phaser.Physics.Matter.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  grounded: boolean = true;
  private Player!: PlayerController;
  private enemigos: EnemyController[] = [];

  private Obstaculos!: ControladorObstaculos;

  
  constructor() { 
    super('Sidescroller') 
  }

  init()
  {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.Obstaculos = new ControladorObstaculos();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {this.destroy()});
  }

  preload() 
  {
    this.load.atlas('player','/assets/player.png','/assets/player.json');
    this.load.image('mapa','/assets/monochrome_tilemap_transparent_packed.png');
    this.load.tilemapTiledJSON('tilemap','/assets/darkworld.json');
    this.load.image('joya-img','/assets/tile_0082.png');
    this.load.atlas('enemy', '/assets/enemy.png','/assets/enemy.json')
  }
 
  create(){

    //this.createAnimacionesJugador();
    
    //para cargar otra escena al mismo tiempo, en este caso de UI
    this.scene.launch('UIScene');
    
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

      //PlayerSpaw
      switch(name){
        case 'Player-spawn': 
          //this.PlayerSprite = this.matter.add.sprite(x+(width*.05),y,'player').setFixedRotation().play('player-idle'); //setFixedRotation para que no rote
          //this.PlayerSprite.setOnCollide((data: MatterJS.ICollisionPair) => {this.grounded = true}) //detectar si esta en el suelo

          this.PlayerSprite = this.matter.add.sprite(x + (width * .05), y, 'player').play('player-idle').setFixedRotation();
          this.Player = new PlayerController(this.PlayerSprite, this.cursors!,x +(width*.05), y, this.cameras.main, this, this.Obstaculos);
        break;
        
        case 'Joya':
          const joya = this.matter.add.sprite(x! + (width * 0.5), y! + (height * 0.5), 'joya-img', undefined, {isSensor:true,isStatic:true})
          //isSensor = isTrigger de unity
          joya.setData('tipo','joya')
        break;

        case 'picos':
          const pico = this.matter.add.rectangle(x! + (width * 0.5), y! + (height * 0.5), width,height, {isStatic:true})
          this.Obstaculos.add('picos',pico);
        break;

        case 'enemigo':
          const enemySprite = this.matter.add.sprite(x + (width * .05), y, 'enemy').setFixedRotation();
          this.enemigos.push(new EnemyController(this,enemySprite));
          this.Obstaculos.add('enemigos', enemySprite.body as MatterJS.BodyType);
        break;
      }

      //Camara que sigue a jugador
      this.cameras.main.zoom = 2 ;
      this.cameras.main.startFollow(this.PlayerSprite);
    })
    
    /*
    const {width,height} = this.scale;
    this.matter.add.sprite(width/2 - 300,height/2 - 30,'player');
    */
  }

  update(time: any, delta: any)
  {
    this.Player.update(delta);
    this.enemigos.forEach(enemigo => enemigo.update(delta));
  
    //Movimiento
    /*
    if(!this.PlayerSprite)
    {
      return;
    }
    const speed = 2;

    //mover izquierda y derecha
    if(this.cursors?.left.isDown)
    {
      this.PlayerSprite.flipX = true;
      this.PlayerSprite.setVelocityX(-speed);
      this.PlayerSprite.play('player-walk', true);
    }
    else if(this.cursors?.right.isDown)
    {
      this.PlayerSprite.flipX = false; 
      this.PlayerSprite.setVelocityX(speed); 
      this.PlayerSprite.play('player-walk',true)
    }
    else
    {
      this.PlayerSprite.setVelocityX(0); 
      this.PlayerSprite.play('player-idle')
    }

    //saltar
    const espacio = Phaser.Input.Keyboard.JustDown(this.cursors!.space);
    if(espacio && this.grounded)
    {
      this.PlayerSprite.setVelocityY(-speed*3).play('player-jump');
      this.grounded = false;
    }

    //detectar si no esta en el suelo
    if(!this.grounded)
    {
      this.PlayerSprite.play('player-jump',true)
    }

    //Que deje de seguir la camara
    if(this.PlayerSprite.y > 320)
    {
      this.cameras.main.stopFollow();
    }else(this.cameras.main.startFollow(this.PlayerSprite))
   */
  }

  destroy()
  {
    this.scene.stop('UIScene');
    this.enemigos.forEach(enemigo => enemigo.destroy);
  }

  // Animaciones
  /*
  private createAnimacionesJugador()
  {
    this.anims.create({
      key: 'player-idle',
      frames: [{key:'player', frame:'tile_0240.png'}]
    })

    this.anims.create({
      key: 'player-jump',
      frames: [{key:'player', frame:'tile_0247.png'}]
    })

    this.anims.create({
      key: 'player-death',
      frames: [{key:'player', frame:'tile_0246.png'}]
    })

    this.anims.create({
      key: 'player-walk',
      frames: [{key:'player', frame:'tile_0244.png'},{key:'player', frame:'tile_0241.png'},{key:'player', frame:'tile_0242.png'},{key:'player', frame:'tile_0243.png'}],
      repeat: -1 //para repetir todo el tiempo
    })
  }
  */

}