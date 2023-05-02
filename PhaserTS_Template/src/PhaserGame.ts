import Phaser from "phaser";
import { Sidescroller } from "./scenes/Sidescroller";


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#333333',
  width: 800,
  height: 600,
  physics: {
    //default: 'arcade',
    default: 'matter',
    matter: {
      debug: true
    }
  },
  scene: [ Sidescroller ]
}

export default new Phaser.Game(config);

