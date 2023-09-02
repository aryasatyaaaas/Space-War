import Phaser from "phaser";
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("over-scene");
  }
  init(data) {
    this.replayButton = undefined;
    this.score = data.score;
  }
  preload() {
    this.load.image("background", "images/spacebg.png");
    this.load.image("gameover", "images/gameover.png");
    this.load.image("replay-button", "images/replay.png");
  }
  create() {
    this.add.image(200, 320, "background");
    this.add.image(200, 200, "gameover");
    this.add.text(100, 400, "Score :" + this.score, {
      fontSize: "40px",
      //@ts-ignore
      fill: "yellow",
    });
    this.replayButton = this.add
      .image(200, 500, "replay-button")
      .setInteractive()
      .setScale(0.5);
    this.replayButton.once(
      "pointerup",
      () => {
        this.scene.start("space-shooter-scene");
      },
      this
    );
  }
}
