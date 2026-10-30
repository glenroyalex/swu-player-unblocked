let gameState = {
    myHealth: 30,
    enemyHealth: 30,
    resources: 0,
    exhaustedResources: 0,
    hand: [],
    groundUnits: [],
    spaceUnits: []
};

// Function to simulate drawing a card
function drawCard(cardData) {
    gameState.hand.push(cardData);
    renderHand();
}

// Function to play a unit card (Checks arena classification)
function playUnit(cardIndex, arenaType) {
    let card = gameState.hand[cardIndex];
    
    if(arenaType === 'ground') {
        gameState.groundUnits.push(card);
    } else {
        gameState.spaceUnits.push(card);
    }
    
    gameState.hand.splice(cardIndex, 1);
    
    // Notify opponent over WebRTC
    sendGameMove('PLAY_UNIT', card.id, arenaType);
    renderBoard();
}

function handleOpponentAction(data) {
    if (data.type === 'PLAY_UNIT') {
        // Logic to draw opponent's card dynamically on the top half of your screen
        console.log("Opponent played a card to: ", data.arena);
    }
}

function renderHand() {
    const handDiv = document.getElementById('player-hand');
    handDiv.innerHTML = '';
    gameState.hand.forEach((card, index) => {
        let cardEl = document.createElement('div');
        cardEl.className = 'card-ui';
        cardEl.innerText = card.name;
        cardEl.onclick = () => playUnit(index, card.type === 'SpaceUnit' ? 'space' : 'ground');
        handDiv.appendChild(cardEl);
    });
}
