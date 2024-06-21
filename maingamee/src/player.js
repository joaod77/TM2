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

        //const bounds = this.body.getBounds();
        //console.log(bounds.width, bounds.height); // Isso vai mostrar 32 e 64, que são as dimensões do corpo físico definido
        //console.log(this.body.getBounds()); // Verifique as dimensões do corpo físico

    // Exemplo de propriedades adicionais
    this.health = 100;
    this.damage = 10;
    this.attackSpeed = 10;

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
        frameRate: this.attackSpeed,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_attack2',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 260, end: 269 }), // 3 frames de salto para baixo
        frameRate: this.attackSpeed,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_attack3',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 270, end: 279 }), // 3 frames de salto para baixo
        frameRate: this.attackSpeed,
        repeat: 0
    });

    this.anims.create({
        key: 'fire_dash',
        frames: this.anims.generateFrameNumbers('FireSword', { start: 168, end: 175 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.cursors = scene.input.keyboard.createCursorKeys();



    // Variáveis de ataque
    this.attackIndex = 0;
    this.lastAttackTime = 0;
    this.attackCooldown = 500; // Tempo de cooldown entre ataques em milissegundos
    this.attackResetTime = 1500; // Tempo após o qual a sequência de ataque é reiniciada

    // Variável para rastrear o estado de ataque
    this.isAttacking = false;
    this.isDashing = false;
    this.canDoubleJump = false;
    this.jumpSpeed = -600;
    this.dashSpeed = 600;
    this.dashDuration = 200;
    this.dashCooldown = 1000;
    this.lastDashTime = 0;

    this.orbCooldown = 120000;
    this.orb = scene.add.sprite(x + 32, y + 32, 'orb');
    this.orb.setVisible(false);

    // Cooldown do orb específico para cada realm
    this.orbCooldownFirstRealm = 60000; // Cooldown de 120 segundos para o uso da orb no firstRealm
    this.orbCooldownAltRealm = Infinity; // Cooldown infinito para o uso da orb no Realm Alternativo
    this.lastOrbTime = 0; // Timestamp do último uso da orb

    // Flag para identificar o realm atual do jogador
    this.currentRealm = 'firstRealm';

    // Gráfico para mostrar o retângulo de ataque
    this.attackRangeGraphics = scene.add.graphics();
    this.attackRange = new Phaser.Geom.Rectangle(x - 32, y - 16, 0, 0);

    this.playerUI = new PlayerUI(scene, this, scene.cameras.main);

    console.log(`Scene Realm: ${this.scene.currentRealm}`);

    this.healthBar = new HealthBar(scene, scene.cameras.main.scrollX + 100, scene.cameras.main.scrollY + 100, 100, 5, this.health, true); // Posição e dimensões da barra de vida

    //this.healthBar.fixedToCamera = 'true';

    // Criar o retângulo centrado no slime usando Phaser.Geom.Rectangle
    this.rectangle = new Phaser.Geom.Rectangle(x - 16, y, 32, 64); // x - 24 e y - 24 para centralizar
    this.rectangleGraphics = scene.add.graphics({ lineStyle: { color: 0xff0000 } });
    this.rectangleGraphics.strokeRectShape(this.rectangle);

    // Atualizar posição do retângulo com a posição do slime
    this.updateRectanglePosition();
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
        if (this.cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) {
            if (this.body.blocked.down) {
                // First Jump
                this.setVelocityY(this.jumpSpeed);
                this.anims.play('fire_jump_up', true);
                this.canDoubleJump = true; 
                
            } else if (this.canDoubleJump) {
                // Second Jump
                this.setVelocityY(this.jumpSpeed);
                this.anims.play('fire_jump_up', true);
                this.canDoubleJump = false; 
            }
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

    this.playerUI.update();

    this.healthBar.updatePosition(this.scene.cameras.main.scrollX + 600, this.scene.cameras.main.scrollY + 50);

    this.updateRectanglePosition();

    }


    handleOrb() {
        const pressKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        const currentTime = this.scene.time.now;

        // Verifica se é o primeiro uso da orb no FirstRealm
        if (this.scene.currentRealm === 'firstRealm' && this.lastOrbTime === 0) {
            this.lastOrbTime = currentTime - this.orbCooldownFirstRealm; // Inicia o cooldown para permitir o uso imediato
        }

        // Logs para verificar a condição de cooldown da orb
        //console.log(`Current Time: ${currentTime}`);
        //console.log(`Last Orb Time: ${this.lastOrbTime}`);
        //console.log(`Orb Cooldown: ${this.getOrbCooldown()}`);

        // Verifica se a tecla F foi pressionada e o cooldown já passou no realm atual
        if (Phaser.Input.Keyboard.JustDown(pressKey) && (currentTime - this.lastOrbTime > this.getOrbCooldown())) {~
            console.log("Tecla F pressionada para ativar o Orb.");
            this.lastOrbTime = currentTime;
            this.orb.setVisible(true);
            this.orb.x = this.x + 32;
            this.orb.y = this.y + 32;

            this.orb.anims.play('orb_first');

            // Após 3 segundos, mudar para 'orb_second'
            this.scene.time.delayedCall(1000, () => {
                this.orb.anims.play('orb_second');
                this.orb.anims.currentAnim.frameRate = 10;

                // Gradualmente aumentar a taxa de frames durante 10 segundos
                for (var i = 1; i <= 10; i++) {
                    this.scene.time.delayedCall(i * 1000, () => {
                        this.orb.anims.currentAnim.frameRate += 10;
                    });
                }

                // Após 10 segundos, mudar para 'orb_final' e teleportar se estiver no firstRealm
                this.scene.time.delayedCall(1000, () => {
                    this.orb.anims.play('orb_final');
                    if (this.scene.currentRealm === 'firstRealm') {
                        this.scene.time.delayedCall(500, () => {
                            this.handleTeleportToAltRealm();
                        });
                    }

                        // Após 2 segundos, desativar a orb (tornar invisível)
                    this.scene.time.delayedCall(2000, () => {
                        this.orb.setVisible(false);
                    });
                });
            });
        }

        if (this.orb.visible) {
            this.orb.x = this.x + 32;
            this.orb.y = this.y + 32;
        }
    }

    handleTeleportToAltRealm() {
        // Implemente a lógica de teletransporte para o Realm Alternativo
        // Exemplo:
        // this.scene.scene.start('AltRealmScene');
        // Defina o cooldown específico do orb para o Realm Alternativo
        //this.currentRealm = 'AltRealm';
        this.scene.scene.start('ARScene1');
        //this.scene.time.delayedCall(10000, () => {
        //    this.currentRealm = 'firstRealm';
        //})
    }

    getOrbCooldown() {
        // Retorna o cooldown correto com base no realm atual
        if (this.scene.currentRealm === 'firstRealm') {
            return this.orbCooldownFirstRealm;
        } else {
            return this.orbCooldownAltRealm;
        }
    }

    getRemainingCooldown() {
        // Retorna o tempo restante do cooldown da orb
        const currentTime = this.scene.time.now;
        if (this.scene.currentRealm === 'firstRealm') {
            return Math.max(0, this.lastOrbTime + this.orbCooldownFirstRealm - currentTime);
        } else {
            return Math.max(0, this.lastOrbTime + this.orbCooldownAltRealm - currentTime);
        }
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
        enemy.healthBar.decrease(damage);

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

    handleTakingDamage(amount) {
        this.health -= amount;
        this.healthBar.decrease(amount);
        console.log(`Player health: ${this.health}`);
        
        // Adicione lógica adicional para quando a vida do jogador atingir 0, se necessário
        if (this.health <= 0) {
            console.log("Player died");

            // Implementar lógica de morte do jogador
        }
    }

    updateRectanglePosition() {
        // Atualiza a posição do retângulo para estar centrado no slime
        this.rectangle.x = this.x - 16;
        this.rectangle.y = this.y;

        // Limpar e redesenhar o retângulo com a nova posição
        this.rectangleGraphics.clear();
        this.rectangleGraphics.strokeRectShape(this.rectangle);
    }

    getBoundsRectangle() {
        return this.rectangle;
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