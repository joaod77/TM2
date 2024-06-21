class Scene2 extends Phaser.Scene {
    constructor() {
        super("Scene2");
        this.enemies = {};
        this.currentRealm = 'firstRealm';
        this.enemyCount = 11;
        this.enemyCountText = null;
        this.timerText = null; // Texto para exibir o timer do FirstRealm
        this.lastUpdateTime = Date.now(); // Guarda o tempo da última atualização
    }

    preload() {
        
    }

    create() {
        
        const mapWidth = 3200;
        const mapHeight = 3200;
        const background = this.add.image(1600,1600, 'back');
        
        background.setScale(mapWidth / background.width, mapHeight / background.height);
    
        const map2 = this.make.tilemap({ key: 'map2' });
        const tileset1 = map2.addTilesetImage('tileset1', 'tile');
        const tileTrees = map2.addTilesetImage('trees', 'trees');

        const tilesize = 32;

        enemies = this.physics.add.group();
        this.enemies['slime1'] = new Slime(this, 16 * tilesize, 46 * tilesize);
        enemies.add(this.enemies['slime1']);

        this.enemies['slime2'] = new Slime(this, 36 * tilesize, 46 * tilesize);
        enemies.add(this.enemies['slime2']);

        this.enemies['slime3'] = new Slime(this, 59 * tilesize, 59 * tilesize);
        enemies.add(this.enemies['slime3']);

        this.enemies['slime4'] = new Slime(this, 67 * tilesize, 59 * tilesize);
        enemies.add(this.enemies['slime4']);

        this.enemies['slime5'] = new Slime(this, 5 * tilesize, 89 * tilesize);
        enemies.add(this.enemies['slime5']);

        this.enemies['slime6'] = new Slime(this, 77 * tilesize, 33 * tilesize);
        enemies.add(this.enemies['slime6']);

        this.enemies['slime7'] = new Slime(this, 46 * tilesize, 94 * tilesize);
        enemies.add(this.enemies['slime7']);

        this.enemies['slime8'] = new Slime(this, 98 * tilesize, 94 * tilesize);
        enemies.add(this.enemies['slime8']);

        this.enemies['slime9'] = new Slime(this, 66 * tilesize, 96 * tilesize);
        enemies.add(this.enemies['slime9']);

        this.enemies['slime10'] = new Slime(this, 63 * tilesize, 84 * tilesize);
        enemies.add(this.enemies['slime10']);

        this.enemies['slime11'] = new Slime(this, 88 * tilesize, 70 * tilesize);
        enemies.add(this.enemies['slime11']);


        platforms = map2.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true });

        trees = map2.createLayer('Trees', tileTrees);

        // Create player
        player = new Player(this, 100, 450);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemies, platforms);


        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
        this.physics.world.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

        this.enemyCountText = this.add.text(1200, 32, `Inimigos restantes: ${Object.keys(this.enemies).length}`, {
            fontFamily: 'Consolas',
            fontSize: '30px',
            fill: '#05ceec',
            padding: {
                x: 8,
                y: 4
            },
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                fill: true
            }
        });

        this.enemyCountText.setScrollFactor(0);



        // Texto do timer do FirstRealm
        this.timerText = this.add.text(1200, 72, `Tempo restante: ${Math.ceil(sharedData.timers.firstRealmTimer)}`, {
            fontFamily: 'Consolas',
            fontSize: '30px',
            fill: '#ff0000',
            padding: {
                x: 8,
                y: 4
            },
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                fill: true
            }
        });
        this.timerText.setScrollFactor(0);

    // Obtém as dimensões da câmera principal
    const cameraWidth = this.cameras.main.width;
    const cameraHeight = this.cameras.main.height;

    // Retângulo opaco para fundo das opções de power-up
    const bgRect = this.add.rectangle(cameraWidth / 2, cameraHeight / 2, 800, 200, 0x000000, 0.8);
    bgRect.setOrigin(0.5); // Define a origem para o centro do retângulo
    bgRect.setScrollFactor(0); // Para manter fixo na tela

    
    const startY = cameraHeight / 2 - 50; // Posição inicial para as opções
    const optionStyle = { fontSize: '24px', fill: '#ffffff', align: 'center' };

    const powerUpOptions = PowerUps.getRandomOptions();

    // Armazenar todas as opções de texto para posterior destruição
    const optionTexts = [];

    // Armazenar todos os eventos de teclado para posterior remoção
    const keyboardEvents = [];

    // Mostrar opções de power-up numeradas de 1 a 3 na tela
    powerUpOptions.forEach((option, index) => {
        const text = this.add.text(cameraWidth / 2, startY + index * 50, `${index + 1}. ${option.name}: ${option.description}`, optionStyle);
        text.setOrigin(0.5); // Define a origem para o centro do texto
        text.setScrollFactor(0); // Para manter fixo na tela
        optionTexts.push(text);

        // Captura de evento de teclado para escolher a opção
        const key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE + index);
        const keyEvent = key.on('down', () => {
            // Aplica o efeito do power-up selecionado ao jogador
            PowerUps.applyPowerUpEffect(player, option);
            console.log(`Jogador escolheu: ${option.name}`);

            // Remove o retângulo de fundo e os textos das opções de power-up da tela
            bgRect.destroy();
            optionTexts.forEach((text) => text.destroy());

            // Remove todos os eventos de teclado associados
            keyboardEvents.forEach(event => event.destroy());

            
            this.time.delayedCall(2000, () => {
                
            });
        });

        });

        const enterText = this.add.text(90 * tilesize, 91 * tilesize, '"N" to Enter (Defeat All Enemies)', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        enterText.setOrigin(0.5);
        enterText.setVisible(true);
    }

    createEnemy(key, x, y) {
        this.enemies[key] = new Slime(this, x, y);
        this.enemiesGroup.add(this.enemies[key]);
        this.enemyCount++; // Incrementa o contador de inimigos
    }

    update() {
        //if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        //    this.scene.start('mainScene');
        //}


        if(this.enemyCount === 0) {
            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N))) {
                this.scene.start('Scene3');
            }
        }

        player.update();

        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) {
                delete this.enemies[enemyKey];
                this.enemyCount--; // Decrementa o contador de inimigos
                this.updateEnemyCountText(); // Atualiza o texto da contagem de inimigos
            }
        }

        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) continue;
            enemy.update();
            if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBoundsRectangle(), player.getBoundsRectangle())){
                console.log("YESSIRES POGGERS");
                console.log("Enemy bounds:", enemy.getBounds());
                enemy.enterRange = true;
            }

            if(enemy.enterRange){
                this.chasePlayer(enemy, player); // Adiciona a função de perseguição
            }
            
            // Verifica se o inimigo está no cooldown antes de permitir outro ataque
            if (enemy.canAttack && Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), player.getBoundsRectangle())) {
                this.handleDamageTakenEnemies(enemy);
                console.log("Inimigo atacou após o cooldown");
                
                // Configuração do cooldown para 3 segundos após o ataque
                enemy.canAttack = false;
                setTimeout(() => {
                    enemy.canAttack = true;
                }, 3000);
            }

        }
        // Calcular deltaTime usando Date.now()
        const currentTime = Date.now();
        const deltaTimeInSeconds = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Atualizar o timer do FirstRealm usando sharedData
        sharedData.timers.firstRealmTimer -= deltaTimeInSeconds;
        if (sharedData.timers.firstRealmTimer <= 0) {
            sharedData.timers.firstRealmTimer = 0;
            console.log('Tempo no FirstRealm acabou!');
            
        }

        // Atualizar texto do timer na tela
        this.timerText.setText(`Tempo restante: ${Math.ceil(sharedData.timers.firstRealmTimer)}`);
    }

    updateEnemyCountText() {
        this.enemyCountText.setText(`Inimigos restantes: ${this.enemyCount}`);
    }

    handleDamageTakenEnemies(enemy) {
        player.handleTakingDamage(enemy.damage);
     }
    
     chasePlayer(enemy, player) {
        const speed = 100; // Velocidade de perseguição do inimigo
    
        if (enemy.x < player.x) {
            enemy.setVelocityX(speed);
        } else if (enemy.x > player.x) {
            enemy.setVelocityX(-speed);
        } else {
            enemy.setVelocityX(0);
        }
    }
}
