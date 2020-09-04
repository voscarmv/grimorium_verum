import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import skyImg from "../tutorial/assets/sky.png";
import gndImg from "../tutorial/assets/platform.png";
import dudeImg from "../tutorial/assets/dude.png";
import starImg from "../tutorial/assets/star.png";
import bombImg from "../tutorial/assets/bomb.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300 },
        debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
};

const game = new Phaser.Game(config);

var score = 0;
var scoreText;

function preload() {
  this.load.image("sky", skyImg);
  this.load.image("ground", gndImg);
  this.load.image("logo", logoImg);
  this.load.image("star", starImg);
  this.load.image("bomb", bombImg);
  this.load.spritesheet("dude", dudeImg, { frameWidth: 32, frameHeight: 48 });
}

var platforms;
var player;
var cursors;
var stars;
var bombs;
var gameOver = false;

function create() {
  this.add.image(400, 300, 'sky');
  const logo = this.add.image(400, 150, "logo");

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(300, 300, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  scoreText = this.add.text(15, 15, 'score: 0', { fontSize: '32px', fill: '#000' });

  this.physics.add.collider(player, platforms);

  cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(
    (child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.9));
    }
  );

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(stars, player, collectStar, null, this);

  bombs = this.physics.add.group();

this.physics.add.collider(bombs, platforms);

this.physics.add.collider(player, bombs, hitBomb, null, this);

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}

function collectStar(player, star){
  star.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0)
  {
      stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);

      });

      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      var bomb = bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

function update() {
  if(cursors.left.isDown){
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if(cursors.right.isDown){
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn', true);
  }
  if(cursors.up.isDown){
    player.setVelocityY(-390);
  }
}
