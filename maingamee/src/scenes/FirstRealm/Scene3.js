class Scene3 extends Phaser.Scene {
    constructor() {
        super("Scene3");
        this.enemies = {};
        this.enemyCount = 17;
        this.enemyCountText = null;
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {

        const mapWidth = 3200;
        const mapHeight = 3200;

        const background = this.add.image(1600, 1600, 'back2');
        //background.setScrollFactor(0);
        background.setScale(mapWidth / background.width, mapHeight / background.height);

        //this.add.image(0,0,'slime')
        //this.add.image(400, 300, 'tile');
        const map3 = this.make.tilemap({ key: 'map3' });
        const tileset1 = map3.addTilesetImage('tileset1', 'tile');
        const tileTrees = map3.addTilesetImage('trees', 'trees');

        const tilesize = 32;

        enemies = this.physics.add.group();
        this.enemies['slime1'] = new Slime(this, 26 * tilesize, 10 * tilesize);
        enemies.add(this.enemies['slime1']);

        this.enemies['slime2'] = new Slime(this, 95 * tilesize, 15 * tilesize);
        enemies.add(this.enemies['slime2']);

        this.enemies['slime3'] = new Slime(this, 70 * tilesize, 38 * tilesize);
        enemies.add(this.enemies['slime3']);

        this.enemies['slime4'] = new Slime(this, 45 * tilesize, 33 * tilesize);
        enemies.add(this.enemies['slime4']);

        this.enemies['slime5'] = new Slime(this, 24 * tilesize, 47 * tilesize);
        enemies.add(this.enemies['slime5']);

        this.enemies['slime6'] = new Slime(this, 8 * tilesize, 95 * tilesize);
        enemies.add(this.enemies['slime6']);

        this.enemies['slime7'] = new Slime(this, 35 * tilesize, 98 * tilesize);
        enemies.add(this.enemies['slime7']);

        this.enemies['slime8'] = new Slime(this, 58 * tilesize, 96 * tilesize);
        enemies.add(this.enemies['slime8']);

        this.enemies['slime9'] = new Slime(this, 58 * tilesize, 70 * tilesize);
        enemies.add(this.enemies['slime9']);

        this.enemies['slime10'] = new Slime(this, 38 * tilesize, 65 * tilesize);
        enemies.add(this.enemies['slime10']);

        this.enemies['slime11'] = new Slime(this, 82 * tilesize, 61 * tilesize);
        enemies.add(this.enemies['slime11']);

        this.enemies['slime12'] = new Slime(this, 98 * tilesize, 63 * tilesize);
        enemies.add(this.enemies['slime12']);

        this.enemies['slime13'] = new Slime(this, 3 * tilesize, 81 * tilesize);
        enemies.add(this.enemies['slime13']);

        this.enemies['slime14'] = new Slime(this, 98 * tilesize, 63 * tilesize);
        enemies.add(this.enemies['slime14']);

        this.enemies['slime15'] = new Slime(this, 59 * tilesize, 13 * tilesize);
        enemies.add(this.enemies['slime15']);

        this.enemies['slime16'] = new Slime(this, 95 * tilesize, 80 * tilesize);
        enemies.add(this.enemies['slime16']);

        this.enemies['slime17'] = new Slime(this, 80 * tilesize, 14 * tilesize);
        enemies.add(this.enemies['slime17']);

        platforms = map3.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true });

        trees = map3.createLayer('Trees', tileTrees);

        //back = map3.createLayer('Background', tileset1);

        // Create player
        player = new Player(this, 100, 100);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemies, platforms);


        this.cameras.main.startFollow(player);
        //this.cameras.main.setZoom(0.5);
        this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
        this.physics.world.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

        //Texto com a informação dos inimigos restantes
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
                color: '#00C954',
                blur: 2,
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
