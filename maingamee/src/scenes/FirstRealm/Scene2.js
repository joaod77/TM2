class Scene2 extends Phaser.Scene {
    constructor() {
        super("Scene2");
        this.enemies = {};
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {
        //this.add.text(400, 300, 'This is Scene2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const background = this.add.image(800,800, 'back');
        background.setScrollFactor(0);
    
        //this.add.image(0,0,'slime')
        //this.add.image(400, 300, 'tile');
        const map2 = this.make.tilemap({ key: 'map2'});
        const tileset1 = map2.addTilesetImage('tileset1', 'tile');
        const tileTrees = map2.addTilesetImage('trees', 'trees');
    
        platforms = map2.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true});
        
        trees = map2.createLayer('Trees', tileTrees);

        // Create player
        player = new Player(this, 100, 450);

        this.physics.add.collider(player, platforms);
    
    
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.physics.world.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa
    
        //this.scene.start("Scene2");
        
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
}