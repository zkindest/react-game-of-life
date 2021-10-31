import { Pos2D } from "./types";

class Universe {
  private cells: boolean[];
  private width: number;
  private height: number;
  private size: number;
  constructor(width = 32, height = 32, random = true) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.size = width * height;

    this.setSize(width, height, random);
  }
  getHeight() {
    return this.height;
  }
  getWidth() {
    return this.width;
  }
  setSize(width?: number, height?: number, random: boolean = true) {
    this.width = width ? width : this.width;
    this.height = height ? height : this.height;
    this.size = this.width * this.height;

    if (random) {
      this.setRandom();
    }
    else {
      this.reset();
    }
  }
  getSize(): number {
    return this.size;
  }
  reset() {
    this.cells = Array(this.size).fill(false);
  }
  setRandom() {
    this.cells = Array(this.size).fill(null).map(() => Math.random() > 0.7 ? true : false)
  }
  toggleCell(row: number, column: number) {
    let index = this.getIndex(row, column);
    let value = this.cells[index];
    this.cells[index] = !value;
  }
  isEmpty() {
    return this.cells.every((cell) => cell === false);
  }
  getIndex(row: number, column: number) {
    return row * this.width + column;
  }
  liveNeighbourCount(row: number, column: number) {
    let count = 0;

    let north = row === 0 ? this.height - 1 : row - 1;

    let south = row === this.height - 1 ? 0 : row + 1;

    let west = column === 0 ? this.width - 1 : column - 1;

    let east = column === this.width - 1 ? 0 : column + 1;

    let nw = this.getIndex(north, west);
    count += Number(this.cells[nw]);

    let n = this.getIndex(north, column);
    count += Number(this.cells[n]);

    let ne = this.getIndex(north, east);
    count += Number(this.cells[ne]);

    let w = this.getIndex(row, west);
    count += Number(this.cells[w]);

    let e = this.getIndex(row, east);
    count += Number(this.cells[e]);

    let sw = this.getIndex(south, west);
    count += Number(this.cells[sw]);

    let s = this.getIndex(south, column);
    count += Number(this.cells[s]);

    let se = this.getIndex(south, east);
    count += Number(this.cells[se]);

    return count;
  }
  tick() {
    let next = [...this.cells];
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let idx = this.getIndex(row, column);
        let cell = this.cells[idx];
        let live_neighbours = this.liveNeighbourCount(row, column);

        //Rule 1: any live cell with fewer than two live neighbours dies, as if caused by underpopulation
        if (cell === true && live_neighbours < 2) {
          next[idx] = false;
        }
        //Rule 2 : Any live cell with two or three live neighbours lives on to the next generation
        else if (cell === true && live_neighbours <= 3) {
          next[idx] = true;
        }
        //Rule 3: Any live cell with more than three live neighbours dies,as if by overpopulation
        else if (cell === true && live_neighbours > 3) {
          next[idx] = false;
        }
        //Rule 4: Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction
        else if (cell === false && live_neighbours === 3) {
          next[idx] = true;
        }
      }
    }
    this.cells = next;
  }
  setCells(arr: Pos2D[]) {
    for (let i = 0; i < arr.length; i++) {
      let idx = this.getIndex(arr[i][0], arr[i][1])
      this.cells[idx] = true;
    }
  }
  getCells() {
    return this.cells;
  }
  print() {
    let rows = [];
    for (let row = 0; row < this.height; row++) {
      let rowString = ''
      for (let column = 0; column < this.width; column++) {
        let idx = this.getIndex(row, column);
        if (this.cells[idx]) {
          rowString += ' x '
        } else {
          rowString += ' o '
        }
      }
      rows.push(rowString);
    }
    console.log(rows.join('\n') + "\n");
  }
}

export default Universe;