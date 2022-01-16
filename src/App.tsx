import { useState } from 'react';
import './App.css';
import Button from './components/Button';
import { Help } from './components/Icons';
import Modal from './components/Modal';
import GameBoard from './GameBoard';
import HelpContent from './HelpContent';

function App() {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Game of Life
        </h1>
        <Button aria-label="game help" onClick={() => setShowHelp((curr) => !curr)}>
          <Help />
        </Button>
        {
          showHelp && (
            <Modal onClose={() => setShowHelp(false)}>
              <HelpContent />
            </Modal>
          )
        }
      </header>
      <div>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
