import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";
import Laser from "../ui/Laser";
export default class SpaceShooterScene extends Phaser.Scene {
  constructor() {
    super("space-shooter-scene");
  }
  init() {
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 250;
    this.cursors = undefined;
    this.enemies = undefined;
    this.enemySpeed = 50;
    this.lasers = undefined;
    this.lastFired = 10;
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel = undefined;
    this.life = 3;
    this.heart = undefined;
    this.backsound = undefined;
    this.rocket = undefined;
    this.rocketSpeed = 50;
    this.ammo = undefined;
    this.ammoJumlah = 20;
    this.ammoLabel = undefined;
    this.largeMeteor = undefined;
    this.largeMeteorSpeed = 50;
  }
  preload() {
    this.load.image("background", "images/spacebg.png");
    this.load.image("left-btn", "images/arrow-left.png");
    this.load.image("right-btn", "images/arrow-right.png");
    this.load.image("shoot", "images/shoot-btn.png");
    this.load.spritesheet("player", "images/player.png", {
      frameWidth: 630,
      frameHeight: 360,
    });
    this.load.image("enemy", "images/meteor.png");
    this.load.image("heart", "images/heart-icon.png");
    this.load.image("rocket", "images/enemy2.png");
    this.load.image("bullets", "images/peluru.png");
    this.load.image("large-meteor", "images/meteor2.png");
    this.load.spritesheet("laser", "images/laser-bolts.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.audio("laser-sound", "sfx/gunshot.wav");
    this.load.audio("destroy", "sfx/destroy.wav");
    this.load.audio("collect-heart", "sfx/collect-items.mp3");
    this.load.audio("gameover-sound", "sfx/gameover.mp3");
    this.load.audio("bgsound", "sfx/space-backsound.mp3");
  }
  create() {
    const gameWidth = this.scale.width * 0.5;
    const gameHeight = this.scale.height * 0.5;
    this.add.image(gameHeight, gameWidth, "background");
    this.createButton();
    this.player = this.createPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 30,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.rocket = this.physics.add.group({
      classType: FallingObject,
      maxSize: 30,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000),
      callback: this.spawnRocket,
      callbackScope: this,
      loop: true,
    });

    this.ammo = this.physics.add.group({
      classType: FallingObject,
      maxSize: 5,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.spawnAmmo,
      callbackScope: this,
      loop: true,
    });

    this.largeMeteor = this.physics.add.group({
      classType: FallingObject,
      maxSize: 1,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 5000,
      callback: this.spawnMeteor,
      callbackScope: this,
      loop: true,
    });

    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.heart = this.physics.add.group({
      classType: FallingObject,
      maxSize: 2,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 5000,
      callback: this.spawnHeart,
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.enemies,
      this.lasers,
      this.hitEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.rocket,
      this.lasers,
      this.hitEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.largeMeteor,
      this.lasers,
      this.hitEnemy,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.decreaseLife,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.rocket,
      this.decreaseLife,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.largeMeteor,
      this.decreaseLife,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.heart,
      this.increaseLife,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.ammo,
      this.increaseAmmo,
      null,
      this
    );

    this.scoreLabel = this.add
      .text(10, 10, "Score ", {
        fontSize: "20px",
        //@ts-ignore
        fill: "yellow",
      })
      .setDepth(1);

    this.lifeLabel = this.add
      .text(10, 30, "Life ", {
        fontSize: "20px",
        //@ts-ignore
        fill: "yellow",
      })
      .setDepth(1);

    this.ammoLabel = this.add.text(10, 50, "Ammo", {
      fontSize: "20px",
      //@ts-ignore
      fill: "yellow",
    });

    this.backsound = this.sound.add("bgsound");

    var soundConfig = {
      loop: true,
      volume: 0.5,
    };
    this.backsound.play(soundConfig);
  }
  update(time) {
    this.movePlayer(this.player, time);
    this.scoreLabel.setText("Score :" + this.score);
    this.lifeLabel.setText("Life :" + this.life);
    this.ammoLabel.setText("Ammo :" + this.ammoJumlah);
  }
  createButton() {
    this.input.addPointer(3);

    let shoot = this.add
      .image(320, 550, "shoot")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8);
    let nav_left = this.add
      .image(50, 550, "left-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.2);
    let nav_right = this.add
      .image(nav_left.x + nav_left.displayWidth + 20, 550, "right-btn")
      .setInteractive()
      .setDepth(0.5)
      .setAlpha(0.8)
      .setScale(0.2);

    nav_left.on(
      "pointerdown",
      () => {
        this.nav_left = true;
      },
      this
    );
    nav_left.on(
      "pointerout",
      () => {
        this.nav_left = false;
      },
      this
    );
    nav_right.on(
      "pointerdown",
      () => {
        this.nav_right = true;
      },
      this
    );
    nav_right.on(
      "pointerout",
      () => {
        this.nav_right = false;
      },
      this
    );
    shoot.on(
      "pointerdown",
      () => {
        this.shoot = true;
      },
      this
    );
    shoot.on(
      "pointerout",
      () => {
        this.shoot = false;
      },
      this
    );
  }

  movePlayer(player, time) {
    if (this.cursors.left.isDown || this.nav_left) {
      this.player.setVelocityX(this.speed * -1);
      this.player.anims.play("left", true);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.nav_right) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocity(0);
      this.player.anims.play("turn", true);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.speed);
    } else {
      this.player.setVelocityY(0);
    }
    if (this.shoot && time > this.lastFired && this.ammoJumlah) {
      const laser = this.lasers.get(0, 0, "laser");
      if (laser) {
        laser.fire(this.player.x, this.player.y);
        this.lastFired = time + 150;
        this.ammoJumlah--;
        this.sound.play("laser-sound");
      }
    }
  }
  createPlayer() {
    const player = this.physics.add.sprite(200, 450, "player").setScale(0.25);
    player.setCollideWorldBounds(true);
    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });

    return player;
  }

  spawnEnemy() {
    const config = {
      speed: 150,
      rotation: 0.1,
    };
    //@ts-ignore
    const enemy = this.enemies.get(0, 0, "enemy", config);
    const positionX = Phaser.Math.Between(50, 350);
    if (enemy) {
      enemy.spawn(positionX);
    }
  }

  hitEnemy(laser, enemy) {
    laser.die();
    enemy.die();
    this.score += 10;
    this.sound.play("destroy");
  }

  decreaseLife(player, enemy) {
    enemy.die();
    this.life--;
    if (this.life == 2) {
      player.setTint(0xff0000);
    } else if (this.life == 1) {
      player.setTint(0xff0000).setAlpha(0.2);
    } else if (this.life == 0) {
      this.sound.stopAll();
      this.sound.play("gameover-sound");
      this.scene.start("over-scene", { score: this.score });
    }
  }
  spawnHeart() {
    const config = {
      speed: 80,
      rotation: 0,
    };
    //@ts-ignore
    const heart = this.heart.get(0, 0, "heart", config).setScale(0.4);
    const positionX = Phaser.Math.Between(70, 330);
    if (heart) {
      heart.spawn(positionX);
    }
  }

  increaseLife(player, heart) {
    heart.die();
    this.life++;
    this.sound.play("collect-heart");
    if (this.life >= 3) {
      player.clearTint().setAlpha(2);
    }
  }

  increaseAmmo(player, ammo) {
    ammo.die();
    this.ammoJumlah += 5;
    this.sound.play("collect-heart");
  }

  spawnRocket() {
    const config = {
      speed: 250,
      rotation: 0,
      shield: 0,
    };
    //@ts-ignore
    const rocket = this.rocket.get(0, 0, "rocket", config).setScale(0.2);
    const positionX = Phaser.Math.Between(50, 350);
    if (rocket) {
      rocket.spawn(positionX);
    }
  }
  spawnAmmo() {
    const config = {
      speed: 80,
      rotation: 0,
    };
    //@ts-ignore
    const ammo = this.ammo.get(0, 0, "bullets", config).setScale(0.12);
    const positionX = Phaser.Math.Between(50, 350);
    if (ammo) {
      ammo.spawn(positionX);
    }
  }
  spawnMeteor() {
    const config = {
      speed: 100,
      rotation: 0.03,
      shield: 2,
    };

    const meteor = this.largeMeteor
      //@ts-ignore
      .get(0, 0, "large-meteor", config)
      .setScale(0.4);
    const positionX = Phaser.Math.Between(50, 350);
    if (meteor) {
      meteor.spawn(positionX);
    }
  }
}
