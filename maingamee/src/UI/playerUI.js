class PlayerUI {
    constructor(scene, player, camera) {
        this.scene = scene;
        this.player = player;
        this.camera = camera;

        // Configurações visuais da interface da orb
        this.orbUI = scene.add.image(20, 20, 'orb', 0); // 'orb_ui' é o nome da imagem da orb na interface
        this.orbUI.setOrigin(0, 0);

        // Configuração das cores para disponível e em cooldown
        this.availableTint = 0xffffff; // Tonalidade branca para orb disponível
        this.cooldownTint = 0x888888; // Tonalidade cinza para orb em cooldown

        // Atualizar posição da UI com base na câmera
        this.updatePosition();
    }

    update() {
        // Verificar se a orb está em cooldown
        if (this.camera) {
            // Verificar se a orb está em cooldown
            const remainingCooldown = this.player.getRemainingCooldown();
            const orbCooldown = this.player.getOrbCooldown();
            const isOrbAvailable = remainingCooldown <= 0;

            // Ajustar a cor da imagem da orb com base no estado de cooldown
            if (isOrbAvailable) {
                this.orbUI.clearTint(); // Limpar qualquer tonalidade (usar cor padrão)
            } else {
                this.orbUI.setTint(this.cooldownTint); // Aplicar a tonalidade de cooldown
            }

            // Atualizar a posição da UI com base na câmera
            this.updatePosition();
        }
    }

    updatePosition() {
        // Verificar se a câmera está definida e válida
        if (this.camera) {
            // Posicionar a UI com base na câmera principal
            const cameraOffsetX = this.camera.scrollX;
            const cameraOffsetY = this.camera.scrollY;

            this.orbUI.x = 20 + cameraOffsetX;
            this.orbUI.y = 20 + cameraOffsetY;
        }
    }
}