// import skyImg from "../tutorial/assets/sky.png";
// import gndImg from "../tutorial/assets/platform.png";
import dudeImg from "./assets/w.png";
import enemyImg from "./assets/ghost.png"
// import starImg from "../tutorial/assets/star.png";
// import bombImg from "../tutorial/assets/bomb.png";
import tileSet from "./assets/mainlevbuild.png";
import mapJSON from "./assets/map1.json";
import Player from "./player"
import Enemy from "./enemy"

// var score = 0;
// var scoreText;

// var platforms;
// var player;
// var cursors;
// var stars;
// var bombs;
// var gameOver = false;

export default class MainScene extends Phaser.Scene {
  preload() {
    // console.log("load map");
    this.load.tilemapTiledJSON("map", mapJSON);
    // console.log("load image");
    this.load.image("tiles", tileSet);
    this.load.image("sky", "../tutorial/assets/sky.png");
    // this.load.image("ground", gndImg);
    // // this.load.image("logo", logoImg);
    // this.load.image("star", starImg);
    // this.load.image("bomb", bombImg);
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


    // const { x, y } = map.findObject("Spawn", obj => obj.name === "Spawn Point");
    this.player = new Player(this, 300, 200);
    this.enemy1 = new Enemy(this, 600, 200, 100);
    this.enemy2 = new Enemy(this, 600, 200, 100);
    this.enemy3 = new Enemy(this, 550, 100, 70);
    this.enemy4 = new Enemy(this, 620, 150, 80);

    for (let i = 0; i < 35; i++) {
      const x = this.player.sprite.x + Phaser.Math.RND.integerInRange(-50, 50);
      const y = this.player.sprite.y - 150 + Phaser.Math.RND.integerInRange(-10, 10);
      this.matter.add
        .image(x, y, "emoji", "1f60d", {
          restitution: 1,
          friction: 0,
          density: 0.0001,
          shape: "circle"
        })
        .setScale(0.5);
    }

    // platforms.setCollisionByExclusion(-1, true);
    // const logo = this.add.image(400, 150, "logo");
  
    // platforms = this.physics.add.staticGroup();
  
    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
  
    // var player = this.matter.add.sprite(300, 300, 'dude');
  
    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);
    // scoreText = this.add.text(15, 15, 'score: 0', { fontSize: '32px', fill: '#000' });
  
  //   this.physics.add.collider(player, platforms);
  
  //   cursors = this.input.keyboard.createCursorKeys();
  
  //   this.anims.create({
  //     key: 'left',
  //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
  //     frameRate: 10,
  //     repeat: -1
  // });
  
  // this.anims.create({
  //     key: 'turn',
  //     frames: [ { key: 'dude', frame: 4 } ],
  //     frameRate: 20
  // });
  
  // this.anims.create({
  //     key: 'right',
  //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
  //     frameRate: 10,
  //     repeat: -1
  // });
  
  //   stars = this.physics.add.group({
  //     key: 'star',
  //     repeat: 11,
  //     setXY: { x: 12, y: 0, stepX: 70 }
  //   });
  
  //   stars.children.iterate(
  //     (child) => {
  //       child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.9));
  //     }
  //   );
  
  //   // this.physics.add.collider(stars, platforms);
  //   this.physics.add.overlap(stars, player, collectStar, null, this);
  
  //   bombs = this.physics.add.group();
  
  // // this.physics.add.collider(bombs, platforms);
  
  // this.physics.add.collider(player, bombs, hitBomb, null, this);
  
  //   // this.tweens.add({
  //   //   targets: logo,
  //   //   y: 450,
  //   //   duration: 2000,
  //   //   ease: "Power2",
  //   //   yoyo: true,
  //   //   loop: -1
  //   // });
  }
  
  // collectStar(player, star){
  //   star.disableBody(true, true);
  //   score += 10;
  //   scoreText.setText('Score: ' + score);
  
  //   if (stars.countActive(true) === 0)
  //   {
  //       stars.children.iterate(function (child) {
  
  //           child.enableBody(true, child.x, 0, true, true);
  
  //       });
  
  //       var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  
  //       var bomb = bombs.create(x, 16, 'bomb');
  //       bomb.setBounce(1);
  //       bomb.setCollideWorldBounds(true);
  //       bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  
  //   }
  // }
  
  // hitBomb (player, bomb)
  // {
  //     this.physics.pause();
  
  //     player.setTint(0xff0000);
  
  //     player.anims.play('turn');
  
  //     gameOver = true;
  // }
  
  update() {
    // if(cursors.left.isDown){
    //   player.setVelocityX(-160);
    //   player.anims.play('left', true);
    // }
    // else if(cursors.right.isDown){
    //   player.setVelocityX(160);
    //   player.anims.play('right', true);
    // }
    // else {
    //   player.setVelocityX(0);
    //   player.anims.play('turn', true);
    // }
    // if(cursors.up.isDown){
    //   player.setVelocityY(-390);
    // }
  }

}


