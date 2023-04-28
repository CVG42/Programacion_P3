import Phaser from "phaser";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Tarea } from "./scenes/Tarea";

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#333333',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade:{
            gravity: {y:200}
        }
    },
    scene: [Scene1,Scene2,Scene3,Tarea]
}

export default new Phaser.Game(config);