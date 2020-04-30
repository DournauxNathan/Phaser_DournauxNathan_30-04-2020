class tuto extends Phaser.Scene {
    constructor() {
        super("Tuto");
    }

   /* 
    Documentation cf 'test.js'[Proposition d'une synthaxe et nomenclature]
	    
	    Déclaraction de collectibles
		this.cVariable;
		le 'c' permet d'indiquer un collectible
		
		Déclarer un compteur
		this.nVariable;
		le 'n' permet d'indique un compteur (dans la cas dans score par exemple)

		Déclarer des 'faux' booléen
		this.isNomVariable
		grâce au 'is' au identifie un état - Ma variable EST...

		Différencier des variables identique par des lettres ou des chiffres
		this.maVariableA ou this.maVariable1
		this.maVariableA ou this.maVariable1
		...
	*/

	preload() {
		//Characters
			this.load.image('idleR','assets/Characters/playerRight.png');
			this.load.image('idleY','assets/Characters/playerUp.png');
			this.load.spritesheet('ennemiA','assets/Characters/ennemiA.png',{frameWidth: 60, frameHeight: 60});
			this.load.image('ennemiB','assets/Characters/ennemiB.png');

		//HUD - État
			this.load.image('cursor','assets/UI/Etat/red.png');

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
			this.load.image('background','assets/Environnement/_env001.png');
			this.load.image('background2','assets/Environnement/_bones.png');
			this.load.image('background3','assets/Environnement/_thorns.png');
			this.load.image('trigger','assets/Environnement/noir.png');
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

		//Caméra & Joueur
		    this.physics.world.setBounds(0, 0, 2500, 600);
	 	   	this.player = this.physics.add.sprite(100,510,'idleR');
	   		this.player.setCollideWorldBounds(true);
	   		this.groupeBullets = this.physics.add.group();
	   		this.cameras.main.setBounds(0, 0, 2500 , 600, this.player);
			this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

			this.nKill = 0;

		//Animations
				this.anims.create({
					key:'idleR',
					frameRate: 3,
					repeat: -1
				});

				this.anims.create({
					key:'idleY',
					frameRate: 3,
					repeat: -1
				});

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

		//Environnement
			this.door = this.physics.add.sprite(2200, 410, 'door').setImmovable(true).setScale(1.5);
		
		//Collectibles
		    this.nSoul = 0;

			this.ammo = 6;

			this.nAmmo = 100;
			this.nKeys = 0;

			this.isUsable = 0;
			this.objUpgrade = this.physics.add.sprite(1625,300,'objUp');

		//EnnemiA
			this.ennemiA = this.physics.add.group({
		        key: 'ennemiA',	
		    });
			this.ennemi = this.ennemiA.create(950,100,'ennemiA');

			this.ennemiA.children.iterate(function (ennemiA) {
		        ennemiA.health = 6;			       
		    });

		    this.anims.create({
				key:'burn',
				frames: this.anims.generateFrameNumbers('ennemiA', {rupeet: 0, end: 3}),
				frameRate: 3,
				repeat: -1
			});

		/*Texte*/
			//Clef
				this.keyText = this.add.text(50, 85, ' ', { fontSize: '35px', fill: '#fff' }).setScrollFactor(0);
				this.keyText.setText('' + this.nKeys);
			//Monnaie
				this.soulText = this.add.text(130, 85, ' ', { fontSize: '35px', fill: '#fff' }).setScrollFactor(0);
				this.soulText.setText('' + this.nSoul);

		//Collision
			//Collider
				this.physics.add.collider(this.door, this.player, openDoor, null,this);
			//Overlap
				this.physics.add.overlap(this.groupeBullets, this.ennemiA, hitEnnemi, null,this);
				this.physics.add.overlap(this.objUpgrade, this.player, collectUpgrade, null,this);
		
		//System de tir - Joueur
				this.input.on('pointermove', function (pointer)
			    {
			    	this.cursor.setVisible(true).setPosition(pointer.x, pointer.y).setScrollFactor(0).setScale(0.25);
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
		    
		//Collision entre le joueur et un objet - porte - condition avoir au moins une clef
			function openDoor()
			{
				this.scene.start('test');
			}

		//Collision entre une balle et un ennemi - A
			function hitEnnemi(bullet, ennemiA) 
			{
				ennemiA.health--;
				bullet.destroy(true);
				
				if (ennemiA.health == 0) 
				{
					ennemiA.destroy();
					this.nKill++;
				}
			}

			//Collision entre le joueur et un collectible - Amélioration
			function collectUpgrade()
			{
				this.isUsable = 1;
				this.objUpgrade.destroy();
				this.cornerObj.setVisible(true);
			}

		this.arrow = this.add.text(100,200,'->', { fontSize: '35px', fill: '#fff' });
		this.moveText = this.add.text(100, 430,'Appuyer sur Z,Q,S,D\n pour te déplacer');
		this.runText = this.add.text(650, 430,'                  Attention voilà un démon !\nVisée avec la souris et appuyer sur Clic- Gauche pour tirer').setVisible(false);
		this.fireText = this.add.text(750, 380,' Tu n as plus de balle dans ton chargeur\n       Appuie sur R pour recharger').setVisible(false);
		this.jumpText = this.add.text(1500, 410,'      Voila un objet\nAttrape le et appuie sur\n  Espace pour lutiliser').setVisible(false);
		this.dJumpText = this.add.text(1800, 250,'Te voilà fin prêt pour affronter l enfer\n  Trouve un moyen d ouvrir le coffre pour gagner !').setVisible(false);
	}

	update() {
		//Messages indicatifs	
			if (this.player.x >= 800) 
			{
				this.runText.setVisible(true);
			}

			if (this.nKill == 1) 
			{
				this.fireText.setVisible(true);
			}

			if (this.player.x >= 1200) 
			{
				this.jumpText.setVisible(true);
			}

			if (this.player.x >= 1600) 
			{
				this.dJumpText.setVisible(true);
			}

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