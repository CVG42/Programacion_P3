import Phaser from "phaser";
import { Sidescroller } from "./scenes/Sidescroller";
import { UIScene } from "./scenes/UIScene";
import GameOver from "./scenes/GameOver";
import Victory from "./scenes/Victory";


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#333333',
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    //default: 'arcade',
    default: 'matter',
    matter: {
      debug: true
    }
  },
  scene: [ Sidescroller, UIScene, GameOver, Victory ]
}

export default new Phaser.Game(config);

