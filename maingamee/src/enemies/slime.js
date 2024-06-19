class Slime extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'slime1'); // Substitua 'enemy1Sprite' pelo nome do sprite do seu inimigo

        // Adicionar lógica específica do inimigo aqui, como física, animações, comportamentos, etc.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configurações específicas do inimigo
        //this.setScale(1.5); // Exemplo de escala do sprite do inimigo
        this.setCollideWorldBounds(true); // Exemplo de colisão com os limites do mundo

        // Configurações de animações, física, etc.
        this.body.setSize(48, 48); // Exemplo de configuração do tamanho do corpo do inimigo
        this.body.setOffset(8, 0); // Exemplo de configuração do offset do corpo do inimigo

            // Exemplo de propriedades adicionais
        this.health = 10;
        this.attackPower = 10;


        //Criação das animações do slime
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('slime1', {start: 0, end: 3}),
            frameRate: 7,
            repeat: -1
        });

        this.anims.create({
            key: 'stand',
            frames: [ { key: 'slime1', frame: 0 } ],
            frameRate: 20
        });

        // Iniciar a animação padrão
        this.play('stand'); // 'move' é o nome da animação de movimento
    }

    // Métodos adicionais específicos do inimigo podem ser definidos aqui
    // Por exemplo: métodos para comportamentos específicos, IA, etc.
}

window.slime = Slime;