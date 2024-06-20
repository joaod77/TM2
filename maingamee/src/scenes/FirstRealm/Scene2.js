class Scene2 extends Phaser.Scene {
    constructor() {
        super("Scene2");
        this.enemies = {};
        this.enemyCount = 11;
        this.enemyCountText = null;
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {
        //this.add.text(400, 300, 'This is Scene2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const background = this.add.image(800, 800, 'back');
        background.setScrollFactor(0);

        //this.add.image(0,0,'slime')
        //this.add.image(400, 300, 'tile');
        const map2 = this.make.tilemap({ key: 'map2' });
        const tileset1 = map2.addTilesetImage('tileset1', 'tile');
        const tileTrees = map2.addTilesetImage('trees', 'trees');

        const tilesize = 32;

        enemies = this.physics.add.group();
        this.enemies['slime1'] = new Slime(this, 16 * tilesize, 46 * tilesize);
        enemies.add(this.enemies['slime1']);

        this.enemies['slime2'] = new Slime(this, 36 * tilesize, 46 * tilesize);
        enemies.add(this.enemies['slime2']);

        this.enemies['slime3'] = new Slime(this, 59 * tilesize, 59 * tilesize);
        enemies.add(this.enemies['slime3']);

        this.enemies['slime4'] = new Slime(this, 67 * tilesize, 59 * tilesize);
        enemies.add(this.enemies['slime4']);

        this.enemies['slime5'] = new Slime(this, 5 * tilesize, 89 * tilesize);
        enemies.add(this.enemies['slime5']);

        this.enemies['slime6'] = new Slime(this, 77 * tilesize, 33 * tilesize);
        enemies.add(this.enemies['slime6']);

        this.enemies['slime7'] = new Slime(this, 46 * tilesize, 94 * tilesize);
        enemies.add(this.enemies['slime7']);

        this.enemies['slime8'] = new Slime(this, 98 * tilesize, 94 * tilesize);
        enemies.add(this.enemies['slime8']);

        this.enemies['slime9'] = new Slime(this, 66 * tilesize, 96 * tilesize);
        enemies.add(this.enemies['slime9']);

        this.enemies['slime10'] = new Slime(this, 63 * tilesize, 84 * tilesize);
        enemies.add(this.enemies['slime10']);

        this.enemies['slime11'] = new Slime(this, 88 * tilesize, 70 * tilesize);
        enemies.add(this.enemies['slime11']);


        platforms = map2.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true });

        trees = map2.createLayer('Trees', tileTrees);

        // Create player
        player = new Player(this, 100, 450);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemies, platforms);


        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        //this.cameras.main.setZoom(0.5);
        this.physics.world.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

        this.enemyCountText = this.add.text(1200, 32, `Inimigos restantes: ${Object.keys(this.enemies).length}`, {
            fontFamily: 'Consolas',
            fontSize: '30px',
            fill: '#05ceec',
            padding: {
                x: 8,
                y: 4
            },
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                fill: true
            }
        });

        this.enemyCountText.setScrollFactor(0);

        //this.scene.start("Scene2");

    }

    createEnemy(key, x, y) {
        this.enemies[key] = new Slime(this, x, y);
        this.enemiesGroup.add(this.enemies[key]);
        this.enemyCount++; // Incrementa o contador de inimigos
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
                this.enemyCount--; // Decrementa o contador de inimigos
                this.updateEnemyCountText(); // Atualiza o texto da contagem de inimigos
            }
        }
    }

    updateEnemyCountText() {
        this.enemyCountText.setText(`Inimigos restantes: ${this.enemyCount}`);
    }
}
