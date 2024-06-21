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

        // Texto "F To Use Orb" na parte superior da tela
        this.orbText = scene.add.text(scene.cameras.main.scrollX + 100, scene.cameras.main.scrollY + 40, 'F To Use Orb', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        this.orbText.setScrollFactor(0); // Mantém o texto fixo na tela
        this.orbText.setOrigin(0);
        this.orbText.setVisible(true);

        this.swordSound = scene.sound.add('sword');
        this.explosionSound = scene.sound.add('explosion');



    // Stats do player
    this.health = 100;
    this.damage = 20;
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

    this.orb = scene.add.sprite(x + 32, y + 32, 'orb');
    this.orb.setVisible(false);

    // Cooldown do orb específico para cada realm
    this.orbCooldownFirstRealm = 60000; // Cooldown de 120 segundos para o uso da orb no firstRealm
    this.orbCooldownAltRealm = Infinity; // Cooldown infinito para o uso da orb no Realm Alternativo
    this.lastOrbTime = 0; // Timestamp do último uso da orb


    // Gráfico para mostrar o retângulo de ataque
    this.attackRangeGraphics = scene.add.graphics();
    this.attackRange = new Phaser.Geom.Rectangle(x - 32, y - 16, 0, 0);

    this.playerUI = new PlayerUI(scene, this, scene.cameras.main);

    console.log(`Scene Realm: ${this.scene.currentRealm}`);

    this.healthBar = new HealthBar(scene, scene.cameras.main.scrollX + 100, scene.cameras.main.scrollY + 100, 200, 15, this.health, true); // Posição e dimensões da barra de vida

    // Criar o retângulo centrado no slime usando Phaser.Geom.Rectangle
    this.rectangle = new Phaser.Geom.Rectangle(x - 16, y, 32, 64); 
    this.rectangleGraphics = scene.add.graphics({ lineStyle: { color: 0xff0000 } });
    //this.rectangleGraphics.strokeRectShape(this.rectangle);

    // Atualizar posição do retângulo com a posição do slime
    this.updateRectanglePosition();
    }

    update() {
    const speed = 200;
    const currentTime = this.scene.time.now; // Adicionado para registrar o tempo atual

    if (!this.isDashing) {
        this.body.velocity.x = 0;

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
    
        // Logica de salto
        if (this.cursors.up.isDown || this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) {
            if (this.body.blocked.down) {
                // Primeiro Salto
                this.setVelocityY(this.jumpSpeed);
                this.anims.play('fire_jump_up', true);
                this.canDoubleJump = true; 
                
            } else if (this.canDoubleJump) {
                // Segundo Salto
                this.setVelocityY(this.jumpSpeed);
                this.anims.play('fire_jump_up', true);
                this.canDoubleJump = false; 
            }
        }

        // Determina se o player está a saltar ou a cair
        if (this.body.velocity.y !== 0 && !this.isAttacking) {
            if (this.body.velocity.y < 0) {
                this.anims.play('fire_jump_up', true);
            } else {
                this.anims.play('fire_jump_down', true);
            }
        }

        // Lógica de dash
        const dashKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        

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


        // Verifica se a tecla F foi pressionada e o cooldown já passou no realm atual
        if (Phaser.Input.Keyboard.JustDown(pressKey) && (currentTime - this.lastOrbTime > this.getOrbCooldown())) {~
            console.log("Tecla F pressionada para ativar o Orb.");
            this.lastOrbTime = currentTime;
            this.orb.setVisible(true);
            this.orb.x = this.x + 32;
            this.orb.y = this.y + 32;

            this.orb.anims.play('orb_first');

            // Após 1 segundo, mudar para 'orb_second'
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
        // Armazenar o tempo restante do timer do firstRealm antes de mudar para AltRealm
        sharedData.remainingTime.firstRealm = this.getRemainingTime('firstRealm');

        sharedData.timers.altRealmTimer = 60;
        // Implementar a lógica de teletransporte para o Realm Alternativo
        this.scene.scene.start('ARScene1');

        // Restaurar o timer do AltRealm se já existir ou inicializar se não
        if (!sharedData.remainingTime.altRealm) {
            sharedData.remainingTime.altRealm = sharedData.timers.altRealmTimer;
        }
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

    // Método para obter o tempo restante com base no realm específico
    getRemainingTime(realm) {
        return sharedData.remainingTime[realm] || sharedData.timers[`${realm}Timer`];
    }
    
    // Attack logic
    handleAttacks() {
        const attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        const currentTime = this.scene.time.now;

        // Resetar o index do ataque
        if (currentTime - this.lastAttackTime > this.attackResetTime) {
            this.attackIndex = 0;
        }

        // Começar ataque caso a key esteja pressionada e o cooldown ter passado
        if (Phaser.Input.Keyboard.JustDown(attackKey) && currentTime - this.lastAttackTime > this.attackCooldown) {
            // Verificar se não está a atacar
            if (!this.isAttacking) {
                this.attackIndex = (this.attackIndex % 3) + 1;  // Avança para o próximo ataque
                this.lastAttackTime = currentTime;  // Atualizar o ultimo ataque
                console.log(`Playing attack animation: fire_attack${this.attackIndex}`);

                // Toca a animação de ataque sem interromper outras animações
                this.isAttacking = true;
                this.anims.play(`fire_attack${this.attackIndex}`);
                if (this.attackIndex === 1 || this.attackIndex === 2) {
                    this.swordSound.play();
                } else{
                    this.explosionSound.play();
                }

                // Evento para lidar com o dano durante a animação de ataque
                this.on('animationupdate', this.handleAttackDamage, this);
                this.once('animationcomplete', () => {
                    this.isAttacking = false;
                    this.off('animationupdate', this.handleAttackDamage, this);
                });

            }
        }
    }

    // Metodo de determinar o range e o damage do ataque
    getAttackProperties(attackKey) {
        
        const defaultProperties = { rangeWidth: 0, rangeHeight: 0, damage: 0 };
        switch (attackKey) {
            case 'fire_attack1':
                return { rangeWidth: 90, rangeHeight: 95, damage: this.damage }; // Adjust width and height based on your attack range
            case 'fire_attack2':
                return { rangeWidth: 100, rangeHeight: 80, damage: this.damage * 1.5 };
            case 'fire_attack3':
                return { rangeWidth: 120, rangeHeight: 80, damage: this.damage * 3 };
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

            // Obter propriedades do ataque
            const { rangeWidth, rangeHeight, damage } = this.getAttackProperties(`fire_attack${this.attackIndex}`);
            console.log(`Attack range width: ${rangeWidth}, range height: ${rangeHeight}, damage: ${damage}`);


            // Calcular o range do ataque
            var attackRangeX;
            if (this.flipX) {
                
                attackRangeX = this.x - rangeWidth + 32;
            } else {
                
                attackRangeX = this.x - 32;
            }
            const attackRangeY = this.y - 16;

            // Criar um retangulo para poder testar
            const attackRange = new Phaser.Geom.Rectangle(attackRangeX, attackRangeY, rangeWidth, rangeHeight);

            this.attackRange = attackRange;

            
            //this.attackRangeGraphics.clear();
            //this.attackRangeGraphics.lineStyle(2, 0xff0000); 
            //this.attackRangeGraphics.strokeRectShape(attackRange);

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
        
        
        if (this.health <= 0) {
            console.log("Player died");

            //this.scene.start('mainScene');
        }
    }

    updateRectanglePosition() {
        
        this.rectangle.x = this.x - 16;
        this.rectangle.y = this.y;

        
        //this.rectangleGraphics.clear();
        //this.rectangleGraphics.strokeRectShape(this.rectangle);
    }

    getBoundsRectangle() {
        return this.rectangle;
    }
}


// Associar class Player a uma window object
window.player = Player;
