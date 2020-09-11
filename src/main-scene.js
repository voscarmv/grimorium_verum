import dudeImg from "./assets/w.png";
import enemyImg from "./assets/ghost.png"
import tileSet from "./assets/mainlevbuild.png";
import mapJSON from "./assets/map1.json";
import Player from "./player"
import Enemy from "./enemy"

const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules

let score = 0;
let scoreText = null;
let lvlText = null;
let level = 1;
let enemies = 0;

export default class MainScene extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("map", mapJSON);
    this.load.image("tiles", tileSet);
    this.load.image("sky", "../tutorial/assets/sky.png");
    this.load.spritesheet("dude", dudeImg, { frameWidth: 231, frameHeight: 190 });
    this.load.spritesheet("ghost", enemyImg, { frameWidth: 64, frameHeight: 80 });
  }
  
  create() {
    this.add.image(400, 300, 'sky');
  
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage('platforms', "tiles");
    const platforms = map.createDynamicLayer('Tile Layer 1', tileset, 0, 0);


    platforms.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(platforms);

    this.player = new Player(this, 300, 200);

    const spawnRegion = { x: 400, y: 0, width: 400, height: 300 };
    enemies = level * 5;
    let enemySprites = [];

    for(let i = 0; i < enemies; i += 1){
      enemySprites.push(new Enemy(this,
        Phaser.Math.RND.integerInRange(spawnRegion.x, spawnRegion.x + spawnRegion.width),
        Phaser.Math.RND.integerInRange(spawnRegion.y, spawnRegion.y + spawnRegion.height) - 100,
        50
      ));
    }

    // this.enemy1 = new Enemy(this, 600, 200, 100);
    // this.enemy2 = new Enemy(this, 600, 200, 100);
    // this.enemy3 = new Enemy(this, 550, 100, 70);
    // this.enemy4 = new Enemy(this, 620, 150, 20);

    // for (let i = 0; i < 35; i++) {
    //   const x = this.player.sprite.x + Phaser.Math.RND.integerInRange(-50, 50);
    //   const y = this.player.sprite.y - 150 + Phaser.Math.RND.integerInRange(-10, 10);
    //   this.matter.add
    //     .image(x, y, "emoji", "1f60d", {
    //       restitution: 1,
    //       friction: 0,
    //       density: 0.0001,
    //       shape: "circle"
    //     })
    //     .setScale(0.5);
    // }

    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this
    });


    scoreText = this.add.text(16, 16, 'Banished spirits: ' + score, { fontSize: '32px', fill: '#000' });
    lvlText = this.add.text(650, 16, "Level " + level, { fontSize: '32px', fill: '#000' });
  }

  onPlayerCollide({ gameObjectB }) {

    if (!gameObjectB || !(gameObjectB.constructor.name == 'MatterSprite')) return;
    if(this.player.isAttacking) {
      gameObjectB.destroy();
      this.banishSpirit();
      if(enemies == 0){
        level += 1;
        this.scene.restart();
      }
      return;
    }
    // console.log(`Touched by ${gameObjectB.constructor.name}`);


    const enemy = gameObjectB;
    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    // Unsubscribe from collision events so that this logic is run only once
    this.unsubscribePlayerCollide();

    this.player.freeze();
    const cam = this.cameras.main;
    cam.fade(250, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.switch('score'));
  }

  banishSpirit (player, star)
  {
      score += 1;
      enemies -= 1;
      scoreText.setText('Banished spirits: ' + score);
  }

  update() {

  }

}