import Phaser from "phaser";
export default class extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, config) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.speed = config.speed;
    this.rotationVal = config.rotation;
    this.shield = config.shield;
  }
  spawn(positionX) {
    this.setPosition(positionX, -10);
    this.setActive(true);
    this.setVisible(true);
  }
  die() {
    if (this.shield > 0) {
      this.shield--;
    } else {
      this.destroy();
    }
  }
  update(time) {
    this.setVelocityY(this.speed);
    this.rotation += this.rotationVal;
    const gameHeight = this.scene.scale.height;
    if (this.y > gameHeight + 5) {
      this.die();
    }
  }
}
