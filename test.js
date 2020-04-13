class test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    init() {

	}

	preload() {
		this.load.image('background','assetsProto/sky.png');
		this.load.image('perso','assetsProto/purple.png');
		this.load.image('cursor','assetsProto/red.png');
	}

	create() {
		/*Creation des projectiles*/
		 	this.Bullet = new Phaser.Class({

		        Extends: Phaser.GameObjects.Image,

		        initialize:

		        function Bullet (scene)
		        {
		            Phaser.GameObjects.Image.call(this, scene, -100, 0, 'bullet');

		            this.speed = Phaser.Math.GetSpeed(600, 1);
		        },

		        fire: function (x, y)
		        {
		            this.setPosition(x, y);

		            this.setActive(true);
		            this.setVisible(true);
		        },

		        update: function (time, delta)
		        {
		            this.x += this.speed * delta;

		            if (this.x > 820)
		            {
		                this.setActive(false);
		                this.setVisible(false);
		            }
		        } 
	    	});

	this.bullets = this.physics.add.group({
        classType: this.Bullet,
        maxSize: 30,
        runChildUpdate: true
	});

		this.add.image(0,0,'background').setOrigin(0,0);

	    this.physics.world.setBounds(0, 0, 1024*2.25, 768);

	    this.player = this.physics.add.sprite(100,510,'perso');

	    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

		this.keys = this.input.keyboard.addKeys('Z,Q,S,D');

		this.cursor = this.add.image(this.player.x, this.player.y, 'cursor').setVisible(false).setScale(0.5);

		this.groupeBullets = this.physics.add.group();

		this.input.on('pointermove', function (pointer)
	    {
	        this.cursor.setVisible(true).setPosition(pointer.x, pointer.y);

	        Phaser.Utils.Array.Each(
	            blocks.getChildren(),
	            this.physics.moveToObject,
	            this.physics,
	            pointer, 120);
	    }, this);

	    this.input.on('pointerdown', function (pointer)
	    {
	    	var bullet = this.groupeBullets.create(this.player.x, this.player.y, 'bullet');

	        this.physics.moveToObject(bullet, pointer, 300);

	        
	    }, this);

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

		//Tir
	
	}
}