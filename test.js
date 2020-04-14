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

		this.load.image('3vie', 'assetsProto/3vie.png');
		this.load.image('2vie', 'assetsProto/2vie.png');
		this.load.image('1vie', 'assetsProto/1vie.png');
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

	    this.health = 6;

	    this.vie3 = this.add.image(60,30,'3vie').setScrollFactor(0);
		this.vie2 = this.add.image(60,30,'2vie').setScrollFactor(0);
		this.vie1 = this.add.image(60,30,'1vie').setScrollFactor(0);

		this.keys = this.input.keyboard.addKeys('Z,Q,S,D,R');
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursor = this.add.image(0, 0, 'cursor').setVisible(false).setScale(0.25);

		this.groupeBullets = this.physics.add.group();

		this.nAmmo;
		this.ammo = 6;

		/*Texte*/
			//Balle dans le chargeur
		this.ammoText = this.add.text(730, 16, '6 ', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
			//Munitions 
		this.nAmmoText = this.add.text(730, 50, '∞', { fontSize: '32px', fill: '#000' }).setScrollFactor(0);

		//Tir
			this.input.on('pointermove', function (pointer)
		    {
		    	this.cursor.setVisible(true).setPosition(pointer.x, pointer.y).setScrollFactor(0);
		    }, this);

		    this.input.on('pointerdown', function (pointer)  
		    {	
		    	if (pointer.leftButtonDown()) 
		    	{
		    		if (this.ammo > 0) 
			    	{
			    		var bullet = this.groupeBullets.create(this.player.x, this.player.y, 'bullet');
			    		 this.cameras.main.shake(0.01, 100);
				        this.physics.moveToObject(bullet, pointer, 400);
				        this.ammo--;
				        this.ammoText.setText('' + this.ammo);
			    	}

			    	if (this.ammo == 0)
			    	{
			    		console.log("Click click");
			    	} 
		    	}
		    }, this);

		this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
	}

	update() {
		//Déplacement
			if (this.keys.Q.isDown)
			{
				this.player.setVelocityX(-400);
				this.player.setFlipX(true);
			}
			else if (this.keys.D.isDown)
			{
				this.player.setVelocityX(400);
				this.player.setFlipX(false);
			}
			else
			{
				this.player.setVelocityX(0);
			}

			if (this.keys.Z.isDown)
			{
				this.player.setVelocityY(-400);
				this.player.setFlipX(true);
			}
			else if (this.keys.S.isDown)
			{
				this.player.setVelocityY(400);
				this.player.setFlipX(false);
			}
			else
			{
				this.player.setVelocityY(0);
			}

			



		//Rechargement
			if(this.keys.R.isDown)
			{
				this.ammo = 6;
				this.ammoText.setText('' + this.ammo);
			}

		//PVs
			if(this.nVies == 4)
			{
				this.vie3.destroy(true);
			}
			if(this.nVies == 2)
			{
				this.vie2.destroy(true);
			}
			if(this.nVies == 0) 
			{
				this.vie1.destroy();
				
				this.physics.pause();
			    this.player.setTint(0xff0000);
			}

	}
}