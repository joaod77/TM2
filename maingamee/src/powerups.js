const PowerUps = {
    options: [
        { name: "(Level 1) Health", description: "Increase maximum health", effect: increaseHealthLevel1 },
        { name: "(Level 2) Health", description: "Increase maximum health", effect: increaseHealthLevel2 },
        { name: "(Level 3) Health", description: "Increase maximum health", effect: increaseHealthLevel3 },
        { name: "(Level 1) Damage", description: "Increase attack damage", effect: increaseDamageLevel1 },
        { name: "(Level 2) Damage", description: "Increase attack damage", effect: increaseDamageLevel2 },
        { name: "(Level 3) Damage", description: "Increase attack damage", effect: increaseDamageLevel3 },
        { name: "(Level 1) Attack Speed", description: "Increase attack speed", effect: increaseAttackSpeedLevel1 },
        { name: "(Level 2) Attack Speed", description: "Increase attack speed", effect: increaseAttackSpeedLevel2 },
        { name: "(Level 3) Attack Speed", description: "Increase attack speed", effect: increaseAttackSpeedLevel3 }
        // Adicione mais opções conforme necessário
    ],

    // Função para escolher aleatoriamente três opções de power-ups
    getRandomOptions: function() {
        // Copia aleatória de 3 opções do array
        const shuffledOptions = this.options.sort(() => 0.5 - Math.random());
        return shuffledOptions.slice(0, 3);
    },

    // Aplica o efeito do power-up selecionado ao jogador
    applyPowerUpEffect: function(player, powerUpOption) {
        // Verifique se a opção de power-up possui um efeito definido
        if (powerUpOption.effect) {
            powerUpOption.effect(player);
        } else {
            console.error(`Power-up effect not defined for option: ${powerUpOption.name}`);
        }
    }
};

// Exemplos de funções para os efeitos dos power-ups
function increaseHealthLevel1(player) {
    player.health *= 1.5; // Exemplo: aumenta a saúde do jogador em 10 (Level 1)
}

function increaseHealthLevel2(player) {
    player.health *= 2; // Exemplo: aumenta a saúde do jogador em 20 (Level 2)
}

function increaseHealthLevel3(player) {
    player.health *= 3; // Exemplo: aumenta a saúde do jogador em 30 (Level 3)
}

function increaseDamageLevel1(player) {
    player.damage *= 2; // Exemplo: aumenta o dano do jogador em 5 (Level 1)
}

function increaseDamageLevel2(player) {
    player.damage *= 3; // Exemplo: aumenta o dano do jogador em 10 (Level 2)
}

function increaseDamageLevel3(player) {
    player.damage *= 4; // Exemplo: aumenta o dano do jogador em 15 (Level 3)
}

function increaseAttackSpeedLevel1(player) {
    player.attackSpeed *= 2; // Exemplo: aumenta a velocidade de ataque em 50% (Level 1)
}

function increaseAttackSpeedLevel2(player) {
    player.attackSpeed *= 3; // Exemplo: aumenta a velocidade de ataque em 100% (Level 2)
}

function increaseAttackSpeedLevel3(player) {
    player.attackSpeed *= 5; // Exemplo: aumenta a velocidade de ataque em 200% (Level 3)
}