import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { initialGameSettings } from '../config'
import Controls from '../controls'
import { GameBoardAction, GameBoardState } from '../types'
import {
  areAllCellsDead,
  debounce,
  generateNewFrame,
  generateNewUniverse,
  getCellSize,
} from '../utils'
import classes from './index.module.css'

const Cell = React.memo(
  ({
    row,
    col,
    isAlive,
    handleClick,
  }: {
    row: number
    col: number
    isAlive: boolean
    handleClick: (row: number, col: number) => void
  }) => {
    return (
      <button
        tabIndex={-1}
        onClick={() => handleClick(row, col)}
        className={`${classes.cell} ${isAlive ? classes.alive : ''}`}
        style={{ height: getCellSize(), width: getCellSize() }}
        type="button"
      ></button>
    )
  }
)

const gameBoardreducer = (
  state: GameBoardState,
  action: GameBoardAction
): GameBoardState => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        cells: generateNewUniverse(action.payload.random),
        genCount: 0,
      }
    }
    case 'toggle-cell': {
      const cells = state.cells
      const newCellState = !cells[action.payload.row][action.payload.col]

      const updatedCells = [
        ...cells.slice(0, action.payload.row),
        [
          ...cells[action.payload.row].slice(0, action.payload.col),
          newCellState,
          ...cells[action.payload.row].slice(action.payload.col + 1),
        ],
        ...cells.slice(action.payload.row + 1),
      ]
      return { ...state, cells: updatedCells }
    }
    case 'generate-next-frame': {
      return {
        ...state,
        cells: generateNewFrame(state.cells),
        genCount: state.genCount + 1,
      }
    }
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
      return {
        ...state,
        isPlaying: false,
        cells: generateNewUniverse(false),
        genCount: 0,
      }
    case 'stop-and-set-random':
      return {
        ...state,
        isPlaying: false,
        cells: generateNewUniverse(true),
      }
    default:
      return state
  }
}
const GameBoard = () => {
  const [
    { cells, genCount, isPlaying, generationsPerSecond, autoPlay, stepNext },
    dispatch,
  ] = useReducer(gameBoardreducer, initialGameSettings)

  const animationIdRef = useRef<number | undefined>()

  let now: number, then: number, elapsed: number, gpsInterval: number

  const renderLoop = () => {
    animationIdRef.current = requestAnimationFrame(renderLoop)

    // calc elapsed time since last loop
    now = Date.now()
    elapsed = now - then

    // if enough time has elapsed, draw the next frame
    if (elapsed > gpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified gpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % gpsInterval!)

      dispatch({ type: 'generate-next-frame' })
    }
  }

  const handleCellClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'toggle-cell', payload: { row, col } })
  }, [])

  const play = () => {
    if (areAllCellsDead(cells)) {
      pause()
      dispatch({ type: 'set-play', payload: false })
      alert(
        'There is no life in current universe! click on "random" button (dice like dotted button) or click on the cells to generate random life!!'
      )
      return
    }
    // if we want 10 generation per 1000ms(1 sec), how much time should one generation should take?
    gpsInterval = 1000 / generationsPerSecond
    then = Date.now()
    renderLoop()
  }

  const pause = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = undefined
    }
  }

  useEffect(() => {
    if (isPlaying && autoPlay) {
      play()
    } else {
      pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!autoPlay) {
      if (areAllCellsDead(cells)) {
        alert(
          'There is no life in current universe! click on "random" button (dice like dotted button) or click on the cells to generate random life!!'
        )
        return
      }
      dispatch({ type: 'generate-next-frame' })
    }
  }, [stepNext])

  useEffect(() => {
    if (isPlaying) {
      pause()
      play()
    }
  }, [generationsPerSecond])

  useEffect(() => {
    const handleResize = () => {
      if (isPlaying) {
        pause()
      }
      dispatch({ type: 'init', payload: { random: true } })
    }

    window.addEventListener('resize', debounce(handleResize, 200))

    // load initial board
    dispatch({ type: 'init', payload: { random: true } })

    return () => {
      window.addEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={classes['game-board']}>
      <div className={classes['game-board__inner']}>
        {cells.map((row, i) => {
          return (
            <div className={classes['game-board__row']} key={i}>
              {row.map((val, j) => {
                return (
                  <Cell
                    row={i}
                    col={j}
                    key={`${i}-${j}`}
                    isAlive={val}
                    handleClick={handleCellClick}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      <Controls
        dispatch={dispatch}
        generationsPerSecond={generationsPerSecond}
        isAuto={autoPlay}
        isPlaying={isPlaying}
        genCount={genCount}
      />
    </div>
  )
}

export default GameBoard
