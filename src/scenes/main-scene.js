import Phaser from 'phaser';
import dudeImg from '../assets/w.png';
import enemyImg from '../assets/ghost.png';
import tileSet from '../assets/mainlevbuild.png';
import mapJSON from '../assets/map1.json';
import Player from '../entities/player';
import Enemy from '../entities/enemy';

let score = 0;
let scoreText = null;
let lvlText = null;
let level = 1;
let enemies = 0;
let enemySprites = [];

export default class MainScene extends Phaser.Scene {
  init(data) {
    this.nothing = 0;
    if (data) {
      if (data.reset) {
        score = 0;
        level = 1;
      }
    }
  }

  preload() {
    this.load.tilemapTiledJSON('map', mapJSON);
    this.load.image('tiles', tileSet);
    this.load.spritesheet('dude', dudeImg, { frameWidth: 231, frameHeight: 190 });
    this.load.spritesheet('ghost', enemyImg, { frameWidth: 64, frameHeight: 80 });
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('platforms', 'tiles');
    const platforms = map.createDynamicLayer('Tile Layer 1', tileset, 0, 0);

    platforms.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(platforms);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(this, 300, 200);

    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);

    const spawnRegion = {
      x: 500, y: 100, width: map.widthInPixels - 600, height: 150,
    };
    enemies = level * 5;
    enemySprites = [];

    for (let i = 0; i < enemies; i += 1) {
      enemySprites.push(new Enemy(this,
        Phaser.Math.RND.integerInRange(spawnRegion.x, spawnRegion.x + spawnRegion.width),
        Phaser.Math.RND.integerInRange(spawnRegion.y, spawnRegion.y + spawnRegion.height),
        200));
    }

    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this,
    });

    scoreText = this.add.text(16, 16, `Banished spirits: ${score}`, { fontSize: '32px', fill: '#fff' });
    lvlText = this.add.text(650, 16, `Level ${level}`, { fontSize: '32px', fill: '#fff' });

    scoreText.setScrollFactor(0).setDepth(1000);
    lvlText.setScrollFactor(0).setDepth(1000);
  }

  onPlayerCollide({ gameObjectB }) {
    if (!gameObjectB || !(gameObjectB.constructor.name === 'MatterSprite')) return;
    if (this.player.isAttacking) {
      gameObjectB.destroy();
      this.banishSpirit();
      if (enemies === 0) {
        level += 1;
        this.scene.start('main', { reset: false });
      }
      return;
    }

    this.unsubscribePlayerCollide();

    this.player.freeze();
    const cam = this.cameras.main;
    cam.fade(250, 0, 0, 0);
    cam.once('camerafadeoutcomplete', () => this.scene.start('score', { score }));
  }

  banishSpirit() {
    this.nothing = 0;
    score += 1;
    enemies -= 1;
    scoreText.setText(`Banished spirits: ${score}`);
  }

  update() {
    this.nothing = 0;
  }
}