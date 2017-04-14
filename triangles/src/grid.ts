import Camera from './camera';

import coords from './coords';


const COORD_INDEX:{[key:number]:{[key:number]: string}} = {};


const CHUNK_SIZE = 64;

export default class Grid<T> {
  private count:number;
  private grid:{[key:string]: {coord: {x:number, y:number}, value: T}};
  private chunks:{[key:string]: {
    coord:{x:number, y:number},
    count:number,
    data:{[key:string]: {coord: {x:number, y:number}, value: T}}}};

  constructor() {
    this.count = 0;
    this.grid = {};
    this.chunks = {};
  }

  getCount() { return this.count; }

  private getKey(x:number, y:number) {
    x = x|0;
    y = y|0;
    return JSON.stringify([x, y]);
    // let a = COORD_INDEX[x];
    // if (a != null) {
    //   let b = a[y];
    //   if (b != null) {
    //     return b;
    //   }
    // }
    // let result = x + '/' + y;//[x, y].join('/');
    // if (!(x in COORD_INDEX)) {
    //   COORD_INDEX[x] = {};
    // }
    // return COORD_INDEX[x][y] = result;
  }

  private getChunkCoord(x:number, y:number):{x:number, y:number} {
    return {x: Math.floor(x / CHUNK_SIZE),
            y: Math.floor(y / CHUNK_SIZE)}
  }

  get(x:number, y:number):T|null {
    let chunkCoord = this.getChunkCoord(x, y);
    let chunkKey = this.getKey(chunkCoord.x, chunkCoord.y);
    let chunk = this.chunks[chunkKey];
    if (chunk == null) return null;
    let cell = chunk.data[this.getKey(x, y)];
    return cell && cell.value;
    // let value = this.grid[this.getKey(x, y)];
    // return value && value.value;
  }

  set(value:T|null, x:number, y:number) {
    // let key = this.getKey(x, y);
    // if (value == null) {
    //   if (key in this.grid) {
    //     delete this.grid[key];
    //   }
    // } else {
    //   this.grid[key] = {coord:{x, y}, value: value};
    // }
    let key = this.getKey(x, y);
    let chunkCoord = this.getChunkCoord(x, y);
    let chunkKey = this.getKey(chunkCoord.x, chunkCoord.y);
    if (value != null) {
      if (!(chunkKey in this.chunks)) {
        this.chunks[chunkKey] = {coord: chunkCoord, count: 0, data: {}};
      }
      let chunk = this.chunks[chunkKey];
      if (!(key in chunk.data)) {
        chunk.count++;
        this.count++;
      }
      chunk.data[key] = {coord:{x, y}, value: value};
    } else {
      if (chunkKey in this.chunks) {
        let chunk = this.chunks[chunkKey];
        if (key in chunk.data) {
          chunk.count--;
          this.count--;
        }
        if (chunk.count > 0) {
          delete chunk.data[key];
        } else {
          delete this.chunks[chunkKey];
        }
      }
    }
    // let chunk = this.chunks[chunkKey];
    // if (value == null)
  }

  map(f:(value:T, x:number, y:number) => void) {
    for (let key in this.grid) {
      let value = this.grid[key];
      let coord = value.coord;
      f(value.value, coord.x, coord.y);
    }
  }

  filteredMap(min:{x:number, y:number}, max:{x:number, y:number},
              f:(value:T, x:number, y:number) => void) {
    // TODO: Index the grid or something. It's pretty inefficient.
    let startChunkCoord = this.getChunkCoord(min.x, min.y);
    let endChunkCoord = this.getChunkCoord(max.x, max.y);
    endChunkCoord.x++;
    endChunkCoord.y++;
    for (let chunkKey in this.chunks) {
      let chunk = this.chunks[chunkKey];
      let chunkCoord = chunk.coord;
      if (startChunkCoord.x <= chunkCoord.x && chunkCoord.x <= endChunkCoord.x &&
          startChunkCoord.y <= chunkCoord.y && chunkCoord.y <= endChunkCoord.y) {
        for (let key in chunk.data) {
          let value = chunk.data[key];
          let coord = value.coord;
          if (min.x <= coord.x && coord.x < max.x &&
              min.y <= coord.y && coord.y < max.y) {
            f(value.value, coord.x, coord.y);
          }
        }
      }
    }
    // for (let key in this.grid) {
    //   let value = this.grid[key];
    //   let coord = value.coord;
    //   if (min.x <= coord.x && coord.x < max.x &&
    //       min.y <= coord.y && coord.y < max.y) {
    //     f(value.value, coord.x, coord.y);
    //   }
    // }

  }

  getDirectNeighbors(x:number, y:number) {
    let dc = (dx:number, dy:number) => {return {x: x + dx, y: y + dy}};
    let neighbors = [dc(0, -1), dc(0, 1)];
    if (Math.abs(x % 2) === Math.abs(y % 2)) {
      neighbors.push(dc(-1, 0));
    } else {
      neighbors.push(dc(1, 0));
    }
    return neighbors;
  }

  getNeighbors(x:number, y:number) {
    let dc = (dx:number, dy:number) => {return {x: x + dx, y: y + dy}};
    let neighbors = [
      dc(-1, 0), dc(-1, -1), dc(0, -1),
      dc(1, -1), dc(1, 0), dc(1, 1),
      dc(0, 1), dc(-1, 1),
      dc(0, -2), dc(0, 2)
    ];
    if (Math.abs(x % 2) === Math.abs(y % 2)) {
      neighbors.push(dc(-1, -2));
      neighbors.push(dc(-1, 2));
    } else {
      neighbors.push(dc(1, -2));
      neighbors.push(dc(1, 2));
    }
    return neighbors;
  }
}
