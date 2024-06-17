class Scene2 extends Phaser.Scene {
    constructor() {
        super("Scene2");
    }

    preload() {
        // Carregar os assets da segunda cena, se necessário
    }

    create() {
        this.add.text(400, 300, 'This is Scene2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
            this.scene.start('mainScene');
        }
    }
}