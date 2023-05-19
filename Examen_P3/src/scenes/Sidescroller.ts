import Phaser from "phaser";
import PlayerController from "./PlayerController";
import ControladorObstaculos from "./ControladorObstaculos";
import EnemyController from "./EnemyController";
import FlyEnemyController from "./FlyingEnemyController";
import Water from "./Water";
import Coin from "./Coin";
import EagleController from "./EagleController";


export class Sidescroller extends Phaser.Scene {
  private PlayerSprite!: Phaser.Physics.Matter.Sprite;
  private EnemySprite!: Phaser.Physics.Matter.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  grounded: boolean = true;
  private Player!: PlayerController;
  private enemigos: EnemyController[] = [];

  private Obstaculos!: ControladorObstaculos;
  private flyEnemigos: FlyEnemyController[] = [];
  private water: Water[] = [];
  private coin: Coin[] = [];
  private eagles: EagleController[] = [];

  
  constructor() { 
    super('Sidescroller') 
  }

  init()
  {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.Obstaculos = new ControladorObstaculos();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {this.destroy()});
    this.enemigos = [];
    this.flyEnemigos = [];
    this.water = [];
    this.coin = [];
    this.eagles = [];
  }

  preload() 
  {
    //this.load.image('mapa','/assets/monochrome_tilemap_transparent_packed.png');
    this.load.image('mapa','/assets/tileset.png');
    this.load.image('background','/assets/back.png');
    this.load.tilemapTiledJSON('tilemap','/assets/forest.json');
    this.load.image('joya-img','/assets/gem-1.png');
    this.load.image('item-img','/assets/cherry-1.png');
    this.load.image('win-img','/assets/win.png');
    this.load.atlas('enemy', '/assets/opposum.png','/assets/opposum.json')
    this.load.atlas('enemy-death', '/assets/death-e.png','/assets/death-e.json')
    this.load.atlas('fly-enemy','/assets/saw.png','/assets/saw.json')
    this.load.atlas('eagle','/assets/eagle.png','/assets/eagle.json')
    this.load.atlas('player-run','/assets/player-run.png','/assets/player-run.json')
    this.load.atlas('player-idle','/assets/player-idle.png','/assets/player-idle.json')
    this.load.atlas('player-jump','/assets/player-jump.png','/assets/player-jump.json')
    this.load.atlas('player-death','/assets/player-death.png','/assets/player-death.json')
    this.load.atlas('water','/assets/water.png','/assets/water.json')
    this.load.atlas('coin','/assets/coin.png','/assets/coin.json')
    //this.load.audio('jump-sfx',['/assets/jump.mp3']);
  }
 
  create(){

    //this.createAnimacionesJugador();
    
    //para cargar otra escena al mismo tiempo, en este caso de UI
    this.scene.launch('UIScene');


    const background = this.make.tilemap({key:'tilemap'});
    const bg = background.addTilesetImage('sky','background');
    const fondo = background.createLayer('Fondo', bg!);
    const map = this.make.tilemap({key:'tilemap'});
    const tileset = map.addTilesetImage('other','mapa'); //'darkworld' = conjunto de patrones en tiled
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

          this.PlayerSprite = this.matter.add.sprite(x + (width * .05), y, 'player-idle').play('player-idle').setFixedRotation();

          
          this.PlayerSprite.body.vertices[0].y= y-3; //AQUI MODIFICO EL VERTICE DEL COLLIDER SUPERIOR IZQUIERDO
          this.PlayerSprite.body.vertices[1].y= y-3;
          this.PlayerSprite.body.vertices[0].x= x-5;
          this.PlayerSprite.body.vertices[1].x= x-5;
          this.PlayerSprite.body.vertices[2].x= x+5;
          this.PlayerSprite.body.vertices[3].x= x+5;
          
          
          

          this.Player = new PlayerController(this.PlayerSprite, this.cursors!,x +(width*.05), y, this.cameras.main, this, this.Obstaculos);
        break;
        
        case 'Joya':
          const joya = this.matter.add.sprite(x! + (width * 0.5), y! + (height * 0.5), 'joya-img', undefined, {isSensor:true,isStatic:true})
          //isSensor = isTrigger de unity
          joya.setData('tipo','joya')
        break;

        case 'coin':
          const coins = this.matter.add.sprite(x! + (width * 0.5), y! + (height * 0.5), 'coin', undefined, {isSensor:true,isStatic:true})
          //isSensor = isTrigger de unity
          coins.setData('tipo','coin')
          this.coin.push(new Coin(this,coins));
        break;

        case 'Item':
          const item = this.matter.add.sprite(x! + (width * 0.5), y! + (height * 0.5), 'item-img', undefined, {isSensor:true,isStatic:true})
          //isSensor = isTrigger de unity
          item.setData('tipo','item')
        break;

        case 'Win':
          const winItem = this.matter.add.sprite(x! + (width * 0.5), y! + (height * 0.5), 'win-img', undefined, {isSensor:true,isStatic:true})
          //isSensor = isTrigger de unity
          winItem.setData('tipo','win-item')
        break;

        case 'picos':
          const pico = this.matter.add.polygon(x! + (width * 0.5), y! + (height * 0.5), width,height, {isStatic:true})
          this.Obstaculos.add('picos',pico);
        break;

        case 'enemigo':
          const enemySprite = this.matter.add.sprite(x + (width * .05), y, 'enemy').setFixedRotation();
          this.enemigos.push(new EnemyController(this,enemySprite));
          this.Obstaculos.add('enemigos', enemySprite.body as MatterJS.BodyType);
        break;

        case 'flyenemy':
          const flyEnemySprite = this.matter.add.sprite(x + (width * .05), y, 'fly-enemy', undefined, {isStatic:true});         
          this.flyEnemigos.push(new FlyEnemyController(this,flyEnemySprite));
          this.Obstaculos.add('flyEnemigos', flyEnemySprite.body as MatterJS.BodyType);
          break;

          case 'eagle':
          const eagleSprite = this.matter.add.sprite(x + (width * .05), y, 'eagle', undefined, {isStatic:true});         
          this.eagles.push(new EagleController(this,eagleSprite));
          this.Obstaculos.add('eagles', eagleSprite.body as MatterJS.BodyType);
          break;

          case 'water':
            const waterSprite = this.matter.add.sprite(x + (width * .05), y, 'water', undefined, {isSensor:true, isStatic:true});         
            this.water.push(new Water(this,waterSprite));
            break;
      }

      //Camara que sigue a jugador
      this.cameras.main.zoom = 2.5 ;
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
    this.flyEnemigos.forEach(flyenemigo => flyenemigo.update(delta))
    this.eagles.forEach(eagle => eagle.update(delta))
  
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
    this.eagles.forEach(eagle => eagle.destroy);
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