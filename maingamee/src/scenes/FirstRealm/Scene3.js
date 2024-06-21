class Scene3 extends Phaser.Scene {
    constructor() {
        super("Scene3");
        this.enemies = {};
        this.currentRealm = 'firstRealm';
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {

        const mapWidth = 3200;
        const mapHeight = 3200;
        
        const background = this.add.image(1600,1600, 'back2');
        //background.setScrollFactor(0);
        background.setScale(mapWidth / background.width, mapHeight / background.height);
    
        //this.add.image(0,0,'slime')
        //this.add.image(400, 300, 'tile');
        const map3 = this.make.tilemap({ key: 'map3'});
        const tileset1 = map3.addTilesetImage('tileset1', 'tile');
        const tileTrees = map3.addTilesetImage('trees', 'trees');
    
        platforms = map3.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true});
        
        trees = map3.createLayer('Trees', tileTrees);

        //back = map3.createLayer('Background', tileset1);

        // Create player
        player = new Player(this, 100, 100);

        this.physics.add.collider(player, platforms);
    
    
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
        this.physics.world.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa
    
        //this.scene.start("Scene2");
        
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
            }
        }
    }
}