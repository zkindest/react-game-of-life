interface ControlProps {
  handlePlay: () => void;
  handleGPS: (...args: any) => void;
  handleAuto: (...args: any) => void;
  handleRandom: () => void;
  handleReset: () => void;
  genCount: number;
  isPlaying: boolean;
  isAuto: boolean;
}
const Controls = ({
  handlePlay,
  handleGPS,
  handleAuto,
  handleRandom,
  handleReset,
  genCount,
  isPlaying,
  isAuto
}: ControlProps) => {
  return (
    <div className="controls">
      <div title="generation cycle count">
        <span>Generations:</span>
        <span className="generations" id="gen-count">{genCount}</span>
      </div>
      <button onClick={handlePlay} className="button" title="toggle play/pause">{isPlaying ? '⏸' : (isAuto ? '▶' : '⏭')}</button>
      <div className="select" title="control generations per second">
        <label htmlFor="fps">gps:</label>
        <select id="fps" defaultValue="10" onChange={handleGPS}>
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className="checkbox" title="auto generate cells at selected gps">
        <label htmlFor="auto">Auto</label>
        <input type="checkbox" id="auto" defaultChecked onChange={handleAuto} />
      </div>
      <button id="reset" className="button" title="kill all cells and reset generations to zero" onClick={handleReset}>🔄</button>
      <button id="random" className="button" title="randomly generate cells" onClick={handleRandom}>🔀</button>
    </div>
  )
}

export default Controls;