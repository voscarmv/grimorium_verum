export default class PlayerData {
  constructor(scene) {
    this.destroyed = false;
    this.scene = scene;
    this.isTouching = { left: false, right: false, ground: false };
    this.canJump = true;
    this.jumpCooldownTimer = null;
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
  }
}