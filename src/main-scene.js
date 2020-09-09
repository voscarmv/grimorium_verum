import dudeImg from "./assets/w.png";
import enemyImg from "./assets/ghost.png"
import tileSet from "./assets/mainlevbuild.png";
import mapJSON from "./assets/map1.json";
import Player from "./player"
import Enemy from "./enemy"

const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules

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
    this.enemy1 = new Enemy(this, 600, 200, 100);
    this.enemy2 = new Enemy(this, 600, 200, 100);
    this.enemy3 = new Enemy(this, 550, 100, 70);
    this.enemy4 = new Enemy(this, 620, 150, 20);

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

  }

  onPlayerCollide({ gameObjectB }) {

    if (!gameObjectB || !(gameObjectB.constructor.name == 'MatterSprite')) return;
    if(this.player.isAttacking) {
      gameObjectB.destroy();
      return;
    }
    console.log(`Touched by ${gameObjectB.constructor.name}`);


    const enemy = gameObjectB;
    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    // Unsubscribe from collision events so that this logic is run only once
    this.unsubscribePlayerCollide();

    this.player.freeze();
    const cam = this.cameras.main;
    cam.fade(250, 0, 0, 0);
    cam.once("camerafadeoutcomplete", () => this.scene.restart());
  }

  update() {

  }

}
