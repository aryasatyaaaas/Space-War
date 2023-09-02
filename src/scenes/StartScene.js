import Phaser from "phaser";
export default class StartScene extends Phaser.Scene {
  constructor() {
    super("start-scene");
  }
  init(data) {
    this.startButton = undefined;
  }
  preload() {
    this.load.image("background", "images/spacebg.jpg");
    this.load.image("start", "images/rocket.png");
    this.load.image("logo", "images/logo.png");
    this.load.image("start-button", "images/start.png");
  }
  create() {
    this.add.image(200, 300, "background");
    this.add.image(200, 100, "logo");
    this.add.image(200, 300, "start").setScale(0.5);

    this.startButton = this.add
      .image(200, 500, "start-button")
      .setInteractive()
      .setScale(0.4);

    this.startButton.once(
      "pointerup",
      () => {
        this.scene.start("space-shooter-scene");
      },
      this
    );
  }
}
