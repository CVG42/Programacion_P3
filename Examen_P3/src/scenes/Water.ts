import Phaser from "phaser";
import { instancia as eventos } from './EventCenter'

export default class Water
{

	private sprite: Phaser.Physics.Matter.Sprite //sprite del enemigo

	constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite)
	{

		this.sprite = sprite

		this.createAnimations();
    this.sprite.play('water');    
	}


	private createAnimations()
	{
		this.sprite.anims.create({
			key: 'water',
			frames: [{ key: 'water', frame: '00_water_a_8frames.png' },{ key: 'water', frame: '01_water_a_8frames.png' },{ key: 'water', frame: '02_water_a_8frames.png' }
            ,{ key: 'water', frame: '03_water_a_8frames.png' },{ key: 'water', frame: '04_water_a_8frames.png' },{ key: 'water', frame: '05_water_a_8frames.png' }
            ,{ key: 'water', frame: '06_water_a_8frames.png' },{ key: 'water', frame: '07_water_a_8frames.png' }],
            repeat:-1,
            frameRate: 8
		})
	}

}