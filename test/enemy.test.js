import Phaser from 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import MainScene from '../src/scenes/main-scene';
import Enemy from '../src/entities/enemy';

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

require('jest-canvas-mock');

const game = new Phaser.Game(config);

const e = new Enemy(game.scene.add('main', MainScene), 12, 12, 123);

test('Check all entity properties',
  () => {
    expect(e).toHaveProperty('destroyed');
  });