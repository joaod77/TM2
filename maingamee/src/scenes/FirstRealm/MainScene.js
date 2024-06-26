class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
        this.enemies = {}; //Armazenar os inimigos por nome
    }


    create() 
    {
    const mapWidth = 1600;
    const mapHeight = 1600;


    const background = this.add.image(800,800, 'back');

    background.setScale(mapWidth / background.width, mapHeight / background.height);

    const map1 = this.make.tilemap({ key: 'map1'});
    const tileset1 = map1.addTilesetImage('Tileset1', 'tile');
    const tileTrees = map1.addTilesetImage('Trees', 'trees');

    platforms = map1.createLayer('Ground', tileset1);
    platforms.setCollisionByProperty({ collides: true});
    
    trees = map1.createLayer('Trees', tileTrees);

    const tilesize = 32;

    const portal = this.physics.add.sprite(39 * tilesize, 16 * tilesize, 'portal');
    portal.setOrigin(0);

    portal.setScale(3);

    const enterText = this.add.text(portal.x + 50, portal.y - 20, '"E" to Enter', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
    enterText.setOrigin(0.5);
    enterText.setVisible(true);


    this.physics.add.collider(portal, platforms);

    // Create player
    player = new Player(this, 100, 450);
    

    enemies = this.physics.add.group();

    this.enemies['slime1'] = new Slime(this, 1400, 1000);
    enemies.add(this.enemies['slime1']);
    
    this.enemies['slime2'] = new Slime(this, 1300, 1000);
    enemies.add(this.enemies['slime2']);

    this.enemies['slime3'] = new Slime(this, 600, 1000);
    enemies.add(this.enemies['slime3']);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemies, platforms);



    this.physics.add.overlap(player, portal, this.teleport, null, this);
    

    this.anims.create({
        key: 'portal_anim',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    })
    portal.anims.play('portal_anim');
    
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);

    
    console.log(this.enemies);


    console.log("Scene atual:", this.scene);

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
 }

    update() {   
        player.update();
        

        for (const enemyKey in this.enemies) {
            this.enemies[enemyKey].update();
            //this.handleDamageTakenEnemies();
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
       
        for (const enemyKey in this.enemies) {
            const enemy = this.enemies[enemyKey];
            if (!enemy.active) {
               delete this.enemies[enemyKey];
            }
        }


 }

 teleport() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        this.scene.start('Scene2');
    }
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
