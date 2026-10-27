import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// 1. Your Free Firebase Configuration (Get this from ://google.com)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_://firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_://firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_://appspot.com",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function GameBoard() {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [playerRole, setPlayerRole] = useState('host'); // 'host' or 'guest'

  // The Force Table Core Game State Structure
  const [board, setBoard] = useState({
    hostGround: [],
    hostSpace: [],
    hostResources: 0,
    guestGround: [],
    guestSpace: [],
    guestResources: 0
  });

  // Connect to the live game room
  const joinRoom = () => {
    if (!roomId) return alert("Enter a Room ID first!");
    setIsJoined(true);

    const roomRef = ref(db, 'rooms/' + roomId);
    onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBoard(data);
      }
    });
  };

  // Send updates to your friend whenever you make a move
  const updateCloudBoard = (newBoardState) => {
    setBoard(newBoardState);
    if (isJoined) {
      set(ref(db, 'rooms/' + roomId), newBoardState);
    }
  };

  // Example Action: Resource a card
  const addResource = () => {
    const updated = { ...board };
    if (playerRole === 'host') {
      updated.hostResources += 1;
    } else {
      updated.guestResources += 1;
    }
    updateCloudBoard(updated);
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Connection Panel */}
      {!isJoined ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', background: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
          <h2>SWU School Simulator</h2>
          <input 
            placeholder="Create or Enter Room ID" 
            value={roomId} 
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: '10px', width: '80%', marginBottom: '10px', borderRadius: '4px', border: 'none' }}
          />
          <div>
            <button onClick={() => { setPlayerRole('host'); joinRoom(); }} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Host Game</button>
            <button onClick={() => { setPlayerRole('guest'); joinRoom(); }} style={{ padding: '10px 20px', cursor: 'pointer' }}>Join Game</button>
          </div>
        </div>
      ) : (
        /* The Force Table Structured Layout Grid */
        <div>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>Playing in Room: <strong>{roomId}</strong> | Role: {playerRole}</div>
          
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* OPPONENT SIDE */}
            <div style={{ border: '2px dashed #444', padding: '15px', borderRadius: '8px', background: '#222' }}>
              <h3>Opponent Arena (Space & Ground)</h3>
              <p>Resources: {playerRole === 'host' ? board.guestResources : board.hostResources}</p>
              {/* Opponent cards will render here dynamically */}
            </div>

            {/* YOUR SIDE */}
            <div style={{ border: '2px solid #00d2ff', padding: '15px', borderRadius: '8px', background: '#222' }}>
              <h3>Your Arena</h3>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 1, minHeight: '100px', background: '#2d2d2d', padding: '10px', borderRadius: '4px' }}>
                  <h4>Ground Zone</h4>
                </div>
                <div style={{ flex: 1, minHeight: '100px', background: '#2d2d2d', padding: '10px', borderRadius: '4px' }}>
                  <h4>Space Zone</h4>
                </div>
              </div>
              
              {/* Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Your Resources: {playerRole === 'host' ? board.hostResources : board.guestResources}</p>
                <button onClick={addResource} style={{ padding: '8px 16px', background: '#00d2ff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  + Put Card in Resource
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
