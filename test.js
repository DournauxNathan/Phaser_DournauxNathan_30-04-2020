class test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    init() {

	}

	preload() {
		//Spritesheets
			this.load.spritesheet('idleR','assets/idleR.png',{frameWidth: 77, frameHeight: 50});
			this.load.spritesheet('idleY','assets/idleY.png',{frameWidth: 26, frameHeight: 45});


		this.load.image('background','assetsProto/sky.png');
		this.load.image('perso','assetsProto/purple.png');
		this.load.image('ennemi','assetsProto/red.png');
		this.load.image('cursor','assetsProto/red.png');

		this.load.image('3vie', 'assetsProto/3vie.png');
		this.load.image('2vie', 'assetsProto/2vie.png');
		this.load.image('1vie', 'assetsProto/1vie.png');

		this.load.image('munition','assetsProto/ammo.png');
		this.load.image('bullet','assets/bullet.png');

		this.load.image('littleKey','assetsProto/gray.png');
		this.load.image('money','assetsProto/gold.png');
		this.load.image('chest','assetsProto/white.png');
		this.load.image('box','assetsProto/noir.png');
		this.load.image('door','assetsProto/noir.png');
		this.load.image('locker','assetsProto/platform.png');
		this.load.image('objUp','assetsProto/bleu.png');

		this.load.image('fluffy','assetsProto/item.png');

		this.load.image('trigger','assetsProto/noir.png');

		this.load.image('grid','assetsProto/grid.png');
		this.load.image('inv','assetsProto/inv.png');

		//Plugin - Tableau
		var url;
		url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js';
		this.load.plugin('rexgridtableplugin', url, true);
	}

	create() {
		//this.inv = this.physics.add.image(400,300,'inv').setScrollFactor(0);
		/*Variables 'publiques' - modifier leurs valeurs pour tester différents paramètres du jeu*/
			this.speed = 400; //Vitesse du joueur
			this.health = 6;  //Vie du joueur
			this.maxHealth = 6;  //Vie maximal du joueur
			this.keys = this.input.keyboard.addKeys('Z,Q,S,D,R'); //Input de déplacent / intérargir / rechargement 
			this.useObject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); //Utilisation d'object
			this.openInventory = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Inventaire
			this.isInventoryOpen = 0; // - booléen_inventaire: 0 = fermé / 1 = ouvert
			this.delayBullet = 3000;

	    
	    this.player = this.physics.add.sprite(100,510,'idleR');
	    this.chest = this.physics.add.sprite(50,510, 'chest').setImmovable(true);
	    this.moveBox = this.physics.add.sprite(-100,510, 'box');
	    this.door = this.physics.add.sprite(-100, 0, 'door').setImmovable(true);

	    this.onTrigger = this.physics.add.image(600,500, 'trigger');

	    this.vie3 = this.add.image(80,30,'3vie').setScrollFactor(0);
		this.vie2 = this.add.image(80,30,'2vie').setScrollFactor(0);
		this.vie1 = this.add.image(80,30,'1vie').setScrollFactor(0);

		this.lockers = this.physics.add.staticGroup();
		
		this.cursor = this.add.image(0, 0, 'cursor').setVisible(false);

		this.groupeBullets = this.physics.add.group();
		//this.destroyEvent = this.time.addEvent({ delay: 2500, callback: destroyBullet, callbackScope: this, loop: true });
			
		//Animations
			//Joueur
				this.anims.create({
					key:'idleR',
					frames: this.anims.generateFrameNumbers('idleR', {rupeet: 0, end: 1}),
					frameRate: 3,
					repeat: -1
				});

				this.anims.create({
					key:'idleY',
					frames: this.anims.generateFrameNumbers('idleY', {rupeet: 0, end: 1}),
					frameRate: 3,
					repeat: -1
				});

		//Collectibles
		    this.nSoul = 0;

		    this.nAmmo = 100;
			this.ammo = 6;

			this.fluffyWhim = this.physics.add.group({
				key: 'fluffy',
			});

			this.littleKey = this.physics.add.group({
				key: 'littleKey',
				setXY: {x: 250, y:250}
			});

			this.nlittleKey = 0;

			this.fluffyCockail =  this.fluffyWhim.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'fluffy');
			this.bigFluffyCockail =  this.fluffyWhim.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'fluffy');

			this.objUpgrade = this.physics.add.sprite(200,510,'objUp');
			this.isUsable = 0;

		//Tir
			this.input.on('pointermove', function (pointer)
		    {
		    	this.cursor.setVisible(true).setPosition(pointer.x, pointer.y).setScrollFactor(0);
		    }, this);

		    this.input.on('pointerdown', function (pointer)  
		    {	
		    	if (pointer.leftButtonDown()) 
		    	{

		    		if (this.nAmmo > 0) 
		    		{
		    			if (this.ammo > 0) 
				    	{
				    		var bullet = this.groupeBullets.create(this.player.x, this.player.y, 'bullet');
				    		bullet.setVelocity(pointer.x, pointer.y); 
					        this.physics.moveToObject(bullet, pointer, 400);
					        this.ammo--;
					        this.ammoText.setText('' + this.ammo);
				    	}

				    	/*if (this.ammo == 0)
				    	{
				    		
				    	} */
		    		}
		    		
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

			this.createBullet = this.time.addEvent({ delay: this.delayBullet, callback: shootPlayer, callbackScope: this, loop: true });
		    this.ennemiABullets = this.physics.add.group();
		   
		/*Texte*/
			//Gold
		this.soulText = this.add.text(730, 100, ' ', { fontSize: '44px', fill: '#fff' }).setScrollFactor(0);
			//Balle dans le chargeur
		this.ammoText = this.add.text(730, 16, '6 ', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
			//Munitions 
		this.nAmmoText = this.add.text(730, 50, '', { fontSize: '32px', fill: '#fff' }).setScrollFactor(0);
		this.nAmmoText.setText('' + this.nAmmo);

		 
 
		/*Ensemble des fonctions*/
			//Inventaire
				function Inventory(scene, cell) 
				{
				    var bg = scene.add.graphics(0, 0).fillStyle(0x555555).fillRect(2, 2, 58, 58);
					var txt = scene.add.text(40, 45, cell.index);
					var container = scene.add.container(0, 0, [bg,txt]);
					return container;
				}

			    function onCellVisible(cell) 
			    {
					cell.setContainer(Inventory(this, cell));
			    }

		    	this.table = this.add.rexGridTable(400, 300, 420, 180, {
					cellHeight: 60,
					cellWidth: 60,
					cellsCount: 21,
					columns: 7,
					cellVisibleCallback: onCellVisible.bind(this),
				});

				// draw bound
			    this.gridBound = this.add.graphics().lineStyle(3, 0xff0000).strokeRectShape(this.table.getBounds()).setScrollFactor(0).setVisible(false);

			    this.table.setVisible(false).setScrollFactor(0).setInteractive();	

			//Collision entre une balle et un ennemi
				function hitEnnemi(bullet, ennemiA) 
				{
					ennemiA.health--;
					bullet.destroy(true);
					

					if (ennemiA.health == 0) 
					{
						ennemiA.destroy();
						var spawnCollect = Phaser.Math.Between(0, 30);

						if(spawnCollect <= 15 || spawnCollect > 18)
						{
							this.cSoul = this.physics.add.group({
						        key: 'money',
						        repeat: Phaser.Math.Between(1, 3),
						        setXY: { x: Phaser.Math.Between(ennemiA.x,ennemiA.x+50), y: Phaser.Math.Between(ennemiA.y,ennemiA.y+50)},
						    });

						    this.physics.add.overlap(this.player, this.cSoul, collectSoul, null,this);
						}

						if(spawnCollect > 15 && spawnCollect < 18)
						{
							this.cAmmo = this.physics.add.group({
						        key: 'munition',
						        repeat: Phaser.Math.Between(1, 3),
						        setXY: { x: Phaser.Math.Between(ennemiA.x,ennemiA.x+50), y: Phaser.Math.Between(ennemiA.y,ennemiA.y+50)},
						    });

						    this.physics.add.overlap(this.player, this.cSoul, collectSoul, null,this);
						}
					}
				}

			//Collision entre le joueur et une balle
				function hitPlayer(player, groupeBullets)
				{
					this.health--;
					console.log(this.health);
					groupeBullets.destroy(true);
				}

			//Collision entre le joueur et un collectible - argent
				function collectSoul(player, money) 
				{
					money.destroy();
					this.nSoul++;
					this.soulText.setText('' + this.nSoul);
				}


				function shootPlayer(ennemiA)
				{
					if (this.ennemiA.countActive(true) != 0) 
					{
			       		this.bullet = this.ennemiABullets.create(this.ennemiA.x, this.ennemiA.y, 'bullet');
			        	this.physics.moveToObject(this.bullet, this.player, 300);
					}
				}

			//Collision entre le joueur et un collectible - vie
				function LuxuryCocktail()
				{
					if (this.health < this.maxHealth)
					{
						this.fluffyCockail.destroy();
						this.health++;

						if (this.health == 4 || this.health == 3) {
							this.vie2.setVisible(true);
						}

						if (this.health == this.maxHealth || this.health == 5) {
							this.vie3.setVisible(true);
						}
					}
				}

				function BigLuxuryCocktail()
				{
					if (this.health < this.maxHealth)
					{
						this.bigFluffyCockail.destroy();
						this.health+=2;

						if (this.health == 4 || this.health == 3) {
							this.vie2.setVisible(true);
						}

						if (this.health == this.maxHealth || this.health == 5) {
							this.vie3.setVisible(true);
						}
					}
				}

			//Collision entre le joueur et un collectible - Amélioration
				function collectUpgrade()
				{
					this.isUsable = 1;
					this.objUpgrade.destroy();
					console.log("Vous avez ramasser un objet");
					
				}

			//Collision entre le joueur et un collectible - clef
				function collectKeys(player, littleKey)
				{
					littleKey.disableBody(true,true);
					this.nlittleKey++;

				}

			//Collision entre le joueur et un objet - coffre
				function openChest()
				{
					if (this.nlittleKey > 0) 
					{
						this.chest.setTint(0x00ff00);
						console.log("coffre ouvert");
					}
				}

			//Ouverture d'un coffre - condition avoir au moins une clef
				function openChest()
				{
					if (this.nlittleKey > 0) 
					{
						this.chest.setTint(0x00ff00);
						console.log("coffre ouvert");
					}
				}

			//Collision entre le joueur et un objet - door
				function openDoor()
				{
					if (this.nlittleKey > 0) 
					{
						this.door.destroy();
						console.log("Porte ouverte");
					}
				}

			//Collision entre le joueur et un objet - boite
				function pushBox()
				{
					//En X
						if (this.moveBox.body.touching.right) 
						{
							this.moveBox.setVelocityX(-0.5);
						}
						else if (this.moveBox.body.touching.right) 
						{
							this.moveBox.setVelocityX(0.5);
						}
						else
						{
							this.moveBox.setVelocityX(0);
						}

					//En Y
						if (this.moveBox.body.touching.up) 
						{
							this.moveBox.setVelocityY(-0.5);
						}
						else if (this.moveBox.body.touching.down) 
						{
							this.moveBox.setVelocityY(0.5);
						}
						else
						{
							this.moveBox.setVelocityY(0);
						}
				}

			//Zone de trigger - des que le joueur entre dans une salle tout acces se ferme
				function lockRoom()
				{	
					if (this.ennemiA.countActive(true) != 0) 
					{
						this.lockers.create(600, 200, 'locker');
						this.lockers.create(600, 800, 'locker');
						this.lockers.create(300, 500, 'locker');
						this.lockers.create(900, 500, 'locker');
					}
				}

		//Ensembles de Colliders & Overlaps
			//Collider
				this.physics.add.collider(this.chest, this.player, openChest, null,this);
				this.physics.add.collider(this.door, this.player, openDoor, null,this);
				this.physics.add.collider(this.lockers, this.player);
				this.physics.add.collider(this.moveBox, this.player, pushBox, null,this);
			//Overlap
				this.physics.add.overlap(this.onTrigger, this.player, lockRoom, null,this);
				this.physics.add.overlap(this.littleKey, this.player, collectKeys, null,this);
				this.physics.add.overlap(this.objUpgrade, this.player, collectUpgrade, null,this);
				this.physics.add.overlap(this.bigFluffyCockail, this.player, BigLuxuryCocktail, null,this);
				this.physics.add.overlap(this.fluffyCockail, this.player, LuxuryCocktail, null,this);
				this.physics.add.overlap(this.ennemiABullets, this.player, hitPlayer, null,this);
				this.physics.add.overlap(this.groupeBullets, this.ennemiA, hitEnnemi, null,this);
	}

	update() {
		//Console.logs
			//console.log(this.isInventoryOpen);

		//Déplacement
			if (this.keys.Q.isDown)
			{
				this.player.setVelocityX(-this.speed);
				this.player.setFlipX(true);
			}
			else if (this.keys.D.isDown)
			{
				this.player.setVelocityX(this.speed);
				this.player.setFlipX(false);
			}
			else 
			{
				this.player.setVelocityX(0);

				if (this.player.setVelocityX(0)) 
				{
					//	this.player.anims.play('idleR', true);	
				}
				
			}

			if (this.keys.Z.isDown)
			{
				this.player.setVelocityY(-this.speed);
				//this.player.anims.play('idleY', true);
			}
			else if (this.keys.S.isDown)
			{
				this.player.setVelocityY(this.speed);
			}
			else
			{
				this.player.setVelocityY(0);

				
			}

		//Déplacemet des ennemis
	
		//Rechargement
			if(this.keys.R.isDown)
			{
				this.nAmmo-= 6 - this.ammo;
				this.nAmmoText.setText('' + this.nAmmo);
				this.ammo = 6;
				this.ammoText.setText('' + this.ammo);
			}

		//Inventaire
			if(this.isInventoryOpen == 0 && Phaser.Input.Keyboard.JustDown(this.openInventory))
			{
				this.physics.pause();
				this.table.setVisible(true);
				this.gridBound.setVisible(true);
				this.isInventoryOpen = 1;
			}

			if (this.isInventoryOpen == 1 && Phaser.Input.Keyboard.JustDown(this.openInventory)) 
			{
				this.physics.resume() 
				this.table.setVisible(false);
				this.gridBound.setVisible(false);
				this.isInventoryOpen = 0;
			}

		//Capacités
			if (this.isUsable == 1 && Phaser.Input.Keyboard.JustDown(this.useObject))
			{
				console.log("Vous utilisé un objet");
				this.ennemiABullets.setVelocity(1000);
				//this.time.events.add(Phaser.Timer.SECOND * 4, this.ennemiABullets.setVelocity(300), this);
				this.isUsable = 0;
			}
			else if (this.isUsable == 0 && Phaser.Input.Keyboard.JustDown(this.useObject))
			{
				console.log("Vous n'avez aucun objet");
			}

		//PVs
			if(this.health == 4)
			{
				this.vie3.setVisible(false);
			}
			if(this.health == 2)
			{
				this.vie2.setVisible(false);
			}
			if(this.health == 0) 
			{
				this.vie1.setVisible(false);
				
				this.physics.pause();
			    this.player.setTint(0xff0000);
			}

		//Destruction des balles

		if (this.ennemiA.countActive(true) === 0)
		{
			this.lockers.destroy(true);
		}





	}
}