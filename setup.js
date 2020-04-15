const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#0000ff",
  parent: "game-container",
  pixelArt: true,
  scene: [test],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  }
};

var game = new Phaser.Game(config);