export default class EnemyData {
  constructor(x, width, scene) {
    this.destroyed = false;
    this.initial_x = x;
    this.range = width;
    this.scene = scene;
    this.isTouching = { left: false, right: false, ground: false };
    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }
}