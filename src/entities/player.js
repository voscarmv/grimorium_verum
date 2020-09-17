import Phaser from 'phaser';
import MultiKey from './multi-key';
import PlayerData from './playerdata';

const { Body, Bodies } = Phaser.Physics.Matter.Matter;

export default class Player {
  constructor(scene, x, y) {
    this.playerData = new PlayerData(scene);

    const { anims } = scene;

    anims.create({
      key: 'player-idle',
      frames: anims.generateFrameNumbers('dude', { start: 8, end: 13 }),
      frameRate: 20,
      repeat: -1,
    });

    anims.create({
      key: 'player-jump',
      frames: anims.generateFrameNumbers('dude', { start: 14, end: 15 }),
      frameRate: 20,
    });

    anims.create({
      key: 'player-attack',
      frames: anims.generateFrameNumbers('dude', { start: 16, end: 23 }),
      frameRate: 20,
    });

    anims.create({
      key: 'player-run',
      frames: anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.sprite = scene.matter.add.sprite(0, 0, 'dude', 0);
    const { width: w, height: h } = this.sprite;
    const mainBody = Bodies.rectangle(0, 0, w * 0.2, h * 0.4, { chamfer: { radius: 10 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, h * 0.2, w * 0.2, 1, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.1, 0, 2, h * 0.2, { isSensor: true }),
      right: Bodies.rectangle(w * 0.1, 0, 2, h * 0.2, { isSensor: true }),
    };
    const compoundBody = Body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionStatic: 0.5,
      frictionAir: 0.02,
      friction: 0.1,
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setScale(1)
      .setFixedRotation()
      .setPosition(x, y);

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

    const {
      LEFT, RIGHT, UP, SPACE,
    } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT]);
    this.rightInput = new MultiKey(scene, [RIGHT]);
    this.jumpInput = new MultiKey(scene, [UP]);
    this.attackInput = new MultiKey(scene, [SPACE]);

    this.playerData.scene.events.on('update', this.update, this);

    this.destroyed = false;
    this.playerData.scene.events.on('update', this.update, this);
    this.playerData.scene.events.once('shutdown', this.destroy, this);
    this.playerData.scene.events.once('destroy', this.destroy, this);
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.left) {
      this.playerData.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.playerData.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.playerData.isTouching.ground = true;
    }
  }

  resetTouching() {
    this.playerData.isTouching.left = false;
    this.playerData.isTouching.right = false;
    this.playerData.isTouching.ground = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (this.destroyed) return;

    const { sprite } = this;
    const { velocity } = sprite.body;
    const isRightKeyDown = this.rightInput.isDown();
    const isLeftKeyDown = this.leftInput.isDown();
    const isJumpKeyDown = this.jumpInput.isDown();
    const isOnGround = this.playerData.isTouching.ground;
    const isAttackKeyDown = this.attackInput.isDown();
    const isInAir = !isOnGround;

    const moveForce = isOnGround ? 0.015 : 0.005;

    if (isLeftKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(true);

      if (!(isInAir && this.playerData.isTouching.left)) {
        sprite.applyForce({ x: -moveForce, y: 0 });
      }
    } else if (isRightKeyDown && !isAttackKeyDown) {
      sprite.setFlipX(false);

      if (!(isInAir && this.playerData.isTouching.right)) {
        sprite.applyForce({ x: moveForce, y: 0 });
      }
    }

    if (velocity.x > 8) sprite.setVelocityX(8);
    else if (velocity.x < -8) sprite.setVelocityX(-8);

    if (isJumpKeyDown && this.playerData.canJump && isOnGround && !isAttackKeyDown) {
      sprite.setVelocityY(-11);

      this.playerData.canJump = false;
      this.playerData.jumpCooldownTimer = this.playerData.scene.time.addEvent({
        delay: 250,
        callback: () => { this.playerData.canJump = true; },
      });
    }

    if (isAttackKeyDown) {
      sprite.anims.play('player-attack', true);
      this.isAttacking = true;
    } else if (isOnGround) {
      this.isAttacking = false;

      if (sprite.body.force.x !== 0) sprite.anims.play('player-run', true);
      else sprite.anims.play('player-idle', true);
    } else {
      this.isAttacking = false;

      sprite.anims.play('player-jump', true);
    }
  }

  destroy() {
    this.destroyed = true;

    this.playerData.scene.events.off('update', this.update, this);
    this.playerData.scene.events.off('shutdown', this.destroy, this);
    this.playerData.scene.events.off('destroy', this.destroy, this);
    if (this.playerData.scene.matter.world) {
      this.playerData.scene.matter.world.off('beforeupdate', this.resetTouching, this);
    }

    const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
    this.playerData.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.playerData.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

    if (this.playerData.jumpCooldownTimer) this.playerData.jumpCooldownTimer.destroy();

    this.sprite.destroy();
  }
}
