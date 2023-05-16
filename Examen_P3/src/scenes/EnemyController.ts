import Phaser from "phaser";
import { instancia as eventos } from './EventCenter'

export default class EnemyController
{
	private scene!: Phaser.Scene //para poder usar los tweens de la escena
	private sprite: Phaser.Physics.Matter.Sprite //sprite del enemigo

  private goingRight: boolean = Phaser.Math.RND.between(0,1) == 0?true:false; //un booleano que empieza en true o false
  private Waiting: boolean = true; //un booleano de esperar
	private moveTime = 0; //una variable pa llevar el tiempo
  private waitTime: number = 100;
  private speed: number = 1.25;
  death: boolean = false; //si esta muerto

	constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite)
	{
		this.scene = scene
		this.sprite = sprite

		this.createAnimations();

		eventos.on('enemy-stomped', this.handleStomped, this)
    this.sprite.play('enemy-neutral');    
	}


	update(dt: number)
	{       

    if(this.death) //si no esta muerto ejecuta lo demas
    return;

    if(this.Waiting && this.waitTime > 0){      
      this.waitTime -= dt; //restamos delta time para que en todas las PC jale masomenos igual
    }else if(this.waitTime<0){
      this.Waiting = false;
      this.waitTime=0;
      this.moveTime = 900;
    }

  
    if(!this.Waiting && this.moveTime > 0){
      this.moveTime -= dt;
      if(this.goingRight){
        this.sprite.flipX = false;
        this.sprite.setVelocityX(this.speed);
        this.sprite.play('enemy-caminar',true);
      }else{
        this.sprite.flipX = true;
        this.sprite.setVelocityX(-this.speed);
        this.sprite.play('enemy-caminar',true);
      }
    }else if(!this.Waiting && this.moveTime<0){      
      this.goingRight = !this.goingRight;
      this.Waiting = true;
      this.moveTime=0;      
      this.waitTime = Phaser.Math.RND.between(500,2000);      
      this.sprite.play('enemy-neutral');  
    }

    
	}

	private createAnimations()
	{
		this.sprite.anims.create({
			key: 'enemy-neutral',
			frames: [{ key: 'enemy', frame: 'tile_0323.png' }]
		})

		this.sprite.anims.create({
			key: 'enemy-caminar',
			frameRate:12,
      frames: [
        {key:'enemy', frame:"tile_0321.png"},
        {key:'enemy', frame:"tile_0320.png"},
        {key:'enemy', frame:"tile_0322.png"}],
      repeat:-1 //infinite
		})

		this.sprite.anims.create({
			key: 'enemy-die',
			frames: [{ key: 'enemy', frame: 'tile_0324.png' }]
		})
	}

  private handleStomped(enemySprite: Phaser.Physics.Matter.Sprite)
	{
		if (this.sprite !== enemySprite) //si no es el mismo sprite que el del evento ignoramos
		{
			return
		}
    this.death=true;
		eventos.off('enemy-stomped', this.handleStomped, this) //removemos el evento

		this.sprite.play('enemy-die');
    this.sprite.setOnCollide(() => {}); //en teoria deshabilita las colisiones con este objeto pero del dicho al hecho hay mucho trecho

    this.scene.tweens.add({ //animacion que lo apachurra cada vez mas
			targets: this.sprite,
			displayHeight: 0,
			y: this.sprite.y + (this.sprite.displayHeight * 0.5),
			duration: 200,
			onComplete: () => {
				this.sprite.destroy() //destruimos y ya no podremos usar denuevo
			}
		})
	}

  destroy() //callback
	{
		eventos.off('enemy-stomped', this.handleStomped, this) //por si queremos hacernos cargo de cosas extra al destruir el objeto
	}

}