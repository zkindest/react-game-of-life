import {
  defaultDebounceInterval,
  largeScreenCellSize,
  maxBoardHeight,
  maxBoardWidth,
  smallScreenCellSize,
} from './config'
import { GameBoardState } from './types'

export const getCellSize = () =>
  typeof window !== 'undefined' && window.innerWidth >= 500
    ? largeScreenCellSize
    : smallScreenCellSize

export const getAliveNeighboursCount = (
  cells: GameBoardState['cells'],
  row: number,
  column: number,
  totalRows: number,
  totalCols: number
) => {
  let count = 0

  let north = row === 0 ? totalRows - 1 : row - 1

  let south = row === totalRows - 1 ? 0 : row + 1

  let west = column === 0 ? totalCols - 1 : column - 1

  let east = column === totalCols - 1 ? 0 : column + 1

  count += Number(cells[north][west])

  count += Number(cells[north][column])

  count += Number(cells[north][east])

  count += Number(cells[row][west])

  count += Number(cells[row][east])

  count += Number(cells[south][west])

  count += Number(cells[south][column])

  count += Number(cells[south][east])

  return count
}

export const areAllCellsDead = (cells: GameBoardState['cells']) => {
  return cells.every((row) => row.every((cell) => !cell))
}

export const generateNewUniverse = (random = true): GameBoardState['cells'] => {
  /**
   * generates cells[][] with all "false" if "random" not specified, otherwise fills it with random boolean values
   */
  const rows = Math.floor(
    Math.min(window.innerHeight - 250, maxBoardHeight) / getCellSize()
  )
  const columns = Math.floor(
    Math.min(window.innerWidth, maxBoardWidth) / getCellSize()
  )

  let cells: GameBoardState['cells'] = new Array(rows)
    .fill(null)
    .map(() => new Array(columns).fill(false))

  if (random) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        cells[row][col] = Math.random() < 0.7 ? false : true
      }
    }
    return cells
  } else {
    return cells
  }
}

export const generateNewFrame = (cells: GameBoardState['cells']) => {
  const next = generateNewUniverse()
  const totalRows = cells.length
  const totalCols = cells[0].length

  for (let row = 0; row < totalRows; row++) {
    for (let column = 0; column < totalCols; column++) {
      const cellState = cells[row][column]
      let live_neighbours = getAliveNeighboursCount(
        cells,
        row,
        column,
        totalRows,
        totalCols
      )

      //Rule 1: any live cell with fewer than two live neighbours dies, as if caused by underpopulation
      if (cellState === true && live_neighbours < 2) {
        next[row][column] = false
      }
      //Rule 2 : Any live cell with two or three live neighbours lives on to the next generation
      else if (cellState === true && live_neighbours <= 3) {
        next[row][column] = true
      }
      //Rule 3: Any live cell with more than three live neighbours dies,as if by overpopulation
      else if (cellState === true && live_neighbours > 3) {
        next[row][column] = false
      }
      //Rule 4: Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction
      else if (cellState === false && live_neighbours === 3) {
        next[row][column] = true
      } else {
        next[row][column] = cellState
      }
    }
  }
  return next
}
export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = defaultDebounceInterval
) {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
