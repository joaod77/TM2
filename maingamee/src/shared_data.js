const sharedData = {
    //player: null,
    timers: {
    firstRealmTimer: 120,
    altRealmTimer: 60
    },
    remainingTime: {
        firstRealm: 120,
        altRealm: 60
    }
};

// Método para salvar o tempo restante do firstRealm quando mudando para o AltRealm
function saveFirstRealmTimer() {
    sharedData.firstRealmTimerSaved = sharedData.timers.firstRealmTimer;
}

// Método para restaurar o tempo restante do firstRealm ao voltar do AltRealm
function restoreFirstRealmTimer() {
    if (sharedData.firstRealmTimerSaved !== undefined) {
        sharedData.timers.firstRealmTimer = sharedData.firstRealmTimerSaved;
        delete sharedData.firstRealmTimerSaved; // Remover a versão salva
    }
}