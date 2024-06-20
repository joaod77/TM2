// Função que adiciona a IA de seguir jogador a um inimigo específico
function addChasePlayerAI(enemy, player, detectRange, moveSpeed, jumpVelocity) {
    enemy.chaseRange = new Phaser.Geom.Rectangle(enemy.x - detectRange / 2, enemy.y - detectRange / 2, detectRange, detectRange);
    enemy.moveSpeed = moveSpeed;
    enemy.jumpVelocity = jumpVelocity;

    // Cria um objeto gráfico para desenhar o retângulo de detecção
    enemy.detectGraphics = enemy.scene.add.graphics({
        lineStyle: {
            width: 2,
            color: 0xff0000,
            alpha: 0.8
        }
    });

    enemy.update = function() {
        Phaser.Geom.Rectangle.CenterOn(enemy.chaseRange, enemy.x, enemy.y);

        if (Phaser.Geom.Intersects.RectangleToRectangle(enemy.chaseRange, player.getBounds())) {
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
            const distanceX = player.x - enemy.x;

            // Movimento horizontal
            if (distanceX > 5) {
                enemy.setVelocityX(this.moveSpeed);
                enemy.setFlipX(false); // Inimigo olha para a direita
            } else if (distanceX < -5) {
                enemy.setVelocityX(-this.moveSpeed);
                enemy.setFlipX(true); // Inimigo olha para a esquerda
            } else {
                enemy.setVelocityX(0);
            }

            // Pular se estiver no chão e o jogador estiver acima do inimigo
            if (enemy.body.onFloor() && player.y < enemy.y) {
                enemy.setVelocityY(-this.jumpVelocity);
            }
        } else {
            enemy.setVelocity(0, 0);
        }

        // Desenha o retângulo de detecção na cena
        enemy.detectGraphics.clear();
        enemy.detectGraphics.strokeRectShape(enemy.chaseRange);
    };
}