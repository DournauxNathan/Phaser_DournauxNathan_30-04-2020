class test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    init() {

	}

	preload() {
		this.load.image('background','assetsProto/sky.png');
		this.load.image('perso','assetsProto/purple.png');
	}

	create() {
		
		this.add.image(0,0,'background').setOrigin(0,0);

	    this.physics.world.setBounds(0, 0, 1024*2.25, 768);

	    this.player = this.physics.add.sprite(100,510,'perso');

	    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

		this.keys = this.input.keyboard.addKeys('Z,Q,S,D');
	}

	update() {
		//Déplacement
			if(this.keys.Q.isDown)
			{
				this.player.setVelocityX(-200);
				this.player.setFlipX(true);
			}
			else if(this.keys.D.isDown)
			{
				this.player.setVelocityX(200);
				this.player.setFlipX(false);
			}
			else
			{
				this.player.setVelocityX(0);
			}

			if(this.keys.Z.isDown)
			{
				this.player.setVelocityY(-200);
				this.player.setFlipX(true);
			}
			else if(this.keys.S.isDown)
			{
				this.player.setVelocityY(200);
				this.player.setFlipX(false);
			}
			else
			{
				this.player.setVelocityY(0);
			} 
	}
}