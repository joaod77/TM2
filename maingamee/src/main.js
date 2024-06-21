const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000},
            debug: false
        }
    },
    scene: [Preload, MainScene, Scene2, Scene3, ARScene1]
};

const game = new Phaser.Game(config);
var cursors;
var player;
var attackPart = 0;
var platforms;
var trees;
var portal;
var slime;
var enemyName;
var enemies;
var lava;
