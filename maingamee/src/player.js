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

    this.anims.create({
        key: 'fire_attack1',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 252, end: 259 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_attack2',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 260, end: 269 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_attack3',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 270, end: 279 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_dash',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 168, end: 175 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

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

    this.play('orb_first');

    this.cursors = scene.input.keyboard.createCursorKeys();

    // Exemplo de propriedades adicionais
    this.baseHealth = 100;
    this.baseDamage = 10;

    // Variáveis de ataque
    this.attackIndex = 0;
    this.lastAttackTime = 0;
    this.attackCooldown = 500; // Tempo de cooldown entre ataques em milissegundos
    this.attackResetTime = 1500; // Tempo após o qual a sequência de ataque é reiniciada

    // Variável para rastrear o estado de ataque
    this.isAttacking = false;
    this.isDashing = false;
    this.dashSpeed = 600;
    this.dashDuration = 200;
    this.dashCooldown = 1000;
    this.lastDashTime = 0;

    this.orbCooldown = 120000;
    this.orb = scene.add.sprite(x + 32, y + 32, 'orb');

    // Gráfico para mostrar o retângulo de ataque
    this.attackRangeGraphics = scene.add.graphics();
    this.attackRange = new Phaser.Geom.Rectangle(x - 32, y - 16, 0, 0);
    }

    update() {
    const speed = 200;
    const jumpSpeed = -600;
    const currentTime = this.scene.time.now; // Adicionado para registrar o tempo atual

    //console.log(`Current time: ${currentTime}`);
    //console.log(`Last dash time: ${this.lastDashTime}`);
    //console.log(`Dash cooldown: ${this.dashCooldown}`);
    
    //this.body.velocity.x = 0;  // Reset horizontal velocity

    //player.anims.play('fire_idle', true);
    if (!this.isDashing) {
        this.body.velocity.x = 0;  // Reset horizontal velocity

        if (!this.isAttacking) {
            if (this.cursors.left.isDown) {
                this.body.velocity.x = -speed;
                if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'fire_run') {
                    this.anims.play('fire_run', true);
                }
                this.flipX = true;
            } else if (this.cursors.right.isDown) {
                this.body.velocity.x = speed;
                if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'fire_run') {
                    this.anims.play('fire_run', true);
                }
                this.flipX = false;
            } else {
                if (this.body.blocked.down && (!this.anims.isPlaying || this.anims.currentAnim.key !== 'fire_idle')) {
                    this.anims.play('fire_idle', true);
                }
            }
        }
    
        // Jumping logic
        if ((this.cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) && this.body.blocked.down) {
            this.body.velocity.y = jumpSpeed;
            this.anims.play('fire_jump_up', true);
        }

        // Determine if player is jumping or falling
        if (this.body.velocity.y !== 0 && !this.isAttacking) {
            if (this.body.velocity.y < 0) {
                this.anims.play('fire_jump_up', true);
            } else {
                this.anims.play('fire_jump_down', true);
            }
        }

        // Lógica de dash
        const dashKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //const currentTime = this.scene.time.now;

        if (Phaser.Input.Keyboard.JustDown(dashKey)) {
            console.log('Dash key pressed');
            if (currentTime - this.lastDashTime > this.dashCooldown) {
                console.log('Executing dash');
                this.isDashing = true;
                this.lastDashTime = currentTime;
                this.anims.play('fire_dash', true);

                if (this.flipX) {
                    this.body.velocity.x = -this.dashSpeed;
                } else {
                    this.body.velocity.x = this.dashSpeed;
                }

                this.scene.time.delayedCall(this.dashDuration, () => {
                    this.isDashing = false;
                }, [], this);
            }
        }
    }
    //Ativar logica de ataque
    this.handleAttacks();

    this.handleOrb();

    }

    handleOrb() {
        const pressKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.orb = this.scene.add.sprite(this.x + 32, this.y + 32, 'orb');


    }
    
    // Attack logic
    handleAttacks() {
        const attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        const currentTime = this.scene.time.now;

        // Reset attack index if enough time has passed since last attack
        if (currentTime - this.lastAttackTime > this.attackResetTime) {
            this.attackIndex = 0;
        }

        // Start attack animation if attack key is pressed and cooldown has passed
        if (Phaser.Input.Keyboard.JustDown(attackKey) && currentTime - this.lastAttackTime > this.attackCooldown) {
            // Check if not already attacking
            if (!this.isAttacking) {
                this.attackIndex = (this.attackIndex % 3) + 1;  // Advance to the next attack
                this.lastAttackTime = currentTime;  // Update last attack time
                console.log(`Playing attack animation: fire_attack${this.attackIndex}`);  // Debug log

                // Toca a animação de ataque sem interromper outras animações
                this.isAttacking = true;
                this.anims.play(`fire_attack${this.attackIndex}`);

                // Evento para lidar com o dano durante a animação de ataque
                this.on('animationupdate', this.handleAttackDamage, this);
                this.once('animationcomplete', () => {
                    this.isAttacking = false;
                    this.off('animationupdate', this.handleAttackDamage, this);
                });

                /*// Get attack properties (range and damage)
                const { rangeWidth, rangeHeight, damage } = this.getAttackProperties(`fire_attack${this.attackIndex}`);
                console.log(`Attack range width: ${rangeWidth}, range height: ${rangeHeight}, damage: ${damage}`);

                // Display attack range visually
                //this.showAttackRange(rangeWidth, rangeHeight);

                
                // Calculate attack range position based on player's position and direction
                const attackRangeX = this.x - 32;
                const attackRangeY = this.y - 16;

                // Create a Phaser.Rectangle for attack range
                const attackRange = new Phaser.Geom.Rectangle(attackRangeX, attackRangeY, rangeWidth, rangeHeight);

                this.attackRange = attackRange;

                // Limpa o gráfico de ataque e desenha o retângulo de ataque
                this.attackRangeGraphics.clear();
                this.attackRangeGraphics.lineStyle(2, 0xff0000); // Cor vermelha, espessura 2
                this.attackRangeGraphics.strokeRectShape(attackRange);

                // Imprime as dimensões do retângulo
                console.log(`Attack Range: x=${attackRange.x}, y=${attackRange.y}, width=${attackRange.width}, height=${attackRange.height}`);

                // Check for collision between player's attack range and slime
                /*const slimeBounds = slime.getBounds();
                if (Phaser.Geom.Intersects.RectangleToRectangle(attackRange, slimeBounds)) {
                    console.log("Enemy hit!"); // Log when slime is hit
                }*/
            // Add logic to deal damage here if needed
            }
        }
    }

    // Method to get attack properties (range and damage) based on attack animation key
    getAttackProperties(attackKey) {
        // Example implementation: Return range and damage based on attack key
        const defaultProperties = { rangeWidth: 0, rangeHeight: 0, damage: 0 };
        switch (attackKey) {
            case 'fire_attack1':
                return { rangeWidth: 90, rangeHeight: 95, damage: 20 }; // Adjust width and height based on your attack range
            case 'fire_attack2':
                return { rangeWidth: 100, rangeHeight: 80, damage: 30 };
            case 'fire_attack3':
                return { rangeWidth: 120, rangeHeight: 80, damage: 40 };
            default:
                return defaultProperties;
        }
    }

    // Método para lidar com o impacto no inimigo
    handleEnemyHit(enemy) {
        // Reduz a vida do inimigo com base no dano do ataque
        const { damage } = this.getAttackProperties(`fire_attack${this.attackIndex}`);
        enemy.health -= damage;

        // Log para depuração
        console.log(`Enemy Hit! Enemy Health: ${enemy.health}`);

        // Verifica se a vida do inimigo chegou a zero
        if (enemy.health <= 0) {
            enemy.destroy(); // Remove o inimigo do jogo
            console.log("Enemy eliminated!");
        }
    }

    // Método para lidar com o dano durante a animação de ataque
    handleAttackDamage(animation, frame) {
        const penultimateFrameIndex = animation.frames.length - 2;
        if (frame.index === penultimateFrameIndex) {

            // Get attack properties (range and damage)
            const { rangeWidth, rangeHeight, damage } = this.getAttackProperties(`fire_attack${this.attackIndex}`);
            console.log(`Attack range width: ${rangeWidth}, range height: ${rangeHeight}, damage: ${damage}`);

            // Display attack range visually
            //this.showAttackRange(rangeWidth, rangeHeight);

            // Calculate attack range position based on player's position and direction
            var attackRangeX;
            if (this.flipX) {
                // If player is facing left, adjust the attack range position
                attackRangeX = this.x - rangeWidth + 32;
            } else {
                // If player is facing right, use the original calculation
                attackRangeX = this.x - 32;
            }
            const attackRangeY = this.y - 16;

            // Create a Phaser.Rectangle for attack range
            const attackRange = new Phaser.Geom.Rectangle(attackRangeX, attackRangeY, rangeWidth, rangeHeight);

            this.attackRange = attackRange;

            // Limpa o gráfico de ataque e desenha o retângulo de ataque
            this.attackRangeGraphics.clear();
            this.attackRangeGraphics.lineStyle(2, 0xff0000); // Cor vermelha, espessura 2
            this.attackRangeGraphics.strokeRectShape(attackRange);

            // Imprime as dimensões do retângulo
            console.log(`Attack Range: x=${attackRange.x}, y=${attackRange.y}, width=${attackRange.width}, height=${attackRange.height}`);

            for (const enemy of Object.values(this.scene.enemies)) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.attackRange, enemy.getBounds())) {
                    this.handleEnemyHit(enemy);
                }
            }
        }
    }


    /*// Method to display attack range visually
    showAttackRange(rangeWidth, rangeHeight) {
        this.rangeGraphics.clear();
        this.rangeGraphics.lineStyle(2, 0xffffff, 0.5);
        this.rangeGraphics.strokeRect(-rangeWidth / 2, -rangeHeight / 2, rangeWidth, rangeHeight);
        this.rangeGraphics.visible = true;
    }

    // Method to hide attack range display
    hideAttackRange() {
        this.rangeGraphics.visible = false;
    }*/
}


// Attach Player class to window object to make it globally accessible
window.player = Player;

// Exporta a classe para que ela possa ser usada em outras partes do código
//export default Player;