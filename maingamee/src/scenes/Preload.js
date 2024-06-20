class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
    this.load.spritesheet('slime1', 'assets/enemies/slime1s.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('tile', 'assets/tiles/tileset1.png');
    this.load.tilemapTiledJSON('map1', 'assets/maps/firstRealm/map1.tmj');
    this.load.tilemapTiledJSON('map2', 'assets/maps/firstRealm/map2.tmj');
    this.load.tilemapTiledJSON('map3', 'assets/maps/firstRealm/map3.tmj');
    this.load.image('back', 'assets/back/Back2.png');
    this.load.image('back2', 'assets/back/caveBack.png');
    this.load.image('trees', 'assets/tiles/trees.png');
    this.load.spritesheet('KatanaSword', 'assets/player/DarkSamurai.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('FireSword', 'assets/player/fire.png' , { frameWidth: 288, frameHeight: 128 });
    this.load.spritesheet('portal', 'assets/builds/portal1.png', { frameWidth: 32, frameHeight: 32 });
}

    create() {
        this.scene.start("mainScene");
    }

}