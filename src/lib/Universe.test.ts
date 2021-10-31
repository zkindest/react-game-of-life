import Universe from "./Universe";

import { Pos2D } from "./types";

const genAllPositions = (width: number, height: number): Pos2D[] => {
  let indexes: Pos2D[] = [];
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      indexes.push([i, j])
    }
  }
  return indexes;
}
test('initialization and set cells', () => {
  let universe = new Universe(6, 6, false);
  let alivePos1 = [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]] as Pos2D[];
  universe.setCells(alivePos1);

  expect(universe.getSize()).toBe(36);

  let cells = universe.getCells();
  let positions = genAllPositions(6, 6);
  let alivePos2: Pos2D[] = [];
  positions.forEach((pos) => {
    let index = universe.getIndex(pos[0], pos[1]);
    if (cells[index]) {
      alivePos2.push(pos)
    }
  })
  expect(alivePos1).toEqual(alivePos2)
})

test('check universe tick', () => {
  let inputUniverse = new Universe(6, 6, false);
  inputUniverse.setCells([[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]]);

  let outputUniverse = new Universe(6, 6, false);
  outputUniverse.setCells([[2, 1], [2, 3], [3, 2], [3, 3], [4, 2]])

  inputUniverse.tick();

  expect(inputUniverse.getCells()).toEqual(outputUniverse.getCells())
})