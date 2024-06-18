class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'FireSword');

        // Add the player to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set player properties
        this.setCollideWorldBounds(true);
        this.body.setSize(32, 64);
        this.body.setOffset(128, 64);

    // Criação das animações do FireSword
    this.anims.create({
        key: 'fire_idle',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 0, end: 7 }), // 8 frames de idle
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'fire_run',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 28, end: 35 }), // 8 frames de corrida
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'fire_jump_up',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 56, end: 58 }), // 3 frames de salto para cima
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_jump_down',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 84, end: 86 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.cursors = scene.input.keyboard.createCursorKeys();

        // Exemplo de propriedades adicionais
        this.health = 100;
        this.attackPower = 10;

    }

    update() {
    const speed = 200;
    const jumpSpeed = -600;
    
    this.body.velocity.x = 0;  // Reset horizontal velocity

    //player.anims.play('fire_idle', true);

    if (this.cursors.left.isDown) {
        this.body.velocity.x = -speed;
        this.anims.play('fire_run', true);
        this.flipX = true;
        
    } else if (this.cursors.right.isDown) {
        this.body.velocity.x = speed;
        this.anims.play('fire_run', true);
        this.flipX = false;
    }else{
        this.anims.play('fire_idle', true);
    }


    /*if (cursors.left.isDown) {
        player.body.velocity.x = -speed;
        if (!player.anims.isPlaying || player.anims.currentAnim.key !== 'fire_run') {
            player.anims.play('fire_run', true);
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = speed;
        if (!player.anims.isPlaying || player.anims.currentAnim.key !== 'fire_run') {
            player.anims.play('fire_run', true);
        }
    } else {
        if (!player.anims.isPlaying || player.anims.currentAnim.key !== 'fire_idle') {
            player.anims.play('fire_idle', true);
        }
    }*/

    // Ativação do dash
    /*if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q))) {
        console.log('Dashing');
        player.anims.stop('hidden_idle'); // Para a animação de idle
        player.anims.play('hidden_dash', true);

        // Define a velocidade do dash para a direita
        const dashSpeed = 10000;
        player.body.velocity.x = dashSpeed;
    }*/

    // Jumping logic
    if ((this.cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) && player.body.blocked.down) {
        
        this.body.velocity.y = jumpSpeed;
        this.anims.play('fire_jump_up', true);
    }

    // Determine if player is jumping or falling
    if (this.body.velocity.y < 0) {
        this.anims.play('fire_jump_up', true);
    } else if (this.body.velocity.y > 0) {
        this.anims.play('fire_jump_down', true);
    } else if (this.body.blocked.down) {
        this.anims.play('fire_idle', true);
    }

     // Controle de ataque
    /*if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z))) {
        if (attackPart === 0) {
            console.log('Starting attack part 1');
            player.anims.play('attack1');
        } else if (attackPart === 1) {
            console.log('Starting attack part 2');
            player.anims.play('attack2');
        } else if (attackPart === 2) {
            console.log('Starting attack part 3');
            player.anims.play('attack3');
        }
        attackPart = (attackPart + 1) % 3; // Avança para a próxima parte do ataque
        player.anims.stop('hidden_idle'); // Para a animação de idle
    }*/
    }
}

// Attach Player class to window object to make it globally accessible
window.player = Player;

// Exporta a classe para que ela possa ser usada em outras partes do código
//export default Player;