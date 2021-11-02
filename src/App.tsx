import React from 'react';
import './App.css';
import GameBoard from './GameBoard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Game of Life
        </h1>
      </header>
      <div>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
