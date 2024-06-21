class ARScene1 extends Phaser.Scene {
    constructor() {
        super("ARScene1");
        this.enemies = {};
        this.isPlayerInLava = false; // Variável para rastrear se o jogador está na lava
        this.currentRealm = 'AltRealm';
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {
        //this.add.text(400, 300, 'This is Scene2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const mapWidth = 3200;
        const mapHeight = 3200;


        const background = this.add.image(1600,1600, 'back3');
        //background.setScrollFactor(0);
        background.setScale(mapWidth / background.width, mapHeight / background.height);
    
        //this.add.image(0,0,'slime')
        //this.add.image(400, 300, 'tile');
        const ARmap1 = this.make.tilemap({ key: 'mapAR1'});
        const lavatile = ARmap1.addTilesetImage('lavatile', 'lavatile');
        const onetilelava = ARmap1.addTilesetImage('1tilelava', 'onetilelava');
    
        platforms = ARmap1.createLayer('Ground', lavatile);
        platforms.setCollisionByProperty({ collides: true});
        
        lava = ARmap1.createLayer('Lava', onetilelava);
        //lava.setCollisionByProperty({ collides: true});

        // Create player
        player = new Player(this, 100, 3100);

        this.physics.add.collider(player, platforms);
    
    
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, ARmap1.widthInPixels, ARmap1.heightInPixels);
        this.physics.world.setBounds(0, 0, ARmap1.widthInPixels, ARmap1.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa
    
        // Adicionar evento de overlap com a lava
        //this.physics.add.overlap(player, lava, this.handleLavaOverlap, null, this);
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
            this.scene.start('mainScene');
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F))) {
            this.scene.start('Scene3');
        }

        player.update();


        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) {
               delete this.enemies[enemyKey];
            }
        }
    }

    /*handleLavaOverlap(player, lava) {
        if (!this.isPlayerInLava) {
            this.isPlayerInLava = true;
            this.applyLavaDamage();
        }
    }

    applyLavaDamage() {
        if (this.isPlayerInLava) {
            player.handleTakingDamage(10); // Aplica dano ao jogador
            this.time.delayedCall(3000, this.applyLavaDamage, [], this); // Chama novamente após 3 segundos
        }
    }

    handleLavaExit(player, lava) {
        this.isPlayerInLava = false;
    }*/
}