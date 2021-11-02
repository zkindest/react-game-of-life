import React, { ChangeEvent } from 'react';
import Controls from './Controls';

const getCellSize = () =>
  typeof window !== "undefined" && window.innerWidth >= 500 ? 24 : 40;


function debounce<Params extends any[]>(func: (...args: Params) => any, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(...args) }, timeout);
  };
}

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

type CellState = {
  cells: boolean[][],
  genCount: number
}

type Action = | {
  type: "init";
  random?: boolean
} | {
  type: "toggle_cell";
  row: number;
  col: number;
} | {
  type: 'generate_next_frame';
};

const getAliveNeighboursCount = (cells: CellState['cells'], row: number, column: number, totalRows: number, totalCols: number) => {
  let count = 0;

  let north = row === 0 ? totalRows - 1 : row - 1;

  let south = row === totalRows - 1 ? 0 : row + 1;

  let west = column === 0 ? totalCols - 1 : column - 1;

  let east = column === totalCols - 1 ? 0 : column + 1;

  count += Number(cells[north][west]);

  count += Number(cells[north][column]);

  count += Number(cells[north][east]);

  count += Number(cells[row][west]);

  count += Number(cells[row][east]);

  count += Number(cells[south][west]);

  count += Number(cells[south][column]);

  count += Number(cells[south][east]);

  return count;
}

const areAllCellsDead = (cells: CellState['cells']) => {
  return cells.every((row) => row.every((cell) => !cell));
}
const generateNewUniverse = (random = true): CellState['cells'] => {
  const rows = Math.floor(Math.min(window.innerHeight - 250, 1200) / getCellSize());
  const columns = Math.floor(Math.min(window.innerWidth, 1200) / getCellSize());

  let cells: CellState['cells'] = new Array(rows).fill(null).map(() => new Array(columns).fill(false));

  if (random) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {

        cells[row][col] = Math.random() < 0.7 ? false : true;
      }
    }
    return cells;
  } else {
    return cells
  }
}

const reducer = (state: CellState, action: Action): CellState => {
  switch (action.type) {
    case "init": {
      return { cells: generateNewUniverse(action.random), genCount: 0 }
    }
    case "toggle_cell": {
      const cells = state.cells;
      const newCellState = !cells[action.row][action.col]

      const updatedCells = [
        ...cells.slice(0, action.row),
        [
          ...cells[action.row].slice(0, action.col),
          newCellState,
          ...cells[action.row].slice(action.col + 1)
        ],
        ...cells.slice(action.row + 1)
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

const GameBoard = () => {

  const [{ cells, genCount }, dispatch] = React.useReducer(reducer, {
    cells: [],
    genCount: 0
  })
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [fps, setFps] = React.useState(10);
  const [auto, setAuto] = React.useState(true);

  const animationIdRef = React.useRef<number | undefined>();

  let now: number, then: number, elapsed: number, fpsInterval: number;

  const renderLoop = () => {
    animationIdRef.current = requestAnimationFrame(renderLoop);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % fpsInterval!);

      dispatch({ type: "generate_next_frame" })
    }
  }

  const handleCellClick = React.useCallback((row: number, col: number) => {
    dispatch({ type: "toggle_cell", row, col })
  }, []);

  const play = () => {
    if (areAllCellsDead(cells)) {
      alert('There is no life in current universe! click on 🔀 to generate random life!!');
      return;
    }

    setIsPlaying(true);

    fpsInterval = 1000 / fps;
    then = Date.now();
    renderLoop();
  }

  const pause = () => {
    setIsPlaying(false);

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
    }
  }

  const isPaused = () => {
    return !animationIdRef.current;
  };


  const handlePlay = () => {
    if (areAllCellsDead(cells)) {
      pause();
      alert('There is no life in current universe! click on 🔀 to generate random life!!');
      return;
    }
    if (!auto) {
      dispatch({ type: "generate_next_frame" })
      return;
    }
    if (isPaused()) {
      play();
    } else {
      pause();
    }
  }

  const handleGPSChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // handles regeneration interval change
    const newFPS = Number(e.target.value);
    setFps(newFPS)

    if (!isPaused()) {
      pause();
      play();
    }
  }
  const handleAutoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isAuto = e.target.checked;
    setAuto(isAuto)
    if (!isAuto) {
      pause();
    }
  }

  const handleReset = () => {
    if (!isPaused()) {
      pause();
    }

    if (areAllCellsDead(cells)) {
      alert('There is no life in current universe! click on 🔀 to generate random life!!');
      return;
    }

    dispatch({ type: "init", random: false })
  }
  const handleRandomGeneration = () => {
    if (!isPaused()) {
      pause();
    }
    dispatch({ type: "init" })
  }

  React.useEffect(() => {
    const handleResize = () => {

      if (!isPaused()) {
        pause();
      }
      dispatch({ type: "init", random: true })
    }
    window.addEventListener('resize', debounce(handleResize, 200))
    return () => {
      window.addEventListener('resize', handleResize)
    }
  }, [])

  React.useEffect(() => {
    dispatch({ type: "init", random: true })
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
        handlePlay={handlePlay}
        handleGPS={handleGPSChange}
        handleAuto={handleAutoChange}
        handleRandom={handleRandomGeneration}
        handleReset={handleReset}
        isAuto={auto}
        isPlaying={isPlaying}
        genCount={genCount}
      />
    </div>
  )
}

export default GameBoard;