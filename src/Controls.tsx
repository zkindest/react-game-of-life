import { ChangeEvent, Dispatch, useState } from 'react'
import Button from './components/button'
import {
  PauseSVG,
  PlaySVG,
  Random,
  Reset,
  StepForwardSVG,
} from './components/icons'
import { GameBoardAction } from './types'
import Switch from './components/switch'
import Select from './components/select'
import { GPSOptions } from './config'

interface ControlProps {
  genCount: number
  generationsPerSecond: number
  isPlaying: boolean
  isAuto: boolean
  dispatch: Dispatch<GameBoardAction>
}
const Controls = ({
  genCount,
  isPlaying,
  isAuto,
  generationsPerSecond,
  dispatch,
}: ControlProps) => {
  const [auto, setAuto] = useState(true)

  const handleGPSChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // handles regeneration interval change
    dispatch({ type: 'gps-change', payload: Number(e.target.value) })
  }

  const handleAutoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = !auto
    setAuto(nextValue)
    dispatch({ type: 'auto-option-change', payload: nextValue })
  }
  const handleStep = () => {
    dispatch({ type: 'step-next' })
  }
  const handleReset = () => {
    dispatch({ type: 'reset' })
  }
  const handleRandomGeneration = () => {
    dispatch({ type: 'stop-and-set-random' })
  }
  const handlePlay = () => {
    dispatch({ type: 'toggle-play' })
  }
  return (
    <div className="controls">
      <div title="generation cycle count">
        <span>Generations:</span>
        <span className="generations" id="gen-count">
          {genCount}
        </span>
      </div>
      {isAuto ? (
        <Button onClick={handlePlay} className="button" title="toggle play">
          {isPlaying ? <PauseSVG /> : <PlaySVG />}
        </Button>
      ) : (
        <Button
          className="button"
          title="step forward once"
          onClick={handleStep}
          aria-label="step forward once"
        >
          {<StepForwardSVG />}
        </Button>
      )}
      <Button
        id="reset"
        className="button"
        title="kill all cells and reset generations to zero"
        aria-label="kill all cells and reset generations to zero"
        onClick={handleReset}
      >
        <Reset />
      </Button>
      <Button
        id="random"
        className="button"
        title="randomly generate cells"
        aria-label="randomly generate cells"
        onClick={handleRandomGeneration}
      >
        <Random />
      </Button>
      <Select
        label="gps"
        options={GPSOptions}
        onChange={handleGPSChange}
        value={generationsPerSecond}
        aria-label="control generations per second"
      />
      <Switch
        name="auto or manual"
        title="auto generate cells at selected gps"
        options={['auto', 'manual']}
        onChange={handleAutoChange}
        value={auto ? 'auto' : 'manual'}
      />
    </div>
  )
}

export default Controls
