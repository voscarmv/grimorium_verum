import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MainScene from './scenes/main-scene';
import ScoreScene from './scenes/score-scene';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/style.css';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  pixelArt: true,
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'matter',
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
      },
    ],
  },
  autoCenter: true,
};

const game = new Phaser.Game(config);

game.scene.add('main', MainScene);
game.scene.add('score', ScoreScene);

game.scene.start('main');