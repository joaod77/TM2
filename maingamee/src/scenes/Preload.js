class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
    this.load.spritesheet('slime1', 'assets/enemies/slime1s.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('tile', 'assets/tiles/tileset1.png');
    this.load.image('lavatile', 'assets/tiles/lavatile.png');
    this.load.image('onetilelava', 'assets/tiles/1tilelava.png');
    this.load.tilemapTiledJSON('map1', 'assets/maps/firstRealm/map1.tmj');
    this.load.tilemapTiledJSON('map2', 'assets/maps/firstRealm/map2.tmj');
    this.load.tilemapTiledJSON('map3', 'assets/maps/firstRealm/map3.tmj');
    this.load.tilemapTiledJSON('mapAR1', 'assets/maps/AlternativeRealm/ARmap1.tmj');
    this.load.image('back', 'assets/back/Back2.png');
    this.load.image('back2', 'assets/back/caveBack.png');
    this.load.image('back3', 'assets/back/lavaBack.png');
    this.load.image('trees', 'assets/tiles/trees.png');
    this.load.spritesheet('KatanaSword', 'assets/player/DarkSamurai.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('FireSword', 'assets/player/fire.png' , { frameWidth: 288, frameHeight: 128 });
    this.load.spritesheet('portal', 'assets/builds/portal1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('orb', 'assets/items/OrbofMysteries.png', { frameWidth: 64, frameHeight: 64 });

}

    create() {

        this.anims.create({
            key: 'orb_first',
            frames: this.anims.generateFrameNumbers('orb', { start: 0, end: 1 }), // 3 frames de salto para baixo
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'orb_second',
            frames: this.anims.generateFrameNumbers('orb', { start: 2, end: 4 }), // 3 frames de salto para baixo
            frameRate: 10,
            repeat: 10
        });
    
        this.anims.create({
            key: 'orb_final',
            frames: this.anims.generateFrameNumbers('orb', { start: 5, end: 5 }), // 3 frames de salto para baixo
            frameRate: 10,
            repeat: 0
        });

        this.scene.start("mainScene");
    }

}