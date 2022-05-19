import { GameBoardState } from './types'

// Generations per second
export const GPSOptions = ['1', '5', '10', '15', '20']

export const initialGameSettings: GameBoardState = {
  cells: [],
  genCount: 0,
  isPlaying: false,
  generationsPerSecond: 10,
  autoPlay: true,
  stepNext: false,
}

// window.innerWidth >= 500
export const largeScreenCellSize = 26

// window.innerWidth < 500
export const smallScreenCellSize = 40

// Maximum Board height
export const maxBoardHeight = 1200

// Maximum Board width
export const maxBoardWidth = 1200

// default debounce interval (in milliseconds)
export const defaultDebounceInterval = 300
