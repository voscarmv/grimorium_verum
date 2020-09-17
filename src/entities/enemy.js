import Phaser from 'phaser';
import EnemyData from './enemydata';
// import ghost from './assets/ghost.png';

let isRightKeyDown = false;
let isLeftKeyDown = true;

export default class Enemy {
  constructor(scene, x, y, width) {
    this.enemyData = new EnemyData(x, width, scene);

    const { anims } = scene;

    anims.create({
      key: 'ghost-idle',
      frames: anims.generateFrameNumbers('ghost', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'ghost-jump',
      frames: anims.generateFrameNumbers('ghost', { start: 0, end: 3 }),
      frameRate: 10,
    });

    anims.create({
      key: 'ghost-attack',
      frames: anims.generateFrameNumbers('ghost', { start: 0, end: 3 }),
      frameRate: 10,
    });

    anims.create({
      key: 'ghost-run',
      frames: anims.generateFrameNumbers('ghost', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.sprite = scene.matter.add.sprite(0, 0, 'enemy', 0);
    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, { chamfer: { radius: 10 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom],
      frictionStatic: 0,
      frictionAir: 0.02,
      friction: 0.1,
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setScale(2)
      .setFixedRotation()
      .setPosition(x, y);

    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom],
      callback: this.onSensorCollide,
      context: this,
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom],
      callback: this.onSensorCollide,
      context: this,
    });

    this.destroyed = false;
    this.enemyData.scene.events.on('update', this.update, this);
    this.enemyData.scene.events.once('shutdown', this.destroy, this);
    this.enemyData.scene.events.once('destroy', this.destroy, this);
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (!this.sprite.body) return;
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.left) {
      this.enemyData.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.enemyData.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.enemyData.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.enemyData.isTouching.left = false;
    this.enemyData.isTouching.right = false;
    this.enemyData.isTouching.ground = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (!this.sprite.body) return;

    const { sprite } = this;
    const { velocity } = sprite.body;

    const isJumpKeyDown = true;
    const isOnGround = this.enemyData.isTouching.ground;
    const isAttackKeyDown = false;
    const isInAir = !isOnGround;

    if (this.sprite.x < this.enemyData.initial_x - this.enemyData.range) {
      isLeftKeyDown = false;
      isRightKeyDown = true;
    }
    if (this.sprite.x > this.enemyData.initial_x + this.enemyData.range) {
      isLeftKeyDown = true;
      isRightKeyDown = false;
    }

    const moveForce = isOnGround ? 0.01 : 0.005;

    if (isLeftKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(true);

      if (!(isInAir && this.enemyData.isTouching.left)) {
        sprite.applyForce({ x: -moveForce, y: 0 });
      }
    } else if (isRightKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(false);

      if (!(isInAir && this.enemyData.isTouching.right)) {
        sprite.applyForce({ x: moveForce, y: 0 });
      }
    }

    if (velocity.x > 7) sprite.setVelocityX(7);
    else if (velocity.x < -7) sprite.setVelocityX(-7);

    if (isJumpKeyDown && this.enemyData.canJump && isOnGround) {
      sprite.setVelocityY(-11);
      this.enemyData.canJump = false;
      this.enemyData.jumpCooldownTimer = this.enemyData.scene.time.addEvent({
        delay: 250,
        callback: () => { this.enemyData.canJump = true; },
      });
    }

    if (isOnGround) {
      if (sprite.body.force.x !== 0) sprite.anims.play('ghost-run', true);
      else sprite.anims.play('ghost-idle', true);
    } else {
      sprite.anims.play('ghost-jump', true);
    }
  }

  destroy() {
    this.destroyed = true;
    this.sprite.destroy();
  }
}
