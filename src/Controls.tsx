import { ChangeEvent, Dispatch } from "react";
import { GameBoardAction } from "./types";

interface ControlProps {
  genCount: number;
  generationsPerSecond: number;
  isPlaying: boolean;
  isAuto: boolean;
  dispatch: Dispatch<GameBoardAction>
}
const Controls = ({
  genCount,
  isPlaying,
  isAuto,
  generationsPerSecond,
  dispatch
}: ControlProps) => {

  const handleGPSChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // handles regeneration interval change
    dispatch({ type: 'gps-change', payload: Number(e.target.value) })
  };

  const handleAutoChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'auto-option-change', payload: e.target.checked })
  }
  const handleStep = () => {
    dispatch({ type: "step-next" });
  }
  const handleReset = () => {
    dispatch({ type: 'reset' });
  }
  const handleRandomGeneration = () => {
    dispatch({ type: 'stop-and-set-random' });
  }
  const handlePlay = () => {
    dispatch({ type: "toggle-play" });
  }
  return (
    <div className="controls">
      <div title="generation cycle count">
        <span>Generations:</span>
        <span className="generations" id="gen-count">{genCount}</span>
      </div>
      {
        isAuto ? (
          <button onClick={handlePlay} className="button" title="toggle play">
            {isPlaying ? "⏸" : '▶'}
          </button>
        ) : (
          <button className="button" title="step forward once" onClick={handleStep}>⏭</button>
        )
      }
      <div className="select" title="control generations per second">
        <label htmlFor="fps">gps:</label>
        <select value={generationsPerSecond} onChange={handleGPSChange}>
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className="checkbox" title="auto generate cells at selected gps">
        <label htmlFor="auto">Auto</label>
        <input type="checkbox" id="auto" defaultChecked onChange={handleAutoChange} />
      </div>
      <button id="reset" className="button" title="kill all cells and reset generations to zero" onClick={handleReset}>🔄</button>
      <button id="random" className="button" title="randomly generate cells" onClick={handleRandomGeneration}>🔀</button>
    </div>
  )
}

export default Controls;