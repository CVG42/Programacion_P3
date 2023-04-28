class Scene3 extends Phaser.Scene{
      
    constructor(){
        super({key:"Scene3"});
    }

    prelaod(){
        this.laod.audio('Trompeta',['assets/trumpets.mp3']);
    }

    create()
    {
        this.sonidoFX = this.sound.add('Trompeta', {loop:"true"});
        this.sonidoFX.play();
        this.sonidoFX.rate=1;
        this.sonidoFX,voluemn = 0.1;

        this.input.keyboard.on('keydown-L', function(event) {

            this.sonidoFX.loop = !this.sonidoFX.loop;
            if (this.sonidoFX.loop) this.sonidoFX.play();
      
          },this);
      
          this.input.keyboard.on('keydown-P', function(event) {
      
            if (this.sonidoFX.isPlaying) this.sonidoFX.pause();
            else this.sonidoFX.resume();
      
          },this);
    }

}