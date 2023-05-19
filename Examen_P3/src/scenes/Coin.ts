import Phaser from "phaser";
import { instancia as eventos } from './EventCenter'

export default class Coin
{

	private sprite: Phaser.Physics.Matter.Sprite //sprite del enemigo

	constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite)
	{

		this.sprite = sprite

		this.createAnimations();
    this.sprite.play('coin');    
	}


	private createAnimations()
	{
		this.sprite.anims.create({
			key: 'coin',
			frames: [{ key: 'coin', frame: '00_coin_gold.png' },{ key: 'coin', frame: '01_coin_gold.png' },{ key: 'coin', frame: '02_coin_gold.png' }
            ,{ key: 'coin', frame: '03_coin_gold.png' },{ key: 'coin', frame: '04_coin_gold.png' },{ key: 'coin', frame: '05_coin_gold.png' }
            ,{ key: 'coin', frame: '06_coin_gold.png' },{ key: 'coin', frame: '07_coin_gold.png' }],
            repeat:-1,
            frameRate: 12
		})
	}

}