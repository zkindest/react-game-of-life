import { useState } from 'react'
import './App.css'
import Modal from './components/modal'
import GameBoard from './GameBoard'
import HelpContent from './HelpContent'

function App() {
  const [showHelp, setShowHelp] = useState(false)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Game of Life</h1>
        <a
          href="javascript:void(0)"
          aria-label="game help"
          onClick={() => setShowHelp((curr) => !curr)}
          className="help"
        >
          what is this?
        </a>
        {showHelp && (
          <Modal onClose={() => setShowHelp(false)}>
            <HelpContent />
          </Modal>
        )}
      </header>
      <div>
        <GameBoard />
      </div>
    </div>
  )
}

export default App
