class test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    init() {

	}

	preload() {
		this.load.image('background','assetsProto/sky.png');
		this.load.image('perso','assetsProto/purple.png');
		this.load.image('ennemi','assetsProto/red.png');
		this.load.image('cursor','assetsProto/red.png');

		this.load.image('3vie', 'assetsProto/3vie.png');
		this.load.image('2vie', 'assetsProto/2vie.png');
		this.load.image('1vie', 'assetsProto/1vie.png');

		this.load.image('bullet','assetsProto/gray.png');

		this.load.image('money','assetsProto/gold.png');

		this.load.image('fluffy','assetsProto/fluffy.png');
	}

	create() {

	    this.physics.world.setBounds(0, 0, 1024*2.25, 768);

	    this.player = this.physics.add.sprite(100,510,'perso');

	    this.health = 6;

	    this.vie3 = this.add.image(80,30,'3vie').setScrollFactor(0);
		this.vie2 = this.add.image(80,30,'2vie').setScrollFactor(0);
		this.vie1 = this.add.image(80,30,'1vie').setScrollFactor(0);

		this.keys = this.input.keyboard.addKeys('Z,Q,S,D,R');
		this.cursors = this.input.keyboard.createCursorKeys();
		this.cursor = this.add.image(0, 0, 'cursor').setVisible(false).setScale(0.25);

		this.groupeBullets = this.physics.add.group();
		this.destroyEvent = this.time.addEvent({ delay: 2500, callback: destroyFarObject, callbackScope: this, loop: true });

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
			    		var bullet = this.groupeBullets.create(this.player.x, this.player.y, 'bullet').setScale(0.5);
			    		bullet.setVelocity(pointer.x, pointer.y); 
				        this.physics.moveToObject(bullet, pointer, 400);
				        this.ammo--;
				        this.ammoText.setText('' + this.ammo);
			    	}

			    	/*if (this.ammo == 0)
			    	{
			    		
			    	} */
		    	}
		    }, this);

		this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

		this.gizmos = this.physics.add.group();

		//IA
			//EnnemiA
			this.ennemiA = this.physics.add.group({
		        key: 'ennemi',
		        repeat: Phaser.Math.Between(1, 1),
		        setXY: { x: Phaser.Math.Between(0, 350), y: Phaser.Math.Between(0, 350),  stepX: 110 ,  stepY: 110 }	
		    });
		    
		    this.ennemiA.children.iterate(function (ennemiA) {
		        ennemiA.health = Phaser.Math.Between(2, 5);			        
		    });

			this.bulletEvent = this.time.addEvent({ delay: 2500, callback: shootPlayer, callbackScope: this, loop: true });
		    this.ennemiABullets = this.physics.add.group();
		    

		//Collectibles
		    this.nGold = 0;

		    this.nAmmo;
			this.ammo = 6;

			this.fluffyWhim = this.physics.add.group({
				key: 'fluffy',
			});

			this.fluffyCockail =  this.fluffyWhim.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'fluffy').setScale(0.5);
			this.bigFluffyCockail =  this.fluffyWhim.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'fluffy');

		/*Texte*/
			//Gold
		this.goldText = this.add.text(730, 100, ' ', { fontSize: '44px', fill: '#fff' }).setScrollFactor(0);
			//Balle dans le chargeur
		this.ammoText = this.add.text(730, 16, '6 ', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
			//Munitions 
		this.nAmmoText = this.add.text(730, 50, '∞', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);

		/*Ensemble des fonctions*/
			function hitEnnemi(bullet, ennemiA) 
			{
				ennemiA.health--;
				bullet.destroy(true);

				if (ennemiA.health == 0) 
				{
					ennemiA.destroy();

					this.cGold = this.physics.add.group({
				        key: 'money',
				        repeat: Phaser.Math.Between(1, 3),
				        setXY: { x: Phaser.Math.Between(ennemiA.x,ennemiA.x+50), y: Phaser.Math.Between(ennemiA.y,ennemiA.y+50)},
				        setScale: { x: 0.5, y: 0.5}
				    });

				    this.physics.add.overlap(this.player, this.cGold, collectGold, null,this);
				}
			}

			function hitPlayer(player, groupeBullets)
			{
				this.health--;
				console.log(this.health);
				groupeBullets.destroy(true);

			}

			function collectGold(player, money) 
			{
				money.destroy();
				this.nGold++;
				this.goldText.setText('' + this.nGold).setScale(0.5);
			}

			function shootPlayer(ennemiA)
			{
				if (this.ennemiA.countActive(true) != 0) 
				{
		       		var bullet = this.ennemiABullets.create(this.ennemiA.x, this.ennemiA.y, 'bullet').setScale(0.5);
		        	this.physics.moveToObject(bullet, this.player, 300);
				}
			}

			function destroyFarObject()
			{

			}

			function LuxuryCocktail()
			{
				this.fluffyCockail.destroy();
				console.log(this.health);
				this.health++;
			}

			function BigLuxuryCocktail()
			{
				this.bigFluffyCockail.destroy();
				console.log(this.health);
				this.health+=2;
			}

		//Colliders
			this.physics.add.overlap(this.bigFluffyCockail, this.player, BigLuxuryCocktail, null,this);
			this.physics.add.overlap(this.fluffyCockail, this.player, LuxuryCocktail, null,this);
			this.physics.add.overlap(this.ennemiABullets, this.player, hitPlayer, null,this);
			this.physics.add.overlap(this.groupeBullets, this.ennemiA, hitEnnemi, null,this);
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

		//Déplacemet des ennemis
		

		//Rechargement
			if(this.keys.R.isDown)
			{
				this.ammo = 6;
				this.ammoText.setText('' + this.ammo);
			}

		//PVs
			if(this.health == 4)
			{
				this.vie3.destroy(true);
			}
			if(this.health == 2)
			{
				this.vie2.destroy(true);
			}
			if(this.health == 0) 
			{
				this.vie1.destroy();
				
				this.physics.pause();
			    this.player.setTint(0xff0000);
			}

		//Destruction des balles

	}
}