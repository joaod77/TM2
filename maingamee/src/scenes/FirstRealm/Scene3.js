class Scene3 extends Phaser.Scene {
    constructor() {
        super("Scene3");
        this.enemies = {};
        this.currentRealm = 'firstRealm';
        this.enemyCount = 17;
        this.enemyCountText = null;
        this.timerText = null;
        this.lastUpdateTime = Date.now(); // Guarda o tempo da última atualização
    }

    preload() {
        
    }

    create() {

        const mapWidth = 3200;
        const mapHeight = 3200;

        const background = this.add.image(1600, 1600, 'back2');
        //background.setScrollFactor(0);
        background.setScale(mapWidth / background.width, mapHeight / background.height);

        const map3 = this.make.tilemap({ key: 'map3' });
        const tileset1 = map3.addTilesetImage('tileset1', 'tile');
        const tileTrees = map3.addTilesetImage('trees', 'trees');

        const tilesize = 32;

        enemies = this.physics.add.group();
        this.enemies['slime1'] = new Slime(this, 26 * tilesize, 10 * tilesize);
        enemies.add(this.enemies['slime1']);

        this.enemies['slime2'] = new Slime(this, 95 * tilesize, 15 * tilesize);
        enemies.add(this.enemies['slime2']);

        this.enemies['slime3'] = new Slime(this, 70 * tilesize, 38 * tilesize);
        enemies.add(this.enemies['slime3']);

        this.enemies['slime4'] = new Slime(this, 45 * tilesize, 33 * tilesize);
        enemies.add(this.enemies['slime4']);

        this.enemies['slime5'] = new Slime(this, 24 * tilesize, 47 * tilesize);
        enemies.add(this.enemies['slime5']);

        this.enemies['slime6'] = new Slime(this, 8 * tilesize, 95 * tilesize);
        enemies.add(this.enemies['slime6']);

        this.enemies['slime7'] = new Slime(this, 35 * tilesize, 98 * tilesize);
        enemies.add(this.enemies['slime7']);

        this.enemies['slime8'] = new Slime(this, 58 * tilesize, 96 * tilesize);
        enemies.add(this.enemies['slime8']);

        this.enemies['slime9'] = new Slime(this, 58 * tilesize, 70 * tilesize);
        enemies.add(this.enemies['slime9']);

        this.enemies['slime10'] = new Slime(this, 38 * tilesize, 65 * tilesize);
        enemies.add(this.enemies['slime10']);

        this.enemies['slime11'] = new Slime(this, 82 * tilesize, 61 * tilesize);
        enemies.add(this.enemies['slime11']);

        this.enemies['slime12'] = new Slime(this, 98 * tilesize, 63 * tilesize);
        enemies.add(this.enemies['slime12']);

        this.enemies['slime13'] = new Slime(this, 3 * tilesize, 81 * tilesize);
        enemies.add(this.enemies['slime13']);

        this.enemies['slime14'] = new Slime(this, 98 * tilesize, 63 * tilesize);
        enemies.add(this.enemies['slime14']);

        this.enemies['slime15'] = new Slime(this, 59 * tilesize, 13 * tilesize);
        enemies.add(this.enemies['slime15']);

        this.enemies['slime16'] = new Slime(this, 95 * tilesize, 80 * tilesize);
        enemies.add(this.enemies['slime16']);

        this.enemies['slime17'] = new Slime(this, 80 * tilesize, 14 * tilesize);
        enemies.add(this.enemies['slime17']);

        platforms = map3.createLayer('Ground', tileset1);
        platforms.setCollisionByProperty({ collides: true });

        trees = map3.createLayer('Trees', tileTrees);

       

        // Create player
        player = new Player(this, 100, 100);

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemies, platforms);


        this.cameras.main.startFollow(player);
        
        this.cameras.main.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels);
        this.physics.world.setBounds(0, 0, map3.widthInPixels, map3.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

        //Texto com a informação dos inimigos restantes
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
                color: '#00C954',
                blur: 2,
                fill: true
            }
        });
        this.enemyCountText.setScrollFactor(0);

       

        // Texto do timer do firstRealm
        this.timerText = this.add.text(1200, 72, '', {
            fontFamily: 'Consolas',
            fontSize: '30px',
            fill: '#ff0000',
            padding: { x: 8, y: 4 },
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 3, fill: true }
        });
        this.timerText.setScrollFactor(0);

        // Inicializar o timer do firstRealm
        this.updateTimerText();

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

        const enterText = this.add.text(90 * tilesize, 55 * tilesize, '"N" to Finish and Restart Run (Defeat All Enemies)', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        enterText.setOrigin(0.5);
        enterText.setVisible(true);

    }

    createEnemy(key, x, y) {
        this.enemies[key] = new Slime(this, x, y);
        this.enemiesGroup.add(this.enemies[key]);
        this.enemyCount++; // Incrementa o contador de inimigos
    }

    update() {
        if(this.enemyCount === 0) {
            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N))) {
                this.scene.start('mainScene');
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
        let currentTime = Date.now();
        let deltaTimeInSeconds = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Atualizar o timer do firstRealm usando sharedData
        sharedData.timers.firstRealmTimer -= deltaTimeInSeconds;
        if (sharedData.timers.firstRealmTimer <= 0) {
            console.log('Tempo no FirstRealm acabou!');
            sharedData.timers.firstRealmTimer = 0;
        }

        // Atualizar texto do timer na tela
        this.updateTimerText();
    }

    updateEnemyCountText() {
        this.enemyCountText.setText(`Inimigos restantes: ${this.enemyCount}`);
    }

    updateTimerText() {
        this.timerText.setText(`Tempo restante: ${Math.ceil(sharedData.timers.firstRealmTimer)}`);
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
