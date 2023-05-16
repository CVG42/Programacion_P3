import Phaser from 'phaser'

export default class GameOver extends Phaser.Scene
{
	constructor()
	{
		super('game-over') //key de la escena
	}

	create()
	{
		const { width, height } = this.scale

		this.add.text(width * 0.5, height * 0.3, 'Game Over', {
			fontSize: '52px',
			color: '#ff0000',
			fontFamily: 'Segoe UI' //cualquiera de las fuentes instaladas sirve
		})
		.setOrigin(0.5) //añadimos texto

		const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0xffffff)
			.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
				this.scene.start('Sidescroller') //lo que va a hacer cuando demos click
			})//creamos un rectangulo con interactividad con el mouse

		this.add.text(button.x, button.y, 'Play Again', {
			color: '#000000', 
			fontFamily:'Segoe UI'
		})
		.setOrigin(0.5)//un texto en el boton
	}
}
