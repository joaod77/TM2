class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }

    preload() {
    this.load.spritesheet('slime', 'assets/enemies/slime1s.png', { frameWidth: 64, frameHeight: 64 });
    this.load.image('tile', 'assets/tiles/tileset1.png');
    this.load.tilemapTiledJSON('map1', 'assets/maps/map1.tmj');
    this.load.image('back', 'assets/back/Back2.png');
    this.load.image('trees', 'assets/tiles/trees.png');
    this.load.spritesheet('KatanaSword', 'assets/player/DarkSamurai.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('FireSword', 'assets/player/fire.png' , { frameWidth: 288, frameHeight: 128 });
    this.load.spritesheet('portal', 'assets/builds/portal1.png', { frameWidth: 32, frameHeight: 32 });
 }

    create() 
    {
    const background = this.add.image(800,800, 'back');
    background.setScrollFactor(0);

    //this.add.image(0,0,'slime')
    //this.add.image(400, 300, 'tile');
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

    //player = this.physics.add.sprite(100, 450, 'KatanaSword');
    //player.setBounce(0.2);
    //player.setCollideWorldBounds(true);

    player = this.physics.add.sprite(100, 450, 'FireSword');
    player.setCollideWorldBounds(true);

    player.body.setSize(32, 64); // Substitua 64 e 192 pelos valores corretos do frameWidth e frameHeight do 'HiddenSwordIdle'

    // Ajuste do centro do corpo físico para centralizá-lo no sprite
    player.body.setOffset(128, 64); // Metade do width e height do tamanho do corpo físico

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, portal, this.teleport, null, this);
    //this.physics.add.overlap(player, portal,)

    //Criação das animações do slime
    /*this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 3}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'stand',
        frames: [ { key: 'slime', frame: 0 } ],
        frameRate: 20
    });*/


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
        frames: this.anims.generateFrameNumbers('FireSword', { start: 19, end: 21 }), // 3 frames de salto para baixo
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'portal_anim',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    })
    portal.anims.play('portal_anim');
    /*
    // Criação das animações para 'Idle'
    this.anims.create({
        key: 'hidden_idle',
        frames: this.anims.generateFrameNumbers('HiddenSword', { start: 0, end: 6 }), // Ajuste conforme o número de frames do spritesheet
        frameRate: 10,
        repeat: -1
    });

    // Criação das animações para 'Run'
    this.anims.create({
        key: 'hidden_run',
        frames: this.anims.generateFrameNumbers('HiddenSwordRun', { start: 0, end: 7 }), // Ajuste conforme o número de frames do spritesheet
        frameRate: 10,
        repeat: -1
    });

    // Criação das animações para 'Jump'
    this.anims.create({
        key: 'hidden_jump',
        frames: this.anims.generateFrameNumbers('HiddenSwordJump', { start: 0, end: 2 }), // Ajuste conforme o número de frames do spritesheet
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('HiddenSwordAttack', { start: 0, end: 4 }), // Primeira parte do ataque
        frameRate: 10,
        repeat: -1 // Não repetir automaticamente
    });

    this.anims.create({
        key: 'attack2',
        frames: this.anims.generateFrameNumbers('HiddenSwordAttack', { start: 5, end: 9 }), // Segunda parte do ataque
        frameRate: 10,
        repeat: -1 // Não repetir automaticamente
    });

    this.anims.create({
        key: 'attack3',
        frames: this.anims.generateFrameNumbers('HiddenSwordAttack', { start: 10, end: 14 }), // Terceira parte do ataque
        frameRate: 10,
        repeat: 1 // Não repetir automaticamente
    });

    // Criação da animação para o dash
    this.anims.create({
        key: 'hidden_dash',
        frames: this.anims.generateFrameNumbers('HiddenSwordDash', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: 0, // Não repetir automaticamente     
    });
    */


    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels);
    this.physics.world.setBounds(0, 0, map1.widthInPixels, map1.heightInPixels); // Define os limites do mundo conforme o tamanho do mapa

    //this.scene.start("Scene2");
    
 }

    update() {   
    const speed = 200;
    const jumpSpeed = -600;
    
    player.body.velocity.x = 0;  // Reset horizontal velocity

    //player.anims.play('fire_idle', true);

    if (cursors.left.isDown) {
        player.body.velocity.x = -speed;
        player.anims.play('fire_run', true);
        player.flipX = true;
        
    } else if (cursors.right.isDown) {
        player.body.velocity.x = speed;
        player.anims.play('fire_run', true);
        player.flipX = false;
    }else{
        player.anims.play('fire_idle', true);
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
    if ((cursors.up.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 500)) && player.body.blocked.down) {
        
        player.body.velocity.y = jumpSpeed;
        player.anims.play('fire_jump_up', true);
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

 teleport() {
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        this.scene.start('Scene2');
    }
 }
}
