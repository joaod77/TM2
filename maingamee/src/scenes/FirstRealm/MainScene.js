class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
        this.enemies = {}; //Armazenar os inimigos por nome
    }
/*
    preload() {
    this.load.spritesheet('slime', 'assets/enemies/slime1s.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('tile', 'assets/tiles/tileset1.png');
    this.load.tilemapTiledJSON('map1', 'assets/maps/map1.tmj');
    this.load.image('back', 'assets/back/Back2.png');
    this.load.image('trees', 'assets/tiles/trees.png');
    this.load.spritesheet('KatanaSword', 'assets/player/DarkSamurai.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('FireSword', 'assets/player/fire.png' , { frameWidth: 288, frameHeight: 128 });
    this.load.spritesheet('portal', 'assets/builds/portal1.png', { frameWidth: 32, frameHeight: 32 });
 }*/

    create() 
    {
    const background = this.add.image(800,800, 'back');
    background.setScrollFactor(0);

    //this.add.image(0,0,'slime')
    //this.add.image(400, 300, 'tile');
    const map1 = this.make.tilemap({ key: 'map1'});
    const tileset1 = map1.addTilesetImage('Tileset1', 'tile');
    const tileTrees = map1.addTilesetImage('Trees', 'trees');

    platforms = map1.createLayer('Ground', tileset1);
    platforms.setCollisionByProperty({ collides: true});
    
    trees = map1.createLayer('Trees', tileTrees);

    const tilesize = 32;

    const portal = this.physics.add.sprite(39 * tilesize, 16 * tilesize, 'portal');
    portal.setOrigin(0);

    portal.setScale(3);

    const enterText = this.add.text(portal.x + 50, portal.y - 20, '"E" to Enter', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
    enterText.setOrigin(0.5);
    enterText.setVisible(true);


    this.physics.add.collider(portal, platforms);

    // Create player
    player = new Player(this, 100, 450);
    slime = new Slime(this, 1500, 1000);

    enemies = this.physics.add.group();

    this.enemies['slime1'] = new Slime(this, 1400, 1000);
    enemies.add(this.enemies['slime1']);
    
    this.enemies['slime2'] = new Slime(this, 1300, 1000);
    enemies.add(this.enemies['slime2']);

    this.enemies['slime3'] = new Slime(this, 600, 1000);
    enemies.add(this.enemies['slime3']);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);

    // Detecção de colisão entre ataque do jogador e slime
    //this.physics.add.overlap(player.rangeGraphics.getBounds(), slime.getBounds(), () => {
    //    console.log("Enemy hit!"); // Log when slime is hit
    //});


    this.physics.add.overlap(player, portal, this.teleport, null, this);
    

    this.anims.create({
        key: 'portal_anim',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    })
    portal.anims.play('portal_anim');
    

    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);

    //this.scene.start("Scene2");
    console.log(this.enemies);


    this.physics.add.overlap(player, enemies, this.teleport, null, this);
    
 }

    update() {   
        player.update();

        for (const enemyKey in this.enemies) {
            this.enemies[enemyKey].update();
        }

        //this.enemies['slime1'].update();
        //this.enemies['slime2'].update();
        //this.enemies['slime3'].update();

        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            enemy.update();
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBoundsRectangle(), player.getBounds())){
                console.log("YESSIRES POGGERS");
                console.log("Enemy bounds:", enemy.getBounds());
            }
        }
  


        /*for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
    
            // Verifica se o inimigo ainda existe (ativo)
            if (enemy.active) {
                const enemyBounds = enemy.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(player.attackRange, enemyBounds)) {
                    // Ação quando o inimigo é atingido pelo jogador
                    player.handleAttackDamage(animation, frame, enemy);
                }
            } else {
                // Se o inimigo não existe mais (foi destruído), remova-o da lista
                delete this.enemies[enemyKey];
            }
        }*/
       
        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) {
               delete this.enemies[enemyKey];
            }
        }


 }

 teleport() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        this.scene.start('Scene2');
    }
 }
}
