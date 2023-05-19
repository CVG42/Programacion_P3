import Phaser, { Sound } from "phaser";
import { instancia as eventos } from "./EventCenter";
import ControladorObstaculos from "./ControladorObstaculos";

export default class PlayerController
{
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private sprite!: Phaser.Physics.Matter.Sprite;
    private camera!: Phaser.Cameras.Scene2D.Camera;
    private scene!: Phaser.Scene;
    private grounded: boolean = false;
    private fallen: boolean = false;
    private health: number = 100;
    x: number;
    y: number;
    speed: number = 2;
    private death: boolean = false;
    private obstaculos!: ControladorObstaculos;
    private lastEnemy?: Phaser.Physics.Matter.Sprite;
 
   

    
    constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: Phaser.Types.Input.Keyboard.CursorKeys, x: number, y: number, camera: Phaser.Cameras.Scene2D.Camera, scene: Phaser.Scene, obstaculos: ControladorObstaculos)
    {
        this.sprite = sprite;
        this.cursors = cursors;
        this.x = x;
        this.y = y;
        this.camera = camera;
        this.scene = scene;
        this.obstaculos = obstaculos;
    
        this.initialize();
    }

    initialize()
    {
        this.createAnimacionesJugador();
        this.sprite.play('player-idle');
        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => 
        {
          //detectar si esta en el suelo
          this.grounded = true;
          const body = data.bodyB as MatterJS.BodyType

          if(this, this.obstaculos.is('picos', body))
          {
            this.doDmgToPlayer(10,this.speed*3);
            return;
          }

          if (this.obstaculos.is('enemigos', body)) //#4
            {
              this.lastEnemy = body.gameObject
              let yVelocity = this.sprite.getVelocity().y;
              yVelocity = yVelocity ?? 0;
              if (this.sprite.y < body.position.y && yVelocity > 1)
              {
                this.doDmgToPlayer(0,this.speed*3);
                // stomp on enemy
                //debe checar si es menor porque entre menor el Y, mas alto estamos
                eventos.emit('enemy-stomped', this.lastEnemy);   
                eventos.emit('enemy-killed');       
              }
              else
              {
                // hit by enemy
                this.doDmgToPlayer(15,0);
                this.speed = 2;
              }
              return;
            }

            if (this.obstaculos.is('flyEnemigos', body)) //#4
            {
              this.lastEnemy = body.gameObject
              let yVelocity = this.sprite.getVelocity().y;
              yVelocity = yVelocity ?? 0;
              this.speed = 2; 
          
              if (this.sprite.y < body.position.y && yVelocity > 1)
              {
                // stomp on enemy
                this.doDmgToPlayer(15,this.speed*3);
                //debe checar si es menor porque entre menor el Y, mas alto estamos
                //this.speed = 2;         
              }
              else
              {
                // hit by enemy
                this.doDmgToPlayer(15,0);
                //this.speed = 2;
              }
              
              return;
            }

          const gameObject = body.gameObject;
          if(!gameObject)
            return;

          const sprite = gameObject as Phaser.Physics.Matter.Sprite;
          const tipo = sprite.getData?.('tipo');

          switch(tipo)
          {
            case 'joya':
              //console.log("joya")
              eventos.emit('gem'); 
              eventos.emit('joya-collected')
              sprite.destroy();
              break;

              case 'coin':
              //console.log("joya")
              eventos.emit('coin')
              eventos.emit('enemy-killed')
              sprite.destroy();
              break;

            case 'item':
                //console.log("joya")
                //eventos.emit('joya-collected')
                sprite.destroy();
                this.speed = 4;
                break;
            
            case 'win-item':
                //console.log("joya")
                //eventos.emit('joya-collected')
                sprite.destroy();
                this.speed = 0;
                this.scene.time.delayedCall(1500,()=>{this.scene.scene.start('victory')})
                break;
          }
        }) 
    }


    
    private createAnimacionesJugador()
    {
    this.sprite.anims.create({
      key: 'player-idle',
      frameRate:10,
      frames: [{key:'player-idle', frame:'player-idle-1.png'},{key:'player-idle', frame:'player-idle-2.png'},{key:'player-idle', frame:'player-idle-4.png'}]
    })
    
    this.sprite.anims.create({
      key: 'player-jump',
      frames: [{key:'player-jump', frame:'player-jump-1.png'},{key:'player-jump', frame:'player-jump-2.png'}]
    })
    
    this.sprite.anims.create({
      key: 'player-death',
      frames: [{key:'player-death', frame:'player-hurt-1.png'},{key:'player-death', frame:'player-hurt-2.png'}]
    })
    
    this.sprite.anims.create({
      key: 'player-walk',
      frames: [{key:'player-run', frame:'player-run-1.png'},{key:'player-run', frame:'player-run-2.png'},{key:'player-run', frame:'player-run-3.png'},
      {key:'player-run', frame:'player-run-4.png'},{key:'player-run', frame:'player-run-5.png'},{key:'player-run', frame:'player-run-6.png'}],
      repeat: -1 //para repetir todo el tiempo
    })
    }

    playDamageAnimation(){

      const colorInicial = Phaser.Display.Color.ValueToColor(0xffffff);
      const colorFinal = Phaser.Display.Color.ValueToColor(0xff0000);
  
      this.scene.tweens.addCounter({
        from: 0,
        to: 100,
        duration: 100, //100 * 2
        repeat: 2,
        yoyo: true,
        onUpdate: tween => {
          const value = tween.getValue();
          const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
            colorInicial,
            colorFinal,
            100,
            value
          )
  
          const color = Phaser.Display.Color.GetColor(
            colorObject.r,
            colorObject.g,
            colorObject.b,
          )
  
          this.sprite.setTint(color);
        }
      })
  
    }

    update(dt:any)
    {
        if(this.death)
          return;

        if(!this.sprite)
        {
            return;
        }
        if(this.cursors?.left.isDown)
        {
        this.sprite.flipX = true;
        this.sprite.setVelocityX(-this.speed);
        this.sprite.play('player-walk', true);
        }
        else if(this.cursors?.right.isDown)
        {
        this.sprite.flipX = false; 
        this.sprite.setVelocityX(this.speed); 
        this.sprite.play('player-walk',true)
        }
        else
        {
        this.sprite.setVelocityX(0); 
        this.sprite.play('player-idle',true)
        }

        const espacio = Phaser.Input.Keyboard.JustDown(this.cursors!.space);
        if(espacio && this.grounded)
        {
          eventos.emit('jump')
            this.sprite.setVelocityY(-this.speed*3).play('player-jump');
            this.grounded = false;
        }

        //detectar si no esta en el suelo
        if(!this.grounded || this.sprite.getVelocity().y! > 1)
        {
            this.sprite.play('player-jump',true)
            this.grounded = false;
        }

        if(!this.fallen && this.sprite.y > 320)
        {
          this.camera.stopFollow();
          this.fallen=true;
          
          setTimeout(()=>{
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.camera.startFollow(this.sprite);
            this.fallen=false;
            this.sprite.setVelocity(0,-5);
            this.doDmgToPlayer(25,0);
          },1500)
        }
        //else(this.camera.startFollow(this.sprite))
    }

    doDmgToPlayer(dmg: number , upVelocity: number)
    {
      this.health -= dmg;
      eventos.emit('player-took-damage', this.health);
      this.playDamageAnimation();
      this.sprite.setVelocity(0, -upVelocity);

      if(this.health <= 0)
      {
        this.death = true;
        this.sprite.play('player-death');
        this.sprite.setOnCollide(()=>{})
        this.scene.time.delayedCall(1500,()=>{this.scene.scene.start('game-over')})
      }
    }

}