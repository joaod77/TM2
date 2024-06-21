class ARScene1 extends Phaser.Scene {
    constructor() {
        super("ARScene1");
        this.enemies = {};
        this.isPlayerInLava = false; // Variável para rastrear se o jogador está na lava
        this.currentRealm = 'AltRealm';
        this.lastUpdateTime = Date.now(); // Guarda o tempo da última atualização
        this.previousScene = ''; // Variável para armazenar o nome da cena anterior
    }

    preload() {
        
    }

    create() {
        
        const mapWidth = 3200;
        const mapHeight = 3200;


        const background = this.add.image(1600,1600, 'back3');
        
        background.setScale(mapWidth / background.width, mapHeight / background.height);
    
        const ARmap1 = this.make.tilemap({ key: 'mapAR1'});
        const lavatile = ARmap1.addTilesetImage('lavatile', 'lavatile');
        const onetilelava = ARmap1.addTilesetImage('1tilelava', 'onetilelava');
    
        platforms = ARmap1.createLayer('Ground', lavatile);
        platforms.setCollisionByProperty({ collides: true});
        
        lava = ARmap1.createLayer('Lava', onetilelava);
        

        // Create player
        player = new Player(this, 100, 3100);

        this.physics.add.collider(player, platforms);
    
    
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, ARmap1.widthInPixels, ARmap1.heightInPixels);
        this.physics.world.setBounds(0, 0, ARmap1.widthInPixels, ARmap1.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

        
        this.altRealmTimerText = this.add.text(1200, 72, `Tempo restante: ${Math.ceil(sharedData.timers.altRealmTimer)}`, {
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
        this.altRealmTimerText.setScrollFactor(0);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
            this.scene.start('mainScene');
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F))) {
            this.scene.start('Scene3');
        }

        player.update();


        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) {
               delete this.enemies[enemyKey];
            }
        }

        // Calcular deltaTime usando Date.now()
        const currentTime = Date.now();
        const deltaTimeInSeconds = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        // Atualizar o timer do AltRealm usando sharedData
        sharedData.timers.altRealmTimer -= deltaTimeInSeconds;
        if (sharedData.timers.altRealmTimer <= 0) {
            sharedData.timers.altRealmTimer = 0;
            console.log('Tempo no AltRealm acabou!');

            this.scene.start('Scene3');
        }

        // Atualizar texto do timer na tela
        this.altRealmTimerText.setText(`Tempo restante: ${Math.ceil(sharedData.timers.altRealmTimer)}`);
    }
    updateTimerText() {
        this.timerText.setText(`Tempo restante: ${Math.ceil(sharedData.timers.altRealmTimer)}`);
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