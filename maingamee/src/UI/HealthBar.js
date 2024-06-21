class HealthBar {
    constructor(scene, x, y, width, height, health, isPlayer = false) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = health; // Valor inicial da vida (porcentagem)

        //if(isPlayer) {
        //    this.draw();
        //}
        //this.draw();

        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
            this.destroy(); 
        }
        
        this.draw();

        return (this.value === 0);
    }

    draw() {
        this.bar.clear();

        // Caixa de borda da barra de vida
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        // Barra de vida (cor verde)
        this.bar.fillStyle(0x00ff00);
        let width = (this.value / 100) * this.width;
        if (width < 0) {
            width = 0;
        }
        this.bar.fillRect(this.x, this.y, width, this.height);
    }

    destroy() {
        // Remover a barra de vida da cena
        this.bar.destroy();
        
        // Limpar referências
        //this.bar = null;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }
}

//window.healthBar = HealthBar;