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
        this.health = 50;
        this.damage = 5;

        // Criar a barra de vida para o slime
        this.healthBar = new HealthBar(scene, this.x - 20, this.y - 40, 40, 5, this.health, false); // Posição e dimensões da barra de vida


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
        this.play('stand');

        // Criar o retângulo centrado no slime usando Phaser.Geom.Rectangle
        this.rectangle = new Phaser.Geom.Rectangle(x - 188, y - 96, 384, 192); // x - 24 e y - 24 para centralizar
        this.rectangleGraphics = scene.add.graphics({ lineStyle: { color: 0xff0000 } });
        //this.rectangleGraphics.strokeRectShape(this.rectangle);

        // Atualizar posição do retângulo com a posição do slime
        this.updateRectanglePosition();

        this.canAttack = true;

        this.enterRange = false;

    }

    update() {
        this.updateRectanglePosition();

        this.updateHealthBarPosition();
    }

    updateRectanglePosition() {
        // Atualiza a posição do retângulo para estar centrado no slime
        this.rectangle.x = this.x - 188;
        this.rectangle.y = this.y - 96;

        // Limpar e redesenhar o retângulo com a nova posição
        //this.rectangleGraphics.clear();
        //this.rectangleGraphics.strokeRectShape(this.rectangle);
    }

    updateHealthBarPosition() {
        // Atualizar a posição da barra de vida com a posição do slime
        this.healthBar.x = this.x - 20;
        this.healthBar.y = this.y - 40;
    }

    getBoundsRectangle() {
        return this.rectangle;
    }
}

window.slime = Slime;