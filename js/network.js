let peer;
let conn;

document.getElementById('create-room').addEventListener('click', () => {
    // Initialize peer server connection
    peer = new Peer(); 
    
    peer.on('open', (id) => {
        alert("Give this Room ID to your friend: " + id);
        console.log('My peer ID is: ' + id);
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupNetworkListeners();
        startGameMode();
    });
});

document.getElementById('join-room').addEventListener('click', () => {
    const targetId = document.getElementById('room-id').value;
    peer = new Peer();
    
    peer.on('open', () => {
        conn = peer.connect(targetId);
        setupNetworkListeners();
        startGameMode();
    });
});

function setupNetworkListeners() {
    conn.on('open', () => {
        console.log("Connected to your friend!");
    });
    
    conn.on('data', (data) => {
        // Force Table Style: Update board when opponent makes a move
        handleOpponentAction(data);
    });
}

function sendGameMove(actionType, cardId, targetArena) {
    if (conn && conn.open) {
        conn.send({ type: actionType, card: cardId, arena: targetArena });
    }
}

function startGameMode() {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-board').style.display = 'grid';
}
