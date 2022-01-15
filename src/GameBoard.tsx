import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import Controls from './Controls';
import { ControlsAction, ControlsState, GameBoardAction, GameBoardState } from './types';
import { areAllCellsDead, debounce, generateNewUniverse, getAliveNeighboursCount, getCellSize } from './utils';

const Cell = React.memo(({ row, col, isAlive, handleClick }: { row: number, col: number, isAlive: boolean, handleClick: (row: number, col: number) => void }) => {
  return (
    <button
      onClick={() => handleClick(row, col)}
      className={`cell ${isAlive ? 'cell-active' : ''}`}
      style={{ height: getCellSize(), width: getCellSize() }}
      type="button"
    ></button>
  )
})

const gameBoardreducer = (state: GameBoardState, action: GameBoardAction): GameBoardState => {
  switch (action.type) {
    case "init": {
      return { cells: generateNewUniverse(action.payload.random), genCount: 0 }
    }
    case "toggle_cell": {
      const cells = state.cells;
      const newCellState = !cells[action.payload.row][action.payload.col]

      const updatedCells = [
        ...cells.slice(0, action.payload.row),
        [
          ...cells[action.payload.row].slice(0, action.payload.col),
          newCellState,
          ...cells[action.payload.row].slice(action.payload.col + 1)
        ],
        ...cells.slice(action.payload.row + 1)
      ]
      return { ...state, cells: updatedCells }
    }
    case "generate_next_frame": {
      const next = generateNewUniverse();
      const { cells, genCount } = state;
      const totalRows = cells.length;
      const totalCols = cells[0].length;

      for (let row = 0; row < totalRows; row++) {
        for (let column = 0; column < totalCols; column++) {
          const cellState = cells[row][column];
          let live_neighbours = getAliveNeighboursCount(cells, row, column, totalRows, totalCols);

          //Rule 1: any live cell with fewer than two live neighbours dies, as if caused by underpopulation
          if (cellState === true && live_neighbours < 2) {
            next[row][column] = false;
          }
          //Rule 2 : Any live cell with two or three live neighbours lives on to the next generation
          else if (cellState === true && live_neighbours <= 3) {
            next[row][column] = true;
          }
          //Rule 3: Any live cell with more than three live neighbours dies,as if by overpopulation
          else if (cellState === true && live_neighbours > 3) {
            next[row][column] = false;
          }
          //Rule 4: Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction
          else if (cellState === false && live_neighbours === 3) {
            next[row][column] = true;
          }
          else {
            next[row][column] = cellState;
          }
        }
      }
      return {
        cells: next, genCount: genCount + 1
      }
    }
    default:
      return state;
  }
}

const controlsReducer = (state: ControlsState, action: ControlsAction) => {
  switch (action.type) {
    case 'set-play':
      return { ...state, isPlaying: action.payload }
    case 'toggle-play':
      return { ...state, isPlaying: !state.isPlaying }
    case 'auto-option-change':
      return { ...state, autoPlay: action.payload, isPlaying: false }
    case 'gps-change':
      return { ...state, generationsPerSecond: action.payload }
    case 'step-next':
      return { ...state, stepNext: !state.stepNext }
    case 'reset':
      return { ...state, isPlaying: false, reset: !state.reset }
    default:
      return state
  }
}

const GameBoard = () => {

  const [{ cells, genCount }, gameBoardDispatch] = useReducer(gameBoardreducer, {
    cells: [],
    genCount: 0
  })
  const [{ isPlaying, generationsPerSecond, autoPlay, stepNext }, controlsDispatch] = useReducer(controlsReducer, {
    isPlaying: false,
    generationsPerSecond: 10,
    autoPlay: true,
    stepNext: false,
    reset: false
  })

  const animationIdRef = useRef<number | undefined>();

  let now: number, then: number, elapsed: number, gpsInterval: number;

  const renderLoop = () => {
    animationIdRef.current = requestAnimationFrame(renderLoop);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > gpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified gpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % gpsInterval!);

      gameBoardDispatch({ type: "generate_next_frame" })
    }
  }

  const handleCellClick = useCallback((row: number, col: number) => {
    gameBoardDispatch({ type: "toggle_cell", payload: { row, col } })
  }, []);

  const play = () => {
    if (areAllCellsDead(cells)) {
      pause();
      controlsDispatch({ type: 'set-play', payload: false });
      alert('There is no life in current universe! click on 🔀 to generate random life!!');
      return;
    }
    // if we want 10 generation per 1000ms(1 sec), how much time should one generation should take?
    gpsInterval = 1000 / generationsPerSecond;
    then = Date.now();
    renderLoop();
  }

  const pause = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
    }
  }

  useEffect(() => {
    if (isPlaying && autoPlay) {
      play();
    } else {
      pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!autoPlay) {
      if (areAllCellsDead(cells)) {
        alert('There is no life in current universe! click on 🔀 to generate random life!!');
        return;
      }
      gameBoardDispatch({ type: "generate_next_frame" });
    }
  }, [stepNext])

  useEffect(() => {
    if (isPlaying) {
      pause();
      play();
    }
  }, [generationsPerSecond])


  useEffect(() => {
    const handleResize = () => {
      if (isPlaying) {
        pause();
      }
      gameBoardDispatch({ type: "init", payload: { random: true } })
    }

    window.addEventListener('resize', debounce(handleResize, 200))

    // load initial board
    gameBoardDispatch({ type: "init", payload: { random: true } })

    return () => {
      window.addEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="board-container">
      <div className="cells-container">
        {
          cells.map((row, i) => {
            return (
              <div className="cells-row" key={i}>
                {
                  row.map((val, j) => {
                    return (
                      <Cell row={i} col={j} key={`${i}-${j}`} isAlive={val} handleClick={handleCellClick} />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
      <Controls
        controlsDispatch={controlsDispatch}
        gameBoardDispatch={gameBoardDispatch}
        generationsPerSecond={generationsPerSecond}
        isAuto={autoPlay}
        isPlaying={isPlaying}
        genCount={genCount}
      />
    </div>
  )
}

export default GameBoard;
