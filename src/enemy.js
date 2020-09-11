import Phaser from 'phaser';

let isRightKeyDown = false;
let isLeftKeyDown = true;

export default class Enemy {
  constructor(scene, x, y, width) {
    this.destroyed = false;
    this.initial_x = x;
    this.range = width;

    this.scene = scene;
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

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;

    scene.matter.world.on('beforeupdate', this.resetTouching, this);

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });

    this.destroyed = false;
    this.scene.events.on('update', this.update, this);
    this.scene.events.once('shutdown', this.destroy, this);
    this.scene.events.once('destroy', this.destroy, this);
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (!this.sprite.body) return;
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (!this.sprite.body) return;

    const { sprite } = this;
    const { velocity } = sprite.body;

    const isJumpKeyDown = true;
    const isOnGround = this.isTouching.ground;
    const isAttackKeyDown = false;
    const isInAir = !isOnGround;

    if (this.sprite.x < this.initial_x - this.range) {
      isLeftKeyDown = false;
      isRightKeyDown = true;
    }
    if (this.sprite.x > this.initial_x + this.range) {
      isLeftKeyDown = true;
      isRightKeyDown = false;
    }

    const moveForce = isOnGround ? 0.01 : 0.005;

    if (isLeftKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(true);

      if (!(isInAir && this.isTouching.left)) {
        sprite.applyForce({ x: -moveForce, y: 0 });
      }
    } else if (isRightKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(false);

      if (!(isInAir && this.isTouching.right)) {
        sprite.applyForce({ x: moveForce, y: 0 });
      }
    }

    if (velocity.x > 7) sprite.setVelocityX(7);
    else if (velocity.x < -7) sprite.setVelocityX(-7);

    if (isJumpKeyDown && this.canJump && isOnGround) {
      sprite.setVelocityY(-11);
      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => { this.canJump = true; },
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
