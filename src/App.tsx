import { useState } from 'react'
import './app.css'
import Button from './components/button'
import { CloseIcon } from './components/icons'
import Modal from './components/modal'
import GameBoard from './game-board'
import HelpContent from './help-content'

function App() {
  const [showHelp, setShowHelp] = useState(false)
  return (
    <div className="app">
      <header className="app__header">
        <h1>Game of Life</h1>
        <a
          href="#"
          aria-label="game help"
          onClick={() => setShowHelp((curr) => !curr)}
          className="app__help"
        >
          what is this?
        </a>
        {showHelp && (
          <Modal onClose={() => setShowHelp(false)}>
            <Button
              onClick={() => setShowHelp(false)}
              className="close__modal-button"
            >
              <CloseIcon />
            </Button>
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
