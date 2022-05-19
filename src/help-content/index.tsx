import classes from './index.module.css'

const HelpContent = () => {
  return (
    <section className={classes.help}>
      <h2>Contents</h2>
      <ol>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#controls">Controls</a>
        </li>
      </ol>
      <br />
      <h3 id="about">About</h3>
      <p id="">
        The Game of Life, also known simply as Life, is a cellular automaton
        devised by the British mathematician John Horton Conway in 1970.It is a
        zero-player game, meaning that its evolution is determined by its
        initial state, requiring no further input. One interacts with the Game
        of Life by creating an initial configuration(by setting initial live
        cells i.e indicated by "skyblue" in app) and observing how it evolves.
      </p>
      <br />
      <p>
        The universe of the Game of Life is an infinite, two-dimensional
        orthogonal grid of square cells (for now small board that can fit in
        your mobile/Desktop, try Desktop for large universe), each of which is
        in one of two possible states, live or dead, (or populated and
        unpopulated, respectively). Every cell interacts with its eight
        neighbours, which are the cells that are horizontally, vertically, or
        diagonally adjacent. At each step in time, the following transitions
        occur:
      </p>
      <ol>
        <li>
          Any live cell <em>with fewer than two</em> live neighbours dies, as if
          by <strong>under-population</strong>.
        </li>
        <li>
          Any live cell <em>with two or three</em> live neighbours lives on to
          the next generation.
        </li>
        <li>
          Any live cell <em>with more than three</em> live neighbours dies, as
          if by <strong>over-population</strong>.
        </li>
        <li>
          Any dead cell <em>with exactly three</em> live neighbours becomes a
          live cell, as if by <strong>reproduction</strong>.
        </li>
      </ol>
      Here are some examples of initial{' '}
      <a
        href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life#Examples_of_patterns"
        target="_blank"
      >
        patterns
      </a>
      .
      <br />
      <br />
      <h3 id="controls">Controls</h3>
      <strong>Live cells (aka "Life"):</strong> cells with <i>blue-ish</i> color
      <br />
      <strong>Dead cells:</strong> cells with <i>no/white</i> color
      <br />
      <strong>Interaction:</strong> You can make any of the cells on board
      either alive or dead by clicking on it.
      <h4>Auto or Manual Generation</h4>
      <div className={classes.img__wrapper}>
        <img
          src="./controls_auto.png"
          alt="image of auto or manual generation control"
        />
      </div>
      Two Options:
      <ol>
        <li>
          <strong>Auto</strong> (default): will run the steps/generations
          automatically at a speed of{' '}
          <a href="#gps_1">Generations per second</a>.
        </li>
        <li>
          <strong>Manual</strong>: if selected, play button will change to{' '}
          <a href="#step">Step</a> button, used to generate next single
          step/generation.
        </li>
      </ol>
      <br />
      <h4 id="gps_1">Generations per Second (aka GPS)</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_gps.png" alt="A Select dropdown menu for GPS" />
      </div>
      <p>
        Provides an interface to select how fast generations/steps should
        happen.
      </p>
      <br />
      <h4>Generations Indicator</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_ge.png" alt="Generations indicator" />
      </div>
      <p>This is to indicate number of generations passed.</p>
      <br />
      <h4>Play</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_play.png" alt="image of play button" />
      </div>
      <p>
        Run the game at specified <a href="#gps_1">Generations per second</a>.
      </p>
      <br />
      <h4>Pause</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_pause.png" alt="image of pause button" />
      </div>
      <p>Pause the game.</p>
      <br />
      <h4 id="step">Step</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_step.png" alt="image of step button" />
      </div>
      <p>Generates next single step/generation of life.</p>
      <br />
      <h4>Reset</h4>
      <div className={classes.img__wrapper}>
        <img src="./controls_reset.png" alt="image of reset button" />
      </div>
      <p>Reset the game with no life on it.</p>
      <br />
      <h4>Random Generation of Life</h4>
      <div className={classes.img__wrapper}>
        <img
          src="./controls_random.png"
          alt="image of random generation button"
        />
      </div>
      <p>Randomly generate Life on board.</p>
      <br />
      <br />
      <br />
    </section>
  )
}

export default HelpContent
