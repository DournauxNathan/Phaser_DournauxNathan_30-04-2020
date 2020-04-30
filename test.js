class test extends Phaser.Scene {
    constructor() {
        super("test");
    }

    init() {

	}

	preload() {
		//Characters
			this.load.spritesheet('idleR','assets/Characters/idleR.png',{frameWidth: 77, frameHeight: 50});
			this.load.spritesheet('idleY','assets/Characters/idleY.png',{frameWidth: 26, frameHeight: 45});
			this.load.spritesheet('ennemiA','assets/Characters/ennemiA.png',{frameWidth: 60, frameHeight: 60});
			this.load.image('ennemiB','assets/Characters/ennemiB.png');
			this.load.image('perso','assetsProto/purple.png');

		//HUD - État
			this.load.image('cursor','assetsProto/red.png');

			this.load.image('6vie', 'assets/UI/Etat/6vie.png');
			this.load.image('5vie', 'assets/UI/Etat/5vie.png');
			this.load.image('4vie', 'assets/UI/Etat/4vie.png');
			this.load.image('3vie', 'assets/UI/Etat/3vie.png');
			this.load.image('2vie', 'assets/UI/Etat/2vie.png');
			this.load.image('1vie', 'assets/UI/Etat/1vie.png');
			this.load.image('0vie', 'assets/UI/Etat/0vie.png');

			this.load.image('uiKey', 'assets/UI/Etat/key2.png');
			this.load.image('money','assets/UI/Etat/UI_soul.png');

			this.load.image('hAmmo', 'assets/UI/Etat/hAmmo.png');
			this.load.image('mAmmo', 'assets/UI/Etat/mAmmo.png');
			this.load.image('lAmmo', 'assets/UI/Etat/lAmmo.png');

			this.load.image('6bullet', 'assets/UI/Etat/UI_bullet6.png');
			this.load.image('5bullet', 'assets/UI/Etat/UI_bullet5.png');
			this.load.image('4bullet', 'assets/UI/Etat/UI_bullet4.png');
			this.load.image('3bullet', 'assets/UI/Etat/UI_bullet3.png');
			this.load.image('2bullet', 'assets/UI/Etat/UI_bullet2.png');
			this.load.image('1bullet', 'assets/UI/Etat/UI_bullet1.png');

			this.load.image('corner', 'assets/UI/Etat/UI_object.png');
			this.load.image('uiObjUp','assets/UI/Etat/objet1.png');

		//HUD - Inventaire
		
		//Environnement
			this.load.image('background','assetsProto/sky.png');
			this.load.image('trigger','assetsProto/noir.png');
			this.load.image('chest','assets/Environnement/chest.png');
			this.load.image('box','assets/Environnement/noir.png');
			this.load.image('door','assets/Environnement/door.png');
			this.load.image('locker1','assets/Environnement/thorns.png');
			this.load.image('locker2','assets/Environnement/thorns2.png');

		//Items
			this.load.image('cKeys','assets/Items/key2.png');
			this.load.image('munition','assets/Items/ammo.png');
			this.load.image('objUp','assets/Items/objet1.png');
			this.load.image('vie','assets/Items/cVie.png');

		this.load.image('bullet','assetsProto/orange.png');

		//Plugin - Tableau [Inventaire]
			var url;
			url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexgridtableplugin.min.js';
			this.load.plugin('rexgridtableplugin', url, true);
	}

	create() {
		/*Variables 'publiques' - modifier leurs valeurs pour tester différents paramètres du jeu*/
			this.speed = 400; //Vitesse du joueur
			this.health = 6;  //Vie du joueur
			this.maxHealth = 6;  //Vie maximal du joueur
			this.shoot = 400;
			this.keys = this.input.keyboard.addKeys('Z,Q,S,D,R'); //Input de déplacent / intérargir / rechargement 
			this.useObject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); //Utilisation d'object
			this.openInventory = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I); //Inventaire
			this.isInventoryOpen = 0; // - booléen_inventaire: 0 = fermé / 1 = ouvert
			this.delayBullet = 3000;

		this.add.image(0,0,'background').setOrigin(0,0);

		//Caméra & Joueur
		    
		    this.physics.world.setBounds(0, 0, 6250, 3000);
	 	   	this.player = this.physics.add.sprite(5800,2500,'idleR');
	   		this.player.setCollideWorldBounds(true);
	   		this.groupeBullets = this.physics.add.group();
	   		this.cameras.main.setBounds(0, 0, 6250, 3000, this.player);
			this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

			this.nKill = 0;

	   	//Object - Environnmeet
		    this.chest = this.physics.add.sprite(1823,739, 'chest').setImmovable(true);
		    this.moveBox = this.physics.add.sprite(1760,690, 'box');
		    this.door = this.physics.add.sprite(5840, 1000	, 'door').setImmovable(true).setScale(1.5);
		    this.onTrigger = this.physics.add.image(5013,2146, 'trigger').setScale(2,3).setVisible(false);
 			this.lockers = this.physics.add.staticGroup();

	    //Ui - État
		    this.vie6 = this.add.image(40,40,'6vie').setScale(1.25).setScrollFactor(0);
		    this.vie5 = this.add.image(40,40,'5vie').setScale(1.25).setScrollFactor(0);
			this.vie4 = this.add.image(40,40,'4vie').setScale(1.25).setScrollFactor(0);
			this.vie3 = this.add.image(40,40,'3vie').setScale(1.25).setScrollFactor(0);
			this.vie2 = this.add.image(40,40,'2vie').setScale(1.25).setScrollFactor(0);
			this.vie1 = this.add.image(40,40,'1vie').setScale(1.25).setScrollFactor(0);
			this.vie0 = this.add.image(40,40,'0vie').setScale(1.25).setScrollFactor(0);

			this.add.image(105,100,'money').setScale(1.25).setScrollFactor(0);
			this.add.image(20,100,'uiKey').setScale(1.25).setScrollFactor(0);

			this.ammoA = this.add.image(710,30,'hAmmo').setScale(2).setScrollFactor(0);
			this.ammoB = this.add.image(710,30,'mAmmo').setScale(2).setScrollFactor(0);
			this.ammoC = this.add.image(710,30,'lAmmo').setScale(2).setScrollFactor(0);

			this.UI_bullet6 = this.add.image(740,70	,'6bullet').setScale(1.25).setScrollFactor(0);
		    this.UI_bullet5 = this.add.image(740,70	,'5bullet').setScale(1.25).setScrollFactor(0);
			this.UI_bullet4 = this.add.image(740,70	,'4bullet').setScale(1.25).setScrollFactor(0);
			this.UI_bullet3 = this.add.image(740,70	,'3bullet').setScale(1.25).setScrollFactor(0);
			this.UI_bullet2 = this.add.image(740,70	,'2bullet').setScale(1.25).setScrollFactor(0);
			this.UI_bullet1 = this.add.image(740,70	,'1bullet').setScale(1.25).setScrollFactor(0);

			this.corner = this.add.image(2,530,'corner').setOrigin(0,0).setScale(2).setScrollFactor(0);
			this.cornerObj = this.add.image(5,534,'uiObjUp').setOrigin(0,0).setScale(2).setScrollFactor(0).setVisible(false);
			
			this.cursor = this.add.image(0, 0, 'cursor').setVisible(false);
		
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

			this.ammo = 6;

			this.nAmmo = 100;
			this.cAmmo = this.physics.add.group({
		        key: 'munition',
		        setScale: {x: 1.5, y: 2.5},
		    });
		    this.cAmmo.create(200, 510, 'munition');

			this.cHealth = this.physics.add.group({
				key: 'vie',
			});
			this.cHealth1 =  this.cHealth.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'vie');
			this.cHealth2 =  this.cHealth.create(Phaser.Math.Between(0, 300), Phaser.Math.Between(0, 300), 'vie').setScale(2);

			this.nKeys = 0;
			this.cKeys = this.physics.add.group({
				key: 'cKeys',
				setXY: {x: 250, y:250}
			});

			this.isUsable = 0;
			this.objUpgrade = this.physics.add.sprite(5846,1405,'objUp');

		//IA
			//EnnemiA
				this.ennemiA = this.physics.add.group({
			        key: 'ennemiA',	
			    });
			    //Zone 9 
				this.depY1 = this.ennemiA.create(266,1966,'ennemiA');
			   	this.depY2 = this.ennemiA.create(373,2513,'ennemiA');
			   	this.depX1 = this.ennemiA.create(786,1753,'ennemiA');
			   	//Zone 8 
			   	this.depX2 = this.ennemiA.create(2000,2586,'ennemiA');
			   	this.depY3 = this.ennemiA.create(1886,2186,'ennemiA');
			   	this.depX3 = this.ennemiA.create(1466,2579,'ennemiA');
			   	this.depY4 = this.ennemiA.create(1566,2006,'ennemiA');
			   	//Zone 2
			   	this.depX5 = this.ennemiA.create(4686,1826,'ennemiA');
			   	this.depY5 = this.ennemiA.create(4113,2200,'ennemiA');
			   	//Zone4
			   	this.depX7 = this.ennemiA.create(3738,741,'ennemiA');
			   	this.depY7 = this.ennemiA.create(2784,495,'ennemiA');
			   	this.depX8 = this.ennemiA.create(3384,274,'ennemiA');
			   	this.depY8 = this.ennemiA.create(3831,1054,'ennemiA');
			   	this.depY9 = this.ennemiA.create(4451,521,'ennemiA');
			   	this.depX9 = this.ennemiA.create(4731,854,'ennemiA');
			   	//Zone 6
			   	this.depX6 = this.ennemiA.create(5841,219,'ennemiA');
			   	this.depY6 = this.ennemiA.create(6085,553,'ennemiA');


			   	this.anims.create({
					key:'burn',
					frames: this.anims.generateFrameNumbers('ennemiA', {rupeet: 0, end: 4}),
					frameRate: 3,
					repeat: -1
				});

		    this.ennemiA.children.iterate(function (ennemiA) {
		        ennemiA.health = Phaser.Math.Between(2, 5);			       
		    });

		    var tweenY = this.tweens.add({
		      	targets: [ this.depY1, this.depY2, this.depY3,this.depY4, this.depY5, this.depY6, this.depY7, this.depY8, this.depY9, this.depY10 ],
		        y: '+=200',
		        ease: 'Linear',
		        yoyo: true,
		        repeat: -1
		    });

		    var tweenX = this.tweens.add({
		      	targets: [ this.depX1, this.depX2, this.depX3,this.depX4, this.depX5, this.depX6, this.depX7, this.depX8, this.depX9, this.depX10 ],
		        x: '+=200',
		        ease: 'Linear',
		        yoyo: true,
		        repeat: -1
		    });

		   
		    //EnnemiB
				this.ennemiB = this.physics.add.group({
			        key: 'ennemiB',	
			    });
			    //Zone 9 
				this.ennemiB.create(511,2086,'ennemiB');
			   	//Zone 6
			   	this.ennemiB.create(5810,400,'ennemiB');
 
		    this.ennemiB.children.iterate(function (ennemiB) {
		        ennemiB.health = Phaser.Math.Between(10, 15);			        
		    });

		/*Texte*/
			//Clef
				this.keyText = this.add.text(50, 85, ' ', { fontSize: '35px', fill: '#fff' }).setScrollFactor(0);
				this.keyText.setText('' + this.nKeys);
			//Monnaie
				this.soulText = this.add.text(130, 85, ' ', { fontSize: '35px', fill: '#fff' }).setScrollFactor(0);
				this.soulText.setText('' + this.nSoul);

		//Ensembles de Colliders & Overlaps
			//Collider
				this.physics.add.collider(this.chest, this.player, openChest, null,this);
				this.physics.add.collider(this.door, this.player, openDoor, null,this);
				this.physics.add.collider(this.lockers, this.player);
				this.physics.add.collider(this.chest, this.moveBox);
				this.physics.add.collider(this.moveBox, this.player, pushBox, null,this);
			//Overlap
				this.physics.add.overlap(this.onTrigger, this.player, lockRoom, null,this);
				this.physics.add.overlap(this.cKeys, this.player, collectKeys, null,this);
				this.physics.add.overlap(this.objUpgrade, this.player, collectUpgrade, null,this);
				this.physics.add.overlap(this.cHealth2, this.player, collectHealth2, null,this);
				this.physics.add.overlap(this.cHealth1, this.player, collectHealth1, null,this);
				this.physics.add.overlap(this.ennemiA, this.player, hitPlayer, null,this);
				this.physics.add.overlap(this.ennemiB, this.player, hitPlayer, null,this);
				this.physics.add.overlap(this.groupeBullets, this.ennemiA, hitEnnemi, null,this);
				this.physics.add.overlap(this.groupeBullets, this.ennemiB, hitEnnemiB, null,this);
				this.physics.add.overlap(this.player, this.cSoul, collectSoul, null,this);
				this.physics.add.overlap(this.player, this.cAmmo, collectAmmo, null,this);
 
		/*Ensemble des fonctions*/
			//System de tir - Joueur
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
					    		bullet.setVelocity(pointer.worldX,pointer.worldY); 
						        this.physics.moveTo(bullet, pointer.worldX, pointer.worldY, this.shoot);
						        this.ammo--;
					    	}
			    		}


			    	}
			    }, this);

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

			//Collision entre une balle et un ennemi - A
				function hitEnnemi(bullet, ennemiA) 
				{
					ennemiA.health--;
					bullet.destroy(true);
					
					if (ennemiA.health == 0) 
					{
						ennemiA.destroy();
						this.nKill++;
						var spawnCollect = Phaser.Math.Between(0, 30);

						if(this.nAmmo <= 35)
						{
							this.cAmmo = this.physics.add.group({
						        key: 'munition',
						        repeat: Phaser.Math.Between(1, 3),
						        setScale: {x: 1.5, y: 2.5},
						        setXY: { x: Phaser.Math.Between(ennemiA.x,ennemiA.x+50), y: Phaser.Math.Between(ennemiA.y,ennemiA.y+50)},
						    });

						   
							this.physics.add.overlap(this.player, this.cAmmo, collectAmmo, null,this);
						}
						else if(spawnCollect <= 15 || spawnCollect >= 18)
						{
							this.cSoul = this.physics.add.group({
						        key: 'money',
						        repeat: Phaser.Math.Between(1, 3),
						        setXY: { x: Phaser.Math.Between(ennemiA.x,ennemiA.x+50), y: Phaser.Math.Between(ennemiA.y,ennemiA.y+50)},
						    });

						    this.physics.add.overlap(this.player, this.cSoul, collectSoul, null,this);
						}

						//Suppression des lockers fonction du nombre d'ennemis tués
							if (this.nKill >= 2)
							{
								this.L1.destroy(true);
								this.L2.destroy(true);
								this.L3.destroy(true);
							}
							if (this.nKill >= 5)
							{
								this.L4.destroy(true);
								this.L5.destroy(true);
							}
							if (this.nKill >= 10)
							{
								this.L9.destroy(true);
							}
							if (this.nKill >= 14)
							{
								this.L10.destroy(true);
							}
							if (this.nKill >= 17)
							{
								this.L6.destroy(true);
								this.L7.destroy(true);
								this.L8.destroy(true);
							}
					}
				}
			
			//Collision entre une balle et un ennemi - B
				function hitEnnemiB(bullet, ennemiB) 
				{
					ennemiB.health--;
					bullet.destroy(true);
					

					if (ennemiB.health == 0) 
					{
						ennemiB.destroy();
						
						var cHealth2 = this.cHealth.create(Phaser.Math.Between(ennemiB.x,ennemiB.x+50), Phaser.Math.Between(ennemiB.y,ennemiB.y+50), 'vie').setScale(2);
					
						var key =  this.cKeys.create(Phaser.Math.Between(ennemiB.x,ennemiB.x+50), Phaser.Math.Between(ennemiB.y,ennemiB.y+50)	, 'cKeys');
					}
				}
			
			//Collision entre le joueur et une balle
				function hitPlayer()
				{
					this.health--;
				}

			//Collision entre le joueur et un collectible - argent
				function collectSoul(player, money) 
				{
					money.destroy();
					this.nSoul++;
					this.soulText.setText('' + this.nSoul);
				}

			//Collision entre le joueur et un collectible - munitions
				function collectAmmo(player, munition) 
				{
					munition.destroy();
					this.nAmmo += 30;

					if (this.nAmmo >= 0) { this.ammoC.setVisible(true); }

					if (this.nAmmo >= 50) { this.ammoB.setVisible(true); }

					if (this.nAmmo >= 75) { this.ammoA.setVisible(true); }

				}

			//Collision entre le joueur et un collectible - vie
				function collectHealth1()
				{
					if (this.health < this.maxHealth)
					{
						this.cHealth1.destroy();
						this.health++;

						if (this.health == 4) { this.vie4.setVisible(true); }

						if (this.health == 3) { this.vie3.setVisible(true); }

						if (this.health == 5) { this.vie5.setVisible(true); }

						if (this.health == this.maxHealth) { this.vie6.setVisible(true);}
					}
				}

				function collectHealth2()
				{
					if (this.health < this.maxHealth)
					{
						this.cHealth1.destroy();
						this.health+=2;

						if (this.health == 4 || this.health == 3) {
							this.vie4.setVisible(true);
						}

						if (this.health == this.maxHealth || this.health == 5) {
							this.vie6.setVisible(true);
						}
					}
				}

			//Collision entre le joueur et un collectible - Amélioration
				function collectUpgrade()
				{
					this.isUsable = 1;
					this.objUpgrade.destroy();
					this.cornerObj.setVisible(true);
				}

			//Collision entre le joueur et un collectible - clef
				function collectKeys(player, cKeys)
				{
					cKeys.disableBody(true,true);
					this.nKeys++;
					this.keyText.setText('' + this.nKeys);

				}

			//Collision entre le joueur et un objet - coffre - condition avoir au moins une clef
				function openChest()
				{
					if (this.nKeys > 0) 
					{
						this.chest.setTint(0x00ff00);
						this.nKeys--;
						this.keyText.setText('' + this.nKeys);
					}
				}

			//Collision entre le joueur et un objet - porte - condition avoir au moins une clef
				function openDoor()
				{
					if (this.nKeys > 0) 
					{
						this.door.destroy();
						this.nKeys--;
						this.keyText.setText('' + this.nKeys);
					}
				}

			//Collision entre le joueur et un objet - boite
				function pushBox(player, moveBox)
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
					this.onTrigger.destroy();
					this.L1 = this.lockers.create(4520, 1600, 'locker1');
					this.L2 = this.lockers.create(4566, 1360, 'locker1');
  					this.L3 = this.lockers.create(3980, 1906, 'locker2');
					this.L4 = this.lockers.create(5000, 620, 'locker2');
					this.L5 = this.lockers.create(5333, 420, 'locker2');
					this.L6 = this.lockers.create(3180, 1300, 'locker1');
					this.L7 = this.lockers.create(3190, 940, 'locker1');
					this.L8 = this.lockers.create(2520, 330, 'locker2');
					this.L9 = this.lockers.create(2079, 310, 'locker2');
					this.L10 = this.lockers.create(950, 2150, 'locker2');
				}
	}

	update() {
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
					//this.player.anims.play('idleR', true);	
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

		//Rechargement
			if(this.keys.R.isDown)
			{
				this.nAmmo-= 6 - this.ammo;
				this.ammo = 6;

				this.UI_bullet6.setVisible(true);
				this.UI_bullet5.setVisible(true);
				this.UI_bullet4.setVisible(true);
				this.UI_bullet3.setVisible(true);
				this.UI_bullet2.setVisible(true);
				this.UI_bullet1.setVisible(true);
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
				this.shoot = 800;
				//this.isUsable = 0;
			}
			/*else if (this.isUsable == 0 && Phaser.Input.Keyboard.JustDown(this.useObject))
			{
                
			}*/

		//Nombre de PVs
			if(this.health == 5)
			{
				this.vie6.setVisible(false);
			}
			if(this.health == 4)
			{
				this.vie5.setVisible(false);
			}
			if(this.health == 3)
			{
				this.vie4.setVisible(false);
			}
			if(this.health == 2)
			{
				this.vie3.setVisible(false);
			}
			if(this.health == 1) 
			{
				this.vie2.setVisible(false);
			}
			if(this.health == 0)
			{
				this.vie1.setVisible(false);				
				this.physics.pause();
			    this.player.setTint(0xff0000);
			}

		//Nombre de munitions	
			if(this.nAmmo <= 75)
			{
				this.ammoA.setVisible(false);
			}
			if(this.nAmmo <= 50)
			{
				this.ammoB.setVisible(false);
			}
			if(this.nAmmo <= 0)
			{
				this.ammoC.setVisible(false);
			}

		//Nombre de balles
			if(this.ammo == 5)
			{
				this.UI_bullet6.setVisible(false);
			}
			if(this.ammo == 4)
			{
				this.UI_bullet5.setVisible(false);
			}
			if(this.ammo == 3)
			{
				this.UI_bullet4.setVisible(false);
			}
			if(this.ammo == 2)
			{
				this.UI_bullet3.setVisible(false);
			}
			if(this.ammo == 1) 
			{
				this.UI_bullet2.setVisible(false);
			}
			if(this.ammo == 0)
			{
				this.UI_bullet1.setVisible(false);
			}		
	}
}