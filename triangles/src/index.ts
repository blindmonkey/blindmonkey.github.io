import Camera from './camera';
import ColorSelectComponent from './color-select';
import Grid from './grid';
import GridViewModel from './grid-view-model';
import KeyInteractivity from './key-interactivity';
import MouseInteractivity from './mouse-interactivity';

import World from './world';
import { ToolsCollection } from './tools';

import colors from './colors';


class Params {
  private static params:{[key:string]: string} = (() => {
    let rawParams = location.href.split('?').slice(1).join('?').split('#')[0].split('&');
    let params = {};
    for (let param of rawParams) {
      let split = param.split('=');
      let key = split[0];
      let value = split.slice(1).join('=');
      params[key] = value;
    }
    return params;
  })();

  static number(key:string, defaultValue:number):number {
    let value = Number(this.params[key]);
    if (value == null || isNaN(value) || !isFinite(value)) {
      value = defaultValue;
    }
    return value;
  }

  static string(key:string, defaultValue:string):string {
    let value:string|null = this.params[key];
    if (value == null) {
      value = defaultValue;
    }
    return value;
  }
}


let weightedRandom = function<T>(list:Array<T>, weightFn:(T) => number) {
  if (list.length === 0) throw 'error';
  let totalWeight:number = 0;
  let weights:number[] = [];
  for (let item of list) {
    let weight = Math.abs(weightFn(item));
    totalWeight += weight;
    weights.push(weight);
  }
  let n = Math.random() * totalWeight;
  let cumulativeSum = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulativeSum += weights[i];
    if (n <= cumulativeSum) {
      return list[i];
    }
  }
  return list[list.length - 1];
};


let setStatus = function(status) {
  let statusDiv = document.getElementById('status');
  if (statusDiv != null) {
    statusDiv.textContent = status;
  }
};


let loop = function(f, dt) {
  requestAnimationFrame((dt) => loop(f, dt));
  f(dt);
};


type CellType = string;


window.onload = function() {


let canvas = <HTMLCanvasElement>document.getElementById('canvas');
let canvasWidth:number = canvas.width;
let canvasHeight:number = canvas.height;


//* Add/remove a '/' to/from the beginning of this line to switch modes

let context:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

let camera = new Camera(canvasWidth, canvasHeight);
camera.setZoom(1/96);


type HSLCell = {h:number, s:number, l:number, color?:string};
let grid:Grid<HSLCell> = new Grid<HSLCell>();
let renderer:GridViewModel<HSLCell> = new GridViewModel<HSLCell>(grid);


let dirtyCanvas = false;


let resize = function() {
  canvas.width = canvasWidth = window.innerWidth;
  canvas.height = canvasHeight = window.innerHeight;
  camera.resize(canvasWidth, canvasHeight);
  dirtyCanvas = true;
};
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
resize();

let getHslCellColor = function(cell:HSLCell):string {
  let color = cell.color;
  if (color == null) {
    let rgb = colors.hsvToRgb(cell.h, cell.s, cell.l);
    color = colors.rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  return color;
};

// grid.set({h: 0, s: 1, l: 1}, 0, 0);

let mod = function(n:number, m:number):number {
  let modded = n % m;
  if (n < 0) n += m;
  return n;
};
let clamp = function(n:number, min:number, max:number):number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};




let activeCells:{x:number, y:number}[] = [{x: 0, y: 0}];
let edgeCells:{x:number, y:number}[] = []

const INITIAL_LUM = 1;
const MAX_LUM = 0.4;
const MIN_LUM = Params.number('minlum', 0.75);
const LUM_DELTA = Params.number('lumdelta', -0.00001);-0.00005;0.0005;
let REPR_PROBABILITY = Params.number('repr', 0.005);0.1;0.20;0.0024;
const HUE_CHANGE = Params.number('huechange', 0.02);
const SAT_CHANGE = Params.number('satchange', 0.05);
const MIN_SAT = Params.number('minsat', 0.7);
const MAX_SAT = Params.number('maxsat', 1);

let getNeighbors = function(grid, x, y, viewRect) {
  let neighbors = grid.getDirectNeighbors(x, y);
  neighbors = neighbors.filter(
      (value:{x:number, y:number}) => grid.get(value.x, value.y) == null);
  if (viewRect != null) {
    neighbors = neighbors.filter(
      (value:{x:number, y:number}) => (
          viewRect.left <= value.x && value.x <= viewRect.right &&
          viewRect.top <= value.y && value.y <= viewRect.bottom));
  }
  return neighbors;
};


let keyInteractivity = new KeyInteractivity();


let interactivity = new MouseInteractivity(canvas);
let dragPosition:null|{x:number, y:number} = null;
let lastDragPosition:null|{x:number, y:number} = null;

// interactivity.events.listen('drag-start', function(position) {
//   if (position.x == null || position.y == null) {
//     dragPosition = null;
//   } else {
//     dragPosition = {x: position.x, y: position.y};
//   }
// });
// interactivity.events.listen('drag-move', function(position) {
//   if (position.x == null || position.y == null) {
//     dragPosition = null;
//   } else {
//     dragPosition = {x: position.x, y: position.y};
//   }
// });
// interactivity.events.listen(['drag-end', 'click'], function(position) {
//   dragPosition = null;
//   lastDragPosition = null;
// });
// interactivity.events.listen('click', function(position) {
//   console.log(getNeighbors(grid, hovered.x, hovered.y, null));
// });

// let hovered = {x: 0, y: 0};
// interactivity.events.listen('hover', function(position) {
//   let gridCoord = renderer.screenToGridCoord(camera, position.x, position.y);
//   hovered.x = Math.floor(gridCoord.x);
//   hovered.y = Math.floor(gridCoord.y);
// });


let updateActiveCells = function(dt, viewRect):void {
  let newActiveCells:{x:number, y:number}[] = [];
  for (let activeCell of activeCells) {
    let keep = true;
    let existing = grid.get(activeCell.x, activeCell.y);
    let existed = existing != null;
    if (existing == null) {
      existing = {h: Math.random(), s: Math.random() * (MAX_SAT - MIN_SAT) + MIN_SAT, l: INITIAL_LUM};
    } else {
      let newL = existing.l += LUM_DELTA * (dt / 1000);
      if (LUM_DELTA > 0 && newL >= MAX_LUM) {
        newL = MAX_LUM;
      }
      if (LUM_DELTA < 0 && newL <= MIN_LUM) {
        newL = MIN_LUM;
      }
      existing.l = newL;
    }
    if (!existed) {
      grid.set(existing, activeCell.x, activeCell.y);
    }
    if (keep) {
      let positive_delta = LUM_DELTA > 0;
      if ((positive_delta && existing.l >= MAX_LUM) ||
          (!positive_delta && existing.l <= MIN_LUM)) {
        existing.color = getHslCellColor(existing);
        edgeCells.push(activeCell);
      } else {
        newActiveCells.push(activeCell);
      }
    }
  }
  activeCells = newActiveCells;
};

let reproduceCells = function(dt, viewRect):boolean {
  let returnTrue = false;
  while ((activeCells.length > 0 || edgeCells.length > 0) && Math.random() <= REPR_PROBABILITY) {
    // let activeCell = weightedRandom(activeCells.concat(edgeCells), (cell) => {
    //   let neighbors = grid.getNeighbors(cell.x, cell.y)
    //       .filter((n) => grid.get(n.x, n.y) == null);
    //   return neighbors.length;
    // });
    let index = Math.floor(Math.random() * (activeCells.length + edgeCells.length));
    let activeCell = index < activeCells.length ? activeCells[index] : edgeCells[index - activeCells.length];
    let existing = grid.get(activeCell.x, activeCell.y);
    if (existing != null) {
      let neighbors = getNeighbors(grid, activeCell.x, activeCell.y, viewRect);
      let newNeighbor:null|{x:number, y:number} = null;
      if (neighbors.length > 0) {
        // let filteredNeighbors:{neighbor:null|{x:number, y:number}, weight:number}[] = neighbors.map((neighbor) => {
        //   let neighborNeighbors = grid.getNeighbors(neighbor.x, neighbor.y)
        //       .filter((n) => grid.get(n.x, n.y) == null);
        //   return {
        //     neighbor: neighbor,
        //     weight: neighborNeighbors.length
        //   };
        // });
        // filteredNeighbors.push({neighbor: null, weight: 10});
        // let n = weightedRandom(filteredNeighbors, (n) => Math.pow(n.weight, 8)).neighbor;
        // if (n == null) continue;

        let n = neighbors[Math.floor(Math.random() * neighbors.length)];
        let deltaHue = (Math.random() * 2 - 1) * HUE_CHANGE;
        let deltaSat = (Math.random() * 2 - 1) * SAT_CHANGE;
        grid.set({
          h: mod(existing.h + deltaHue, 1),
          s: clamp(existing.s + deltaSat, MIN_SAT, MAX_SAT),
          l: INITIAL_LUM
        }, n.x, n.y);
        newNeighbor = n;
      }
      let neighborCompensation = newNeighbor == null ? 0 : 1;
      let fertileNeighbors = getNeighbors(grid, activeCell.x, activeCell.y, null);
      if (neighbors.length - neighborCompensation !== fertileNeighbors.length) {
        returnTrue = true;
      }
      if (fertileNeighbors.length === 0) {
        let edgeIndex = edgeCells.indexOf(activeCell);
        if (edgeIndex >= 0) {
        // if (index >= activeCells.length) {
          // edgeCells.splice(index - activeCells.length, 1);
          edgeCells.splice(edgeIndex, 1);
        }
      }
      if (newNeighbor != null) {
        activeCells.push(newNeighbor);
      }
    }
  }
  return returnTrue;
}



let viewRect = renderer.getGridViewRect(camera);
viewRect.left = Math.floor(viewRect.left) - 1;
viewRect.top = Math.floor(viewRect.top) - 1;
viewRect.right = Math.ceil(viewRect.right) + 1;
viewRect.bottom = Math.ceil(viewRect.bottom) + 1;
for (let i = 0; i < 1000; i++) {
updateActiveCells(100, viewRect)
}

let lastTime = new Date().getTime();
loop((dt:number) => {
  if (REPR_PROBABILITY < 0.95) {
    REPR_PROBABILITY += dt / 2000000000;
  }
  if (REPR_PROBABILITY > 0.95) {
    REPR_PROBABILITY = 0.95;
  }

  let cameraAltered = false;
  if (dragPosition != null) {
    if (lastDragPosition != null) {
      if (dragPosition.x !== lastDragPosition.x ||
          dragPosition.y !== lastDragPosition.y) {
        let start = camera.untransform(lastDragPosition.x, lastDragPosition.y);
        let end = camera.untransform(dragPosition.x, dragPosition.y);
        camera.move(start.x - end.x, start.y - end.y);
        cameraAltered = true;
      }
    }
    lastDragPosition = {x: dragPosition.x, y: dragPosition.y};
  } else if (lastDragPosition != null) {
    lastDragPosition = null;
  }
  if (keyInteractivity.isDown(189)) { // minus
    camera.setZoom(camera.getZoom() * 1.1);
    cameraAltered = true;
  }
  if (keyInteractivity.isDown(187)) { // plus
    camera.setZoom(camera.getZoom() / 1.1);
    cameraAltered = true;
  }

  let viewRect = renderer.getGridViewRect(camera);
  viewRect.left = Math.floor(viewRect.left) - 1;
  viewRect.top = Math.floor(viewRect.top) - 1;
  viewRect.right = Math.ceil(viewRect.right) + 1;
  viewRect.bottom = Math.ceil(viewRect.bottom) + 1;
  //for (let i = 0; i < 500; i++) {
  updateActiveCells(dt, viewRect);
  reproduceCells(dt, viewRect);
  // }
  if (grid.getCount() / ((viewRect.bottom - viewRect.top) * (viewRect.right - viewRect.left)) > 1.001) {
    let currentZoom = camera.getZoom();
    if (currentZoom < 1/3) {
      camera.setZoom(currentZoom * 2);
      cameraAltered = true;
    }
  }

  // if (activeCells.length === 0 && Math.random() <= REPR_PROBABILITY / 2) {
  //   let existing:{[key:string]: boolean} = {};
  //   grid.filteredMap({x: viewRect.left, y: viewRect.top},
  //                    {x: viewRect.right, y: viewRect.bottom},
  //                    (value, x, y) => (existing[x + '/' + y] = true));
  //   let nonExisting:{x:number, y:number}[] = [];
  //   for (let x = Math.floor(viewRect.left); x <= Math.ceil(viewRect.right); x++) {
  //     for (let y = Math.floor(viewRect.top); y <= Math.ceil(viewRect.bottom); y++) {
  //       if (!existing[x + '/' + y]) {
  //         nonExisting.push({x: x, y: y});
  //       }
  //     }
  //   }
  //   activeCells.push(nonExisting[Math.floor(Math.random() * nonExisting.length)]);
  // }

  let mainTriangleRenderer = (context, cell, x, y) => {
    context.fillStyle = getHslCellColor(cell);
    context.fill();
    // context.lineJoin = 'round';
    // context.lineWidth = 0.5;
    // context.strokeStyle = context.fillStyle;
    // context.stroke();
  };

  if (cameraAltered || dirtyCanvas) {
    dirtyCanvas = false;
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    renderer.renderAllCells(context, camera, mainTriangleRenderer);
    renderer.renderAllCells(context, camera, mainTriangleRenderer);
  } else {
    renderer.renderCells(context, camera, activeCells, mainTriangleRenderer);
    renderer.renderCells(context, camera, edgeCells, mainTriangleRenderer);
  }

  // renderer.renderCells(context, camera, [hovered], (context, cell, x, y) => {
  //   context.lineJoin = 'round';
  //   context.strokeStyle = '#fff';
  //   context.lineWidth = 3;
  //   context.stroke();
  //   context.strokeStyle = '#000';
  //   context.lineWidth = 1;
  //   context.stroke();
  // });

  // let nowTime = new Date().getTime();
  // let timePassed = nowTime - lastTime;
  // lastTime = nowTime;
  // context.textBaseline = 'top';
  // context.font = '14px Arial';
  // context.fillStyle = 'black';
  // context.strokeStyle = 'white';
  // context.lineWidth = 2;
  // let onScreenEdge = 0;
  // for (let edgeCell of edgeCells) {
  //   if (viewRect.left <= edgeCell.x && edgeCell.x <= viewRect.right &&
  //       viewRect.top <= edgeCell.y && edgeCell.y <= viewRect.bottom) {
  //     onScreenEdge++;
  //   }
  // }
  // let fpsText = 'FPS: ' + Math.round(1000 / timePassed) //+ '  Active: ' + activeCells.length + '  Edge: ' + edgeCells.length + '  onscreen ' + onScreenEdge;
  // context.strokeText(fpsText, 10, 10);
  // context.fillText(fpsText, 10, 10);
}, 0);


return;
/*/




let toolSelect = <HTMLSelectElement>document.getElementById('tool-select');
let toolSelection = 'draw';
let setTool = function(newTool:string) {
  // toolSelection = newTool;
  // toolSelect.value = newTool;
  world.selectTool(<keyof ToolsCollection>newTool);
};
if (toolSelect != null) {
  toolSelect.addEventListener('change', function() {
    setTool(toolSelect.value);
  });
}



let world:World = new World(canvas);
let context:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');

const VELOCITY:number = 15;

let keys = new KeyInteractivity();
keys.map('left', 65);
keys.map('right', 68);
keys.map('up', 87);
keys.map('down', 83);
keys.map('zoom-out', 81);
keys.map('zoom-in', 69);
loop(() => {
  // renderFullTriangleGrid(grid, renderer, context);

  world.render();

  let camera = world.getCamera();

  if (keys.isDown('zoom-out')) {
    camera.setZoom(camera.getZoom() * 1.1);
  }
  if (keys.isDown('zoom-in')) {
    camera.setZoom(camera.getZoom() / 1.1);
  }

  let dx = 0, dy = 0;
  if (keys.isDown('left')) {
    dx -= VELOCITY;
  }
  if (keys.isDown('right')) {
    dx += VELOCITY;
  }
  if (keys.isDown('up')) {
    dy -= VELOCITY;
  }
  if (keys.isDown('down')) {
    dy += VELOCITY;
  }

  dx *= camera.getZoom();
  dy *= camera.getZoom();
  if (dx !== 0 || dy !== 0) {
    camera.move(dx, dy);
  }
}, 0);

// */
};
