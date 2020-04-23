const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#f5f5f5",
  parent: "game-container",
  pixelArt: true,
  scene: [test],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  }
};

var game = new Phaser.Game(config);