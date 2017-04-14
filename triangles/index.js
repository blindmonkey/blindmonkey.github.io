(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.triangles = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Camera {
    constructor(viewportWidth, viewportHeight) {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.viewport = { width: viewportWidth, height: viewportHeight };
    }
    getViewport() {
        return { width: this.viewport.width, height: this.viewport.height };
    }
    resize(width, height) {
        this.viewport.width = width;
        this.viewport.height = height;
    }
    getZoom() {
        return this.zoom;
    }
    setZoom(newZoom) {
        this.zoom = newZoom;
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    /**
     * Transforms a world-space coordinate to camera-space.
     */
    transform(x, y) {
        return {
            x: (x - this.x) / this.zoom + this.viewport.width / 2,
            y: (y - this.y) / this.zoom + this.viewport.height / 2,
        };
    }
    /**
     * Transforms a coordinate from camera-space to world-space.
     */
    untransform(x, y) {
        return {
            x: (x - this.viewport.width / 2) * this.zoom + this.x,
            y: (y - this.viewport.height / 2) * this.zoom + this.y,
        };
    }
}
exports.default = Camera;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let colors = {
    random: function () {
        let randomComponent = function () {
            return Math.floor(Math.random() * 256);
        };
        let randomComponents = function (n) {
            let out = [];
            for (let i = 0; i < n; i++) {
                out.push(randomComponent());
            }
            return out;
        };
        return 'rgb(' + randomComponents(3).join(',') + ')';
    },
    rgb: function (r, g, b) {
        return 'rgb(' + [r, g, b].join(',') + ')';
    },
    hexToRgb: function (str) {
        str = str.slice(1);
        return {
            r: parseInt(str.slice(0, 2), 16),
            g: parseInt(str.slice(2, 4), 16),
            b: parseInt(str.slice(4, 6), 16),
        };
    },
    rgbToHex: function (r, g, b) {
        r = r | 0;
        g = g | 0;
        b = b | 0;
        if (r < 0)
            r = 0;
        if (r > 255)
            r = 255;
        if (g < 0)
            g = 0;
        if (g > 255)
            g = 255;
        if (b < 0)
            b = 0;
        if (b > 255)
            b = 255;
        let rstr = r.toString(16);
        if (rstr.length === 1)
            rstr = '0' + rstr;
        let gstr = g.toString(16);
        if (gstr.length === 1)
            gstr = '0' + gstr;
        let bstr = b.toString(16);
        if (bstr.length === 1)
            bstr = '0' + bstr;
        return ['#', rstr, gstr, bstr].join('');
    },
    rgbToHsv: function (r, g, b) {
        // hsv         out;
        // double      min, max, delta;
        r = r / 255;
        g = g / 255;
        b = b / 255;
        let min = r < g ? r : g;
        min = min < b ? min : b;
        let max = r > g ? r : g;
        max = max > b ? max : b;
        let out = { h: 0, s: 0, v: 0 };
        let v = max;
        let delta = max - min;
        if (delta < 0.00001) {
            out.s = 0;
            out.h = 0; // undefined, maybe nan?
            return out;
        }
        if (max > 0.0) {
            out.s = (delta / max);
        }
        else {
            // if max is 0, then r = g = b = 0
            // s = 0, v is undefined
            out.s = 0.0;
            out.h = 0;
            return out;
        }
        if (r >= max)
            out.h = (g - b) / delta; // between yellow & magenta
        else if (g >= max)
            out.h = 2.0 + (b - r) / delta; // between cyan & yellow
        else
            out.h = 4.0 + (r - g) / delta; // between magenta & cyan
        out.h *= 60.0; // degrees
        if (out.h < 0.0)
            out.h += 360.0;
        return out;
    },
    hsvToRgb: function (h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        }
        else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }
};
exports.default = colors;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Events {
    constructor() {
        this.handlers = {};
    }
    listen(events, handler) {
        if (typeof events === 'string') {
            events = [events];
        }
        for (let event of events) {
            if (!(event in this.handlers)) {
                this.handlers[event] = [];
            }
            this.handlers[event].push(handler);
        }
    }
    emit(event, ...args) {
        let handlers = this.handlers[event];
        if (handlers != null) {
            for (let handler of handlers) {
                handler.apply(null, args);
            }
        }
    }
}
exports.default = Events;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GridViewModel {
    constructor(grid) {
        this.grid = grid;
    }
    screenToGridCoord(camera, x, y) {
        let cellSize = 1;
        let cellHeight = cellSize;
        let halfCellHeight = cellHeight / 2;
        let cellWidth = Math.sqrt(cellHeight * cellHeight - halfCellHeight * halfCellHeight);
        let worldSpace = camera.untransform(x, y);
        x = worldSpace.x;
        y = worldSpace.y;
        let gridX = x / cellWidth;
        let floorGridX = Math.floor(gridX);
        let remainderX = gridX - floorGridX;
        let gridY = y / cellHeight * 2 + 1 - gridX;
        let flooredGridY = Math.floor(gridY / 2) * 2;
        let remainderY = (gridY - flooredGridY) / 2;
        gridY = flooredGridY;
        if (remainderY > 1 - remainderX) {
            gridY += 1;
        }
        if (floorGridX % 2 !== 0) {
            gridY += 1;
        }
        let biColumn = Math.floor(floorGridX / 2);
        gridY += biColumn * 2;
        return {
            x: gridX,
            y: gridY,
        };
    }
    getGridViewRect(camera) {
        let viewport = camera.getViewport();
        let { width, height } = viewport;
        let topLeft = this.screenToGridCoord(camera, 0, 0);
        let bottomRight = this.screenToGridCoord(camera, width, height);
        return {
            left: topLeft.x, top: topLeft.y,
            right: bottomRight.x, bottom: bottomRight.y
        };
    }
    renderTriangle(context, camera, x, y, drawTriangle) {
        let trianglePath = function (x1, y1, x2, y2, x3, y3) {
            let p1 = camera.transform(x1, y1);
            let p2 = camera.transform(x2, y2);
            let p3 = camera.transform(x3, y3);
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.lineTo(p3.x, p3.y);
            context.closePath();
        };
        let cellHeight = 1;
        let halfCellHeight = cellHeight / 2;
        let cellWidth = Math.sqrt(cellHeight * cellHeight - halfCellHeight * halfCellHeight);
        let xx = x;
        let yy = y / 2 - .5;
        let leftTriangle = x % 2 !== 0;
        if (y % 2 !== 0) {
            leftTriangle = !leftTriangle;
        }
        if (leftTriangle) {
            trianglePath(xx * cellWidth, (yy + .5) * cellHeight, (xx + 1) * cellWidth, yy * cellHeight, (xx + 1) * cellWidth, (yy + 1) * cellHeight);
        }
        else {
            trianglePath(xx * cellWidth, yy * cellHeight, (xx + 1) * cellWidth, (yy + .5) * cellHeight, xx * cellWidth, (yy + 1) * cellHeight);
        }
        let value = this.grid.get(x, y);
        drawTriangle(context, value, x, y);
    }
    renderCells(context, camera, cells, drawTriangle) {
        for (let coord of cells) {
            this.renderTriangle(context, camera, coord.x, coord.y, drawTriangle);
        }
    }
    renderAllCells(context, camera, drawTriangle) {
        // context.fillStyle = 'black';
        // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        let visibleRect = this.getGridViewRect(camera);
        this.grid.filteredMap({ x: Math.floor(visibleRect.left), y: Math.floor(visibleRect.top) }, { x: Math.ceil(visibleRect.right + 1), y: Math.ceil(visibleRect.bottom + 1) }, (value, x, y) => this.renderTriangle(context, camera, x, y, drawTriangle));
        // this.grid.map((value:T, x:number, y:number) => {
        //   this.renderTriangle(context, camera, x, y, drawTriangle);
        // });
    }
}
exports.default = GridViewModel;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const COORD_INDEX = {};
const CHUNK_SIZE = 64;
class Grid {
    constructor() {
        this.count = 0;
        this.grid = {};
        this.chunks = {};
    }
    getCount() { return this.count; }
    getKey(x, y) {
        x = x | 0;
        y = y | 0;
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
    getChunkCoord(x, y) {
        return { x: Math.floor(x / CHUNK_SIZE),
            y: Math.floor(y / CHUNK_SIZE) };
    }
    get(x, y) {
        let chunkCoord = this.getChunkCoord(x, y);
        let chunkKey = this.getKey(chunkCoord.x, chunkCoord.y);
        let chunk = this.chunks[chunkKey];
        if (chunk == null)
            return null;
        let cell = chunk.data[this.getKey(x, y)];
        return cell && cell.value;
        // let value = this.grid[this.getKey(x, y)];
        // return value && value.value;
    }
    set(value, x, y) {
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
                this.chunks[chunkKey] = { coord: chunkCoord, count: 0, data: {} };
            }
            let chunk = this.chunks[chunkKey];
            if (!(key in chunk.data)) {
                chunk.count++;
                this.count++;
            }
            chunk.data[key] = { coord: { x, y }, value: value };
        }
        else {
            if (chunkKey in this.chunks) {
                let chunk = this.chunks[chunkKey];
                if (key in chunk.data) {
                    chunk.count--;
                    this.count--;
                }
                if (chunk.count > 0) {
                    delete chunk.data[key];
                }
                else {
                    delete this.chunks[chunkKey];
                }
            }
        }
        // let chunk = this.chunks[chunkKey];
        // if (value == null)
    }
    map(f) {
        for (let key in this.grid) {
            let value = this.grid[key];
            let coord = value.coord;
            f(value.value, coord.x, coord.y);
        }
    }
    filteredMap(min, max, f) {
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
    getDirectNeighbors(x, y) {
        let dc = (dx, dy) => { return { x: x + dx, y: y + dy }; };
        let neighbors = [dc(0, -1), dc(0, 1)];
        if (Math.abs(x % 2) === Math.abs(y % 2)) {
            neighbors.push(dc(-1, 0));
        }
        else {
            neighbors.push(dc(1, 0));
        }
        return neighbors;
    }
    getNeighbors(x, y) {
        let dc = (dx, dy) => { return { x: x + dx, y: y + dy }; };
        let neighbors = [
            dc(-1, 0), dc(-1, -1), dc(0, -1),
            dc(1, -1), dc(1, 0), dc(1, 1),
            dc(0, 1), dc(-1, 1),
            dc(0, -2), dc(0, 2)
        ];
        if (Math.abs(x % 2) === Math.abs(y % 2)) {
            neighbors.push(dc(-1, -2));
            neighbors.push(dc(-1, 2));
        }
        else {
            neighbors.push(dc(1, -2));
            neighbors.push(dc(1, 2));
        }
        return neighbors;
    }
}
exports.default = Grid;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camera_1 = require("./camera");
const grid_1 = require("./grid");
const grid_view_model_1 = require("./grid-view-model");
const key_interactivity_1 = require("./key-interactivity");
const mouse_interactivity_1 = require("./mouse-interactivity");
const colors_1 = require("./colors");
let weightedRandom = function (list, weightFn) {
    if (list.length === 0)
        throw 'error';
    let totalWeight = 0;
    let weights = [];
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
let setStatus = function (status) {
    let statusDiv = document.getElementById('status');
    if (statusDiv != null) {
        statusDiv.textContent = status;
    }
};
let loop = function (f, dt) {
    requestAnimationFrame((dt) => loop(f, dt));
    f(dt);
};
window.onload = function () {
    let canvas = document.getElementById('canvas');
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    //* Add/remove a '/' to/from the beginning of this line to switch modes
    let context = canvas.getContext('2d');
    let camera = new camera_1.default(canvasWidth, canvasHeight);
    camera.setZoom(1 / 96);
    let grid = new grid_1.default();
    let renderer = new grid_view_model_1.default(grid);
    let dirtyCanvas = false;
    let resize = function () {
        canvas.width = canvasWidth = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;
        camera.resize(canvasWidth, canvasHeight);
        dirtyCanvas = true;
    };
    window.addEventListener('resize', resize);
    resize();
    let getHslCellColor = function (cell) {
        let color = cell.color;
        if (color == null) {
            let rgb = colors_1.default.hsvToRgb(cell.h, cell.s, cell.l);
            color = colors_1.default.rgbToHex(rgb.r, rgb.g, rgb.b);
        }
        return color;
    };
    // grid.set({h: 0, s: 1, l: 1}, 0, 0);
    let mod = function (n, m) {
        let modded = n % m;
        if (n < 0)
            n += m;
        return n;
    };
    let clamp = function (n, min, max) {
        if (n < min)
            return min;
        if (n > max)
            return max;
        return n;
    };
    let activeCells = [{ x: 0, y: 0 }];
    let edgeCells = [];
    const INITIAL_LUM = 1;
    const MAX_LUM = 0.4;
    const MIN_LUM = 0.75;
    const LUM_DELTA = -0.00001;
    -0.00005;
    0.0005;
    let REPR_PROBABILITY = 0.005;
    0.1;
    0.20;
    0.0024;
    const HUE_CHANGE = 0.02;
    const SAT_CHANGE = 0.05;
    const MIN_SAT = 0.7;
    const MAX_SAT = 1;
    let getNeighbors = function (grid, x, y, viewRect) {
        let neighbors = grid.getDirectNeighbors(x, y);
        neighbors = neighbors.filter((value) => grid.get(value.x, value.y) == null);
        if (viewRect != null) {
            neighbors = neighbors.filter((value) => (viewRect.left <= value.x && value.x <= viewRect.right &&
                viewRect.top <= value.y && value.y <= viewRect.bottom));
        }
        return neighbors;
    };
    let keyInteractivity = new key_interactivity_1.default();
    let interactivity = new mouse_interactivity_1.default(canvas);
    let dragPosition = null;
    let lastDragPosition = null;
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
    let updateActiveCells = function (dt, viewRect) {
        let newActiveCells = [];
        for (let activeCell of activeCells) {
            let keep = true;
            let existing = grid.get(activeCell.x, activeCell.y);
            let existed = existing != null;
            if (existing == null) {
                existing = { h: Math.random(), s: Math.random() * (MAX_SAT - MIN_SAT) + MIN_SAT, l: INITIAL_LUM };
            }
            else {
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
                }
                else {
                    newActiveCells.push(activeCell);
                }
            }
        }
        activeCells = newActiveCells;
    };
    let reproduceCells = function (dt, viewRect) {
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
                let newNeighbor = null;
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
    };
    let viewRect = renderer.getGridViewRect(camera);
    viewRect.left = Math.floor(viewRect.left) - 1;
    viewRect.top = Math.floor(viewRect.top) - 1;
    viewRect.right = Math.ceil(viewRect.right) + 1;
    viewRect.bottom = Math.ceil(viewRect.bottom) + 1;
    for (let i = 0; i < 1000; i++) {
        updateActiveCells(100, viewRect);
    }
    let lastTime = new Date().getTime();
    loop((dt) => {
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
            lastDragPosition = { x: dragPosition.x, y: dragPosition.y };
        }
        else if (lastDragPosition != null) {
            lastDragPosition = null;
        }
        if (keyInteractivity.isDown(189)) {
            camera.setZoom(camera.getZoom() * 1.1);
            cameraAltered = true;
        }
        if (keyInteractivity.isDown(187)) {
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
            if (currentZoom < 1 / 3) {
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
        }
        else {
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

},{"./camera":1,"./colors":2,"./grid":5,"./grid-view-model":4,"./key-interactivity":7,"./mouse-interactivity":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyInteractivity {
    constructor() {
        this.keys = {};
        this.keyMap = {};
        document.addEventListener('keydown', (e) => {
            let keycode = e.keyCode;
            this.keys[keycode] = true;
            let name = this.keyMap[keycode];
            if (name != null) {
                this.keys[name] = true;
            }
        });
        document.addEventListener('keyup', (e) => {
            let keycode = e.keyCode;
            if (keycode in this.keys) {
                delete this.keys[keycode];
            }
            if (keycode in this.keyMap) {
                let name = this.keyMap[keycode];
                if (name != null && name in this.keys) {
                    delete this.keys[name];
                }
            }
        });
    }
    map(name, key) {
        this.keyMap[key] = name;
    }
    isDown(key) {
        return !!this.keys[key];
    }
    getDown() {
        let keys = [];
        for (let key in this.keys) {
            if (this.isDown(key)) {
                keys.push(key);
            }
        }
        return keys;
    }
}
exports.default = KeyInteractivity;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("./events");
class MouseInteractivity {
    constructor(element) {
        this.events = new events_1.default();
        this.element = element;
        this.position = {};
        this.down = false;
        this.element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.element.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp({
            offsetX: e.offsetX - this.element.offsetLeft,
            offsetY: e.offsetY - this.element.offsetTop
        }, false));
    }
    isDown() { return this.down; }
    handleMouseUp(event, events = true) {
        if (this.down) {
            let position = { x: event.offsetX, y: event.offsetY };
            this.down = false;
            if (events) {
                if (this.dragging) {
                    this.events.emit('drag-end', position);
                }
                else {
                    this.events.emit('click', position);
                }
            }
            this.dragging = false;
            this.position.x = undefined;
            this.position.y = undefined;
        }
    }
    handleMouseMove(event) {
        if (this.down) {
            this.position.x = event.offsetX;
            this.position.y = event.offsetY;
            // If the mouse is down when we receive the mousedown or move event, then
            // we are dragging.
            if (!this.dragging) {
                this.dragging = true;
                this.events.emit('drag-start', this.position);
            }
            else {
                this.events.emit('drag-move', this.position);
            }
        }
        else {
            this.events.emit('hover', { x: event.offsetX, y: event.offsetY });
        }
    }
    handleMouseDown(event) {
        this.position.x = event.offsetX;
        this.position.y = event.offsetY;
        this.down = true;
        this.events.emit('down', this.position);
    }
}
exports.default = MouseInteractivity;

},{"./events":3}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbW91c2UtaW50ZXJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPRSxZQUFZLGFBQW9CLEVBQUUsY0FBcUI7UUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQ3ZCLElBQUks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LENBQUMsQ0FBQztRQUNSLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElB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QUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQzdCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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QUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUEvREQscUNBK0RDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbWVyYSB7XG4gIC8vIFdvcmxkLXNwYWNlIGNhbWVyYSBmb2N1cyBwb3NpdGlvbi5cbiAgcHJpdmF0ZSB4Om51bWJlcjtcbiAgcHJpdmF0ZSB5Om51bWJlcjtcbiAgcHJpdmF0ZSB6b29tOm51bWJlcjtcbiAgcHJpdmF0ZSB2aWV3cG9ydDp7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfTtcblxuICBjb25zdHJ1Y3Rvcih2aWV3cG9ydFdpZHRoOm51bWJlciwgdmlld3BvcnRIZWlnaHQ6bnVtYmVyKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMuem9vbSA9IDE7XG4gICAgdGhpcy52aWV3cG9ydCA9IHt3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodH07XG4gIH1cblxuICBnZXRWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4ge3dpZHRoOiB0aGlzLnZpZXdwb3J0LndpZHRoLCBoZWlnaHQ6IHRoaXMudmlld3BvcnQuaGVpZ2h0fTtcbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICBnZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLnpvb207XG4gIH1cblxuICBzZXRab29tKG5ld1pvb206bnVtYmVyKSB7XG4gICAgdGhpcy56b29tID0gbmV3Wm9vbTtcbiAgfVxuXG4gIG1vdmUoZHg6bnVtYmVyLCBkeTpudW1iZXIpIHtcbiAgICB0aGlzLnggKz0gZHg7XG4gICAgdGhpcy55ICs9IGR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSB3b3JsZC1zcGFjZSBjb29yZGluYXRlIHRvIGNhbWVyYS1zcGFjZS5cbiAgICovXG4gIHRyYW5zZm9ybSh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHggLSB0aGlzLngpIC8gdGhpcy56b29tICsgdGhpcy52aWV3cG9ydC53aWR0aCAvIDIsXG4gICAgICB5OiAoeSAtIHRoaXMueSkgLyB0aGlzLnpvb20gKyB0aGlzLnZpZXdwb3J0LmhlaWdodCAvIDIsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgY29vcmRpbmF0ZSBmcm9tIGNhbWVyYS1zcGFjZSB0byB3b3JsZC1zcGFjZS5cbiAgICovXG4gIHVudHJhbnNmb3JtKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoeCAtIHRoaXMudmlld3BvcnQud2lkdGggLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueCxcbiAgICAgIHk6ICh5IC0gdGhpcy52aWV3cG9ydC5oZWlnaHQgLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueSxcbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgdHlwZSBIc3ZDb2xvciA9IHtoOm51bWJlciwgczpudW1iZXIsIHY6bnVtYmVyfTtcbmV4cG9ydCB0eXBlIFJnYkNvbG9yID0ge3I6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXJ9O1xuXG5sZXQgY29sb3JzID0ge1xuICByYW5kb206IGZ1bmN0aW9uKCkge1xuICAgIGxldCByYW5kb21Db21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuICAgIH07XG4gICAgbGV0IHJhbmRvbUNvbXBvbmVudHMgPSBmdW5jdGlvbihuKSB7XG4gICAgICBsZXQgb3V0Om51bWJlcltdID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBvdXQucHVzaChyYW5kb21Db21wb25lbnQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbUNvbXBvbmVudHMoMykuam9pbignLCcpICsgJyknO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICByZXR1cm4gJ3JnYignICsgW3IsIGcsIGJdLmpvaW4oJywnKSArICcpJztcbiAgfSxcbiAgaGV4VG9SZ2I6IGZ1bmN0aW9uKHN0cjpzdHJpbmcpIHtcbiAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHI6IHBhcnNlSW50KHN0ci5zbGljZSgwLCAyKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQoc3RyLnNsaWNlKDIsIDQpLCAxNiksXG4gICAgICBiOiBwYXJzZUludChzdHIuc2xpY2UoNCwgNiksIDE2KSxcbiAgICB9O1xuICB9LFxuICByZ2JUb0hleDogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIHIgPSByfDA7XG4gICAgZyA9IGd8MDtcbiAgICBiID0gYnwwO1xuXG4gICAgaWYgKHIgPCAwKSByID0gMDtcbiAgICBpZiAociA+IDI1NSkgciA9IDI1NTtcbiAgICBpZiAoZyA8IDApIGcgPSAwO1xuICAgIGlmIChnID4gMjU1KSBnID0gMjU1O1xuICAgIGlmIChiIDwgMCkgYiA9IDA7XG4gICAgaWYgKGIgPiAyNTUpIGIgPSAyNTU7XG5cbiAgICBsZXQgcnN0ciA9IHIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChyc3RyLmxlbmd0aCA9PT0gMSkgcnN0ciA9ICcwJyArIHJzdHI7XG4gICAgbGV0IGdzdHIgPSBnLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAoZ3N0ci5sZW5ndGggPT09IDEpIGdzdHIgPSAnMCcgKyBnc3RyO1xuICAgIGxldCBic3RyID0gYi50b1N0cmluZygxNik7XG4gICAgaWYgKGJzdHIubGVuZ3RoID09PSAxKSBic3RyID0gJzAnICsgYnN0cjtcbiAgICByZXR1cm4gWycjJywgcnN0ciwgZ3N0ciwgYnN0cl0uam9pbignJyk7XG4gIH0sXG4gIHJnYlRvSHN2OiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgLy8gaHN2ICAgICAgICAgb3V0O1xuICAgIC8vIGRvdWJsZSAgICAgIG1pbiwgbWF4LCBkZWx0YTtcbiAgICByID0gciAvIDI1NTtcbiAgICBnID0gZyAvIDI1NTtcbiAgICBiID0gYiAvIDI1NTtcblxuICAgIGxldCBtaW4gPSByICAgIDwgZyA/IHIgICA6IGc7XG4gICAgbWluICAgICA9IG1pbiAgPCBiID8gbWluIDogYjtcblxuICAgIGxldCBtYXggPSByICAgID4gZyA/IHIgICA6IGc7XG4gICAgbWF4ICAgICA9IG1heCAgPiBiID8gbWF4IDogYjtcblxuICAgIGxldCBvdXQgPSB7aDogMCwgczogMCwgdjogMH07XG4gICAgbGV0IHYgPSBtYXg7XG4gICAgbGV0IGRlbHRhID0gbWF4IC0gbWluO1xuICAgIGlmIChkZWx0YSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICBvdXQucyA9IDA7XG4gICAgICAgIG91dC5oID0gMDsgLy8gdW5kZWZpbmVkLCBtYXliZSBuYW4/XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmKCBtYXggPiAwLjAgKSB7IC8vIE5PVEU6IGlmIE1heCBpcyA9PSAwLCB0aGlzIGRpdmlkZSB3b3VsZCBjYXVzZSBhIGNyYXNoXG4gICAgICAgIG91dC5zID0gKGRlbHRhIC8gbWF4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBtYXggaXMgMCwgdGhlbiByID0gZyA9IGIgPSAwXG4gICAgICAgIC8vIHMgPSAwLCB2IGlzIHVuZGVmaW5lZFxuICAgICAgICBvdXQucyA9IDAuMDtcbiAgICAgICAgb3V0LmggPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiggciA+PSBtYXggKSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vID4gaXMgYm9ndXMsIGp1c3Qga2VlcHMgY29tcGlsb3IgaGFwcHlcbiAgICAgICAgb3V0LmggPSAoZyAtIGIpIC8gZGVsdGE7ICAgICAgICAvLyBiZXR3ZWVuIHllbGxvdyAmIG1hZ2VudGFcbiAgICBlbHNlIGlmKCBnID49IG1heCApXG4gICAgICAgIG91dC5oID0gMi4wICsgKCBiIC0gciApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIGN5YW4gJiB5ZWxsb3dcbiAgICBlbHNlXG4gICAgICAgIG91dC5oID0gNC4wICsgKCByIC0gZyApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIG1hZ2VudGEgJiBjeWFuXG5cbiAgICBvdXQuaCAqPSA2MC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlZ3JlZXNcblxuICAgIGlmKCBvdXQuaCA8IDAuMCApXG4gICAgICAgIG91dC5oICs9IDM2MC4wO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfSxcbiAgaHN2VG9SZ2I6IGZ1bmN0aW9uKGg6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIpIHtcbiAgICB2YXIgciwgZywgYjtcblxuICAgIGlmKHMgPT0gMCl7XG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcbiAgICB9ZWxzZXtcbiAgICAgICAgdmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpe1xuICAgICAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcbiAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG4gICAgICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3I6IE1hdGgucm91bmQociAqIDI1NSksIGc6IE1hdGgucm91bmQoZyAqIDI1NSksIGI6IE1hdGgucm91bmQoYiAqIDI1NSl9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnM7XG4iLCJ0eXBlIEhhbmRsZXIgPSAoLi4uYXJnczphbnlbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRzIHtcbiAgcHJpdmF0ZSBoYW5kbGVyczp7W2tleTpzdHJpbmddOkFycmF5PEhhbmRsZXI+fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gIH1cblxuICBsaXN0ZW4oZXZlbnRzOnN0cmluZ3xBcnJheTxzdHJpbmc+LCBoYW5kbGVyOkhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGV2ZW50cyA9IFtldmVudHNdO1xuICAgIH1cbiAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuaGFuZGxlcnMpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOmFueVtdKSB7XG4gICAgbGV0IGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKGhhbmRsZXJzICE9IG51bGwpIHtcbiAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi9jYW1lcmEnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZFZpZXdNb2RlbDxUPiB7XG4gIHByaXZhdGUgZ3JpZDpHcmlkPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKGdyaWQ6R3JpZDxUPikge1xuICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gIH1cblxuICBzY3JlZW5Ub0dyaWRDb29yZChjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICBsZXQgY2VsbFNpemUgPSAxO1xuICAgIGxldCBjZWxsSGVpZ2h0ID0gY2VsbFNpemU7XG4gICAgbGV0IGhhbGZDZWxsSGVpZ2h0ID0gY2VsbEhlaWdodCAvIDI7XG4gICAgbGV0IGNlbGxXaWR0aCA9IE1hdGguc3FydChjZWxsSGVpZ2h0ICogY2VsbEhlaWdodCAtIGhhbGZDZWxsSGVpZ2h0ICogaGFsZkNlbGxIZWlnaHQpO1xuXG4gICAgbGV0IHdvcmxkU3BhY2UgPSBjYW1lcmEudW50cmFuc2Zvcm0oeCwgeSk7XG4gICAgeCA9IHdvcmxkU3BhY2UueDtcbiAgICB5ID0gd29ybGRTcGFjZS55O1xuXG4gICAgbGV0IGdyaWRYID0geCAvIGNlbGxXaWR0aDtcbiAgICBsZXQgZmxvb3JHcmlkWCA9IE1hdGguZmxvb3IoZ3JpZFgpO1xuICAgIGxldCByZW1haW5kZXJYID0gZ3JpZFggLSBmbG9vckdyaWRYO1xuXG4gICAgbGV0IGdyaWRZID0geSAvIGNlbGxIZWlnaHQgKiAyICsgMSAtIGdyaWRYO1xuICAgIGxldCBmbG9vcmVkR3JpZFkgPSBNYXRoLmZsb29yKGdyaWRZIC8gMikgKiAyO1xuXG4gICAgbGV0IHJlbWFpbmRlclkgPSAoZ3JpZFkgLSBmbG9vcmVkR3JpZFkpIC8gMjtcbiAgICBncmlkWSA9IGZsb29yZWRHcmlkWTtcbiAgICBpZiAocmVtYWluZGVyWSA+IDEgLSByZW1haW5kZXJYKSB7XG4gICAgICBncmlkWSArPSAxO1xuICAgIH1cbiAgICBpZiAoZmxvb3JHcmlkWCAlIDIgIT09IDApIHtcbiAgICAgIGdyaWRZICs9IDE7XG4gICAgfVxuXG4gICAgbGV0IGJpQ29sdW1uID0gTWF0aC5mbG9vcihmbG9vckdyaWRYIC8gMik7XG4gICAgZ3JpZFkgKz0gYmlDb2x1bW4gKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGdyaWRYLFxuICAgICAgeTogZ3JpZFksXG4gICAgfTtcbiAgfVxuXG4gIGdldEdyaWRWaWV3UmVjdChjYW1lcmE6Q2FtZXJhKTp7bGVmdDpudW1iZXIsIHRvcDpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXJ9IHtcbiAgICBsZXQgdmlld3BvcnQgPSBjYW1lcmEuZ2V0Vmlld3BvcnQoKTtcbiAgICBsZXQge3dpZHRoLCBoZWlnaHR9ID0gdmlld3BvcnQ7XG4gICAgbGV0IHRvcExlZnQgPSB0aGlzLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgMCwgMCk7XG4gICAgbGV0IGJvdHRvbVJpZ2h0ID0gdGhpcy5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0b3BMZWZ0LngsIHRvcDogdG9wTGVmdC55LFxuICAgICAgcmlnaHQ6IGJvdHRvbVJpZ2h0LngsIGJvdHRvbTogYm90dG9tUmlnaHQueVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRyaWFuZ2xlKGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgdDpUfG51bGwsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBsZXQgdHJpYW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgICAgIHgxOm51bWJlciwgeTE6bnVtYmVyLCB4MjpudW1iZXIsIHkyOm51bWJlciwgeDM6bnVtYmVyLCB5MzpudW1iZXIpIHtcbiAgICAgIGxldCBwMSA9IGNhbWVyYS50cmFuc2Zvcm0oeDEsIHkxKTtcbiAgICAgIGxldCBwMiA9IGNhbWVyYS50cmFuc2Zvcm0oeDIsIHkyKTtcbiAgICAgIGxldCBwMyA9IGNhbWVyYS50cmFuc2Zvcm0oeDMsIHkzKTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHAyLngsIHAyLnkpO1xuICAgICAgY29udGV4dC5saW5lVG8ocDMueCwgcDMueSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH07XG4gICAgbGV0IGNlbGxIZWlnaHQgPSAxO1xuICAgIGxldCBoYWxmQ2VsbEhlaWdodCA9IGNlbGxIZWlnaHQgLyAyO1xuICAgIGxldCBjZWxsV2lkdGggPSBNYXRoLnNxcnQoY2VsbEhlaWdodCAqIGNlbGxIZWlnaHQgLSBoYWxmQ2VsbEhlaWdodCAqIGhhbGZDZWxsSGVpZ2h0KTtcbiAgICBsZXQgeHggPSB4O1xuICAgIGxldCB5eSA9IHkgLyAyIC0gLjU7XG4gICAgbGV0IGxlZnRUcmlhbmdsZSA9IHggJSAyICE9PSAwO1xuICAgIGlmICh5ICUgMiAhPT0gMCkge1xuICAgICAgICBsZWZ0VHJpYW5nbGUgPSAhbGVmdFRyaWFuZ2xlO1xuICAgIH1cbiAgICBpZiAobGVmdFRyaWFuZ2xlKSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAoeXkrLjUpICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICB5eSAgICAgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICh4eCsxKSAqIGNlbGxXaWR0aCwgKHl5KzEpICAqIGNlbGxIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAgeXkgICAgICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICh5eSsuNSkgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgIHh4ICogY2VsbFdpZHRoLCAgICAgKHl5KzEpICogY2VsbEhlaWdodCk7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZC5nZXQoeCwgeSk7XG4gICAgZHJhd1RyaWFuZ2xlKGNvbnRleHQsIHZhbHVlLCB4LCB5KTtcbiAgfVxuXG4gIHJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYTpDYW1lcmEsIGNlbGxzOkFycmF5PHt4Om51bWJlciwgeTpudW1iZXJ9PixcbiAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0LCB0OlQsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBmb3IgKGxldCBjb29yZCBvZiBjZWxscykge1xuICAgICAgdGhpcy5yZW5kZXJUcmlhbmdsZShjb250ZXh0LCBjYW1lcmEsIGNvb3JkLngsIGNvb3JkLnksIGRyYXdUcmlhbmdsZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQWxsQ2VsbHMoY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbWVyYTpDYW1lcmEsXG4gICAgICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdDpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgLy8gY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgdmlzaWJsZVJlY3QgPSB0aGlzLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuICAgIHRoaXMuZ3JpZC5maWx0ZXJlZE1hcChcbiAgICAgICAge3g6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QubGVmdCksIHk6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QudG9wKX0sXG4gICAgICAgIHt4OiBNYXRoLmNlaWwodmlzaWJsZVJlY3QucmlnaHQgKyAxKSwgeTogTWF0aC5jZWlsKHZpc2libGVSZWN0LmJvdHRvbSArIDEpfSxcbiAgICAgICAgKHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpKTtcbiAgICAvLyB0aGlzLmdyaWQubWFwKCh2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHtcbiAgICAvLyAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpO1xuICAgIC8vIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcblxuaW1wb3J0IGNvb3JkcyBmcm9tICcuL2Nvb3Jkcyc7XG5cblxuY29uc3QgQ09PUkRfSU5ERVg6e1trZXk6bnVtYmVyXTp7W2tleTpudW1iZXJdOiBzdHJpbmd9fSA9IHt9O1xuXG5cbmNvbnN0IENIVU5LX1NJWkUgPSA2NDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZDxUPiB7XG4gIHByaXZhdGUgY291bnQ6bnVtYmVyO1xuICBwcml2YXRlIGdyaWQ6e1trZXk6c3RyaW5nXToge2Nvb3JkOiB7eDpudW1iZXIsIHk6bnVtYmVyfSwgdmFsdWU6IFR9fTtcbiAgcHJpdmF0ZSBjaHVua3M6e1trZXk6c3RyaW5nXToge1xuICAgIGNvb3JkOnt4Om51bWJlciwgeTpudW1iZXJ9LFxuICAgIGNvdW50Om51bWJlcixcbiAgICBkYXRhOntba2V5OnN0cmluZ106IHtjb29yZDoge3g6bnVtYmVyLCB5Om51bWJlcn0sIHZhbHVlOiBUfX19fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmdyaWQgPSB7fTtcbiAgICB0aGlzLmNodW5rcyA9IHt9O1xuICB9XG5cbiAgZ2V0Q291bnQoKSB7IHJldHVybiB0aGlzLmNvdW50OyB9XG5cbiAgcHJpdmF0ZSBnZXRLZXkoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgeCA9IHh8MDtcbiAgICB5ID0geXwwO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbeCwgeV0pO1xuICAgIC8vIGxldCBhID0gQ09PUkRfSU5ERVhbeF07XG4gICAgLy8gaWYgKGEgIT0gbnVsbCkge1xuICAgIC8vICAgbGV0IGIgPSBhW3ldO1xuICAgIC8vICAgaWYgKGIgIT0gbnVsbCkge1xuICAgIC8vICAgICByZXR1cm4gYjtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgLy8gbGV0IHJlc3VsdCA9IHggKyAnLycgKyB5Oy8vW3gsIHldLmpvaW4oJy8nKTtcbiAgICAvLyBpZiAoISh4IGluIENPT1JEX0lOREVYKSkge1xuICAgIC8vICAgQ09PUkRfSU5ERVhbeF0gPSB7fTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIENPT1JEX0lOREVYW3hdW3ldID0gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaHVua0Nvb3JkKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7eDogTWF0aC5mbG9vcih4IC8gQ0hVTktfU0laRSksXG4gICAgICAgICAgICB5OiBNYXRoLmZsb29yKHkgLyBDSFVOS19TSVpFKX1cbiAgfVxuXG4gIGdldCh4Om51bWJlciwgeTpudW1iZXIpOlR8bnVsbCB7XG4gICAgbGV0IGNodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQoeCwgeSk7XG4gICAgbGV0IGNodW5rS2V5ID0gdGhpcy5nZXRLZXkoY2h1bmtDb29yZC54LCBjaHVua0Nvb3JkLnkpO1xuICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICBpZiAoY2h1bmsgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgbGV0IGNlbGwgPSBjaHVuay5kYXRhW3RoaXMuZ2V0S2V5KHgsIHkpXTtcbiAgICByZXR1cm4gY2VsbCAmJiBjZWxsLnZhbHVlO1xuICAgIC8vIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZFt0aGlzLmdldEtleSh4LCB5KV07XG4gICAgLy8gcmV0dXJuIHZhbHVlICYmIHZhbHVlLnZhbHVlO1xuICB9XG5cbiAgc2V0KHZhbHVlOlR8bnVsbCwgeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgLy8gbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIC8vIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgLy8gICBpZiAoa2V5IGluIHRoaXMuZ3JpZCkge1xuICAgIC8vICAgICBkZWxldGUgdGhpcy5ncmlkW2tleV07XG4gICAgLy8gICB9XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMuZ3JpZFtrZXldID0ge2Nvb3JkOnt4LCB5fSwgdmFsdWU6IHZhbHVlfTtcbiAgICAvLyB9XG4gICAgbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIGxldCBjaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKHgsIHkpO1xuICAgIGxldCBjaHVua0tleSA9IHRoaXMuZ2V0S2V5KGNodW5rQ29vcmQueCwgY2h1bmtDb29yZC55KTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgaWYgKCEoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpKSB7XG4gICAgICAgIHRoaXMuY2h1bmtzW2NodW5rS2V5XSA9IHtjb29yZDogY2h1bmtDb29yZCwgY291bnQ6IDAsIGRhdGE6IHt9fTtcbiAgICAgIH1cbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGlmICghKGtleSBpbiBjaHVuay5kYXRhKSkge1xuICAgICAgICBjaHVuay5jb3VudCsrO1xuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICB9XG4gICAgICBjaHVuay5kYXRhW2tleV0gPSB7Y29vcmQ6e3gsIHl9LCB2YWx1ZTogdmFsdWV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICBpZiAoa2V5IGluIGNodW5rLmRhdGEpIHtcbiAgICAgICAgICBjaHVuay5jb3VudC0tO1xuICAgICAgICAgIHRoaXMuY291bnQtLTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2h1bmsuY291bnQgPiAwKSB7XG4gICAgICAgICAgZGVsZXRlIGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAvLyBpZiAodmFsdWUgPT0gbnVsbClcbiAgfVxuXG4gIG1hcChmOih2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyZWRNYXAobWluOnt4Om51bWJlciwgeTpudW1iZXJ9LCBtYXg6e3g6bnVtYmVyLCB5Om51bWJlcn0sXG4gICAgICAgICAgICAgIGY6KHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4gdm9pZCkge1xuICAgIC8vIFRPRE86IEluZGV4IHRoZSBncmlkIG9yIHNvbWV0aGluZy4gSXQncyBwcmV0dHkgaW5lZmZpY2llbnQuXG4gICAgbGV0IHN0YXJ0Q2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZChtaW4ueCwgbWluLnkpO1xuICAgIGxldCBlbmRDaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKG1heC54LCBtYXgueSk7XG4gICAgZW5kQ2h1bmtDb29yZC54Kys7XG4gICAgZW5kQ2h1bmtDb29yZC55Kys7XG4gICAgZm9yIChsZXQgY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGxldCBjaHVua0Nvb3JkID0gY2h1bmsuY29vcmQ7XG4gICAgICBpZiAoc3RhcnRDaHVua0Nvb3JkLnggPD0gY2h1bmtDb29yZC54ICYmIGNodW5rQ29vcmQueCA8PSBlbmRDaHVua0Nvb3JkLnggJiZcbiAgICAgICAgICBzdGFydENodW5rQ29vcmQueSA8PSBjaHVua0Nvb3JkLnkgJiYgY2h1bmtDb29yZC55IDw9IGVuZENodW5rQ29vcmQueSkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY2h1bmsuZGF0YSkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAgICAgICBpZiAobWluLnggPD0gY29vcmQueCAmJiBjb29yZC54IDwgbWF4LnggJiZcbiAgICAgICAgICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAgICAgICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgLy8gICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAvLyAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgIC8vICAgaWYgKG1pbi54IDw9IGNvb3JkLnggJiYgY29vcmQueCA8IG1heC54ICYmXG4gICAgLy8gICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAvLyAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH1cblxuICBnZXREaXJlY3ROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbZGMoMCwgLTEpLCBkYygwLCAxKV07XG4gICAgaWYgKE1hdGguYWJzKHggJSAyKSA9PT0gTWF0aC5hYnMoeSAlIDIpKSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAwKSk7XG4gICAgfVxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBnZXROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbXG4gICAgICBkYygtMSwgMCksIGRjKC0xLCAtMSksIGRjKDAsIC0xKSxcbiAgICAgIGRjKDEsIC0xKSwgZGMoMSwgMCksIGRjKDEsIDEpLFxuICAgICAgZGMoMCwgMSksIGRjKC0xLCAxKSxcbiAgICAgIGRjKDAsIC0yKSwgZGMoMCwgMilcbiAgICBdO1xuICAgIGlmIChNYXRoLmFicyh4ICUgMikgPT09IE1hdGguYWJzKHkgJSAyKSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIC0yKSk7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAtMikpO1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgMikpO1xuICAgIH1cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcbmltcG9ydCBDb2xvclNlbGVjdENvbXBvbmVudCBmcm9tICcuL2NvbG9yLXNlbGVjdCc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEdyaWRWaWV3TW9kZWwgZnJvbSAnLi9ncmlkLXZpZXctbW9kZWwnO1xuaW1wb3J0IEtleUludGVyYWN0aXZpdHkgZnJvbSAnLi9rZXktaW50ZXJhY3Rpdml0eSc7XG5pbXBvcnQgTW91c2VJbnRlcmFjdGl2aXR5IGZyb20gJy4vbW91c2UtaW50ZXJhY3Rpdml0eSc7XG5cbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkJztcbmltcG9ydCB7IFRvb2xzQ29sbGVjdGlvbiB9IGZyb20gJy4vdG9vbHMnO1xuXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuXG5sZXQgd2VpZ2h0ZWRSYW5kb20gPSBmdW5jdGlvbjxUPihsaXN0OkFycmF5PFQ+LCB3ZWlnaHRGbjooVCkgPT4gbnVtYmVyKSB7XG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkgdGhyb3cgJ2Vycm9yJztcbiAgbGV0IHRvdGFsV2VpZ2h0Om51bWJlciA9IDA7XG4gIGxldCB3ZWlnaHRzOm51bWJlcltdID0gW107XG4gIGZvciAobGV0IGl0ZW0gb2YgbGlzdCkge1xuICAgIGxldCB3ZWlnaHQgPSBNYXRoLmFicyh3ZWlnaHRGbihpdGVtKSk7XG4gICAgdG90YWxXZWlnaHQgKz0gd2VpZ2h0O1xuICAgIHdlaWdodHMucHVzaCh3ZWlnaHQpO1xuICB9XG4gIGxldCBuID0gTWF0aC5yYW5kb20oKSAqIHRvdGFsV2VpZ2h0O1xuICBsZXQgY3VtdWxhdGl2ZVN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd2VpZ2h0cy5sZW5ndGg7IGkrKykge1xuICAgIGN1bXVsYXRpdmVTdW0gKz0gd2VpZ2h0c1tpXTtcbiAgICBpZiAobiA8PSBjdW11bGF0aXZlU3VtKSB7XG4gICAgICByZXR1cm4gbGlzdFtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbn07XG5cblxubGV0IHNldFN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICBsZXQgc3RhdHVzRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpO1xuICBpZiAoc3RhdHVzRGl2ICE9IG51bGwpIHtcbiAgICBzdGF0dXNEaXYudGV4dENvbnRlbnQgPSBzdGF0dXM7XG4gIH1cbn07XG5cblxubGV0IGxvb3AgPSBmdW5jdGlvbihmLCBkdCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGR0KSA9PiBsb29wKGYsIGR0KSk7XG4gIGYoZHQpO1xufTtcblxuXG50eXBlIENlbGxUeXBlID0gc3RyaW5nO1xuXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuXG5sZXQgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbmxldCBjYW52YXNXaWR0aDpudW1iZXIgPSBjYW52YXMud2lkdGg7XG5sZXQgY2FudmFzSGVpZ2h0Om51bWJlciA9IGNhbnZhcy5oZWlnaHQ7XG5cblxuLy8qIEFkZC9yZW1vdmUgYSAnLycgdG8vZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgbGluZSB0byBzd2l0Y2ggbW9kZXNcblxubGV0IGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxubGV0IGNhbWVyYSA9IG5ldyBDYW1lcmEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5jYW1lcmEuc2V0Wm9vbSgxLzk2KTtcblxuXG50eXBlIEhTTENlbGwgPSB7aDpudW1iZXIsIHM6bnVtYmVyLCBsOm51bWJlciwgY29sb3I/OnN0cmluZ307XG5sZXQgZ3JpZDpHcmlkPEhTTENlbGw+ID0gbmV3IEdyaWQ8SFNMQ2VsbD4oKTtcbmxldCByZW5kZXJlcjpHcmlkVmlld01vZGVsPEhTTENlbGw+ID0gbmV3IEdyaWRWaWV3TW9kZWw8SFNMQ2VsbD4oZ3JpZCk7XG5cblxubGV0IGRpcnR5Q2FudmFzID0gZmFsc2U7XG5cblxubGV0IHJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICBjYW52YXMud2lkdGggPSBjYW52YXNXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gY2FudmFzSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEucmVzaXplKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuICBkaXJ0eUNhbnZhcyA9IHRydWU7XG59O1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSk7XG5yZXNpemUoKTtcblxubGV0IGdldEhzbENlbGxDb2xvciA9IGZ1bmN0aW9uKGNlbGw6SFNMQ2VsbCk6c3RyaW5nIHtcbiAgbGV0IGNvbG9yID0gY2VsbC5jb2xvcjtcbiAgaWYgKGNvbG9yID09IG51bGwpIHtcbiAgICBsZXQgcmdiID0gY29sb3JzLmhzdlRvUmdiKGNlbGwuaCwgY2VsbC5zLCBjZWxsLmwpO1xuICAgIGNvbG9yID0gY29sb3JzLnJnYlRvSGV4KHJnYi5yLCByZ2IuZywgcmdiLmIpO1xuICB9XG4gIHJldHVybiBjb2xvcjtcbn07XG5cbi8vIGdyaWQuc2V0KHtoOiAwLCBzOiAxLCBsOiAxfSwgMCwgMCk7XG5cbmxldCBtb2QgPSBmdW5jdGlvbihuOm51bWJlciwgbTpudW1iZXIpOm51bWJlciB7XG4gIGxldCBtb2RkZWQgPSBuICUgbTtcbiAgaWYgKG4gPCAwKSBuICs9IG07XG4gIHJldHVybiBuO1xufTtcbmxldCBjbGFtcCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtaW46bnVtYmVyLCBtYXg6bnVtYmVyKTpudW1iZXIge1xuICBpZiAobiA8IG1pbikgcmV0dXJuIG1pbjtcbiAgaWYgKG4gPiBtYXgpIHJldHVybiBtYXg7XG4gIHJldHVybiBuO1xufTtcblxuXG5cblxubGV0IGFjdGl2ZUNlbGxzOnt4Om51bWJlciwgeTpudW1iZXJ9W10gPSBbe3g6IDAsIHk6IDB9XTtcbmxldCBlZGdlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdXG5cbmNvbnN0IElOSVRJQUxfTFVNID0gMTtcbmNvbnN0IE1BWF9MVU0gPSAwLjQ7XG5jb25zdCBNSU5fTFVNID0gMC43NTtcbmNvbnN0IExVTV9ERUxUQSA9IC0wLjAwMDAxOy0wLjAwMDA1OzAuMDAwNTtcbmxldCBSRVBSX1BST0JBQklMSVRZID0gMC4wMDU7MC4xOzAuMjA7MC4wMDI0O1xuY29uc3QgSFVFX0NIQU5HRSA9IDAuMDI7XG5jb25zdCBTQVRfQ0hBTkdFID0gMC4wNTtcbmNvbnN0IE1JTl9TQVQgPSAwLjc7XG5jb25zdCBNQVhfU0FUID0gMTtcblxubGV0IGdldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGdyaWQsIHgsIHksIHZpZXdSZWN0KSB7XG4gIGxldCBuZWlnaGJvcnMgPSBncmlkLmdldERpcmVjdE5laWdoYm9ycyh4LCB5KTtcbiAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gZ3JpZC5nZXQodmFsdWUueCwgdmFsdWUueSkgPT0gbnVsbCk7XG4gIGlmICh2aWV3UmVjdCAhPSBudWxsKSB7XG4gICAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gKFxuICAgICAgICAgIHZpZXdSZWN0LmxlZnQgPD0gdmFsdWUueCAmJiB2YWx1ZS54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gICAgICAgICAgdmlld1JlY3QudG9wIDw9IHZhbHVlLnkgJiYgdmFsdWUueSA8PSB2aWV3UmVjdC5ib3R0b20pKTtcbiAgfVxuICByZXR1cm4gbmVpZ2hib3JzO1xufTtcblxuXG5sZXQga2V5SW50ZXJhY3Rpdml0eSA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5cblxubGV0IGludGVyYWN0aXZpdHkgPSBuZXcgTW91c2VJbnRlcmFjdGl2aXR5KGNhbnZhcyk7XG5sZXQgZHJhZ1Bvc2l0aW9uOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xubGV0IGxhc3REcmFnUG9zaXRpb246bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG5cbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignZHJhZy1zdGFydCcsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGlmIChwb3NpdGlvbi54ID09IG51bGwgfHwgcG9zaXRpb24ueSA9PSBudWxsKSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSB7eDogcG9zaXRpb24ueCwgeTogcG9zaXRpb24ueX07XG4vLyAgIH1cbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdkcmFnLW1vdmUnLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBpZiAocG9zaXRpb24ueCA9PSBudWxsIHx8IHBvc2l0aW9uLnkgPT0gbnVsbCkge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0ge3g6IHBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnl9O1xuLy8gICB9XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbihbJ2RyYWctZW5kJywgJ2NsaWNrJ10sIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2NsaWNrJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgY29uc29sZS5sb2coZ2V0TmVpZ2hib3JzKGdyaWQsIGhvdmVyZWQueCwgaG92ZXJlZC55LCBudWxsKSk7XG4vLyB9KTtcblxuLy8gbGV0IGhvdmVyZWQgPSB7eDogMCwgeTogMH07XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2hvdmVyJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgbGV0IGdyaWRDb29yZCA9IHJlbmRlcmVyLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG4vLyAgIGhvdmVyZWQueCA9IE1hdGguZmxvb3IoZ3JpZENvb3JkLngpO1xuLy8gICBob3ZlcmVkLnkgPSBNYXRoLmZsb29yKGdyaWRDb29yZC55KTtcbi8vIH0pO1xuXG5cbmxldCB1cGRhdGVBY3RpdmVDZWxscyA9IGZ1bmN0aW9uKGR0LCB2aWV3UmVjdCk6dm9pZCB7XG4gIGxldCBuZXdBY3RpdmVDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIGZvciAobGV0IGFjdGl2ZUNlbGwgb2YgYWN0aXZlQ2VsbHMpIHtcbiAgICBsZXQga2VlcCA9IHRydWU7XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGxldCBleGlzdGVkID0gZXhpc3RpbmcgIT0gbnVsbDtcbiAgICBpZiAoZXhpc3RpbmcgPT0gbnVsbCkge1xuICAgICAgZXhpc3RpbmcgPSB7aDogTWF0aC5yYW5kb20oKSwgczogTWF0aC5yYW5kb20oKSAqIChNQVhfU0FUIC0gTUlOX1NBVCkgKyBNSU5fU0FULCBsOiBJTklUSUFMX0xVTX07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdMID0gZXhpc3RpbmcubCArPSBMVU1fREVMVEEgKiAoZHQgLyAxMDAwKTtcbiAgICAgIGlmIChMVU1fREVMVEEgPiAwICYmIG5ld0wgPj0gTUFYX0xVTSkge1xuICAgICAgICBuZXdMID0gTUFYX0xVTTtcbiAgICAgIH1cbiAgICAgIGlmIChMVU1fREVMVEEgPCAwICYmIG5ld0wgPD0gTUlOX0xVTSkge1xuICAgICAgICBuZXdMID0gTUlOX0xVTTtcbiAgICAgIH1cbiAgICAgIGV4aXN0aW5nLmwgPSBuZXdMO1xuICAgIH1cbiAgICBpZiAoIWV4aXN0ZWQpIHtcbiAgICAgIGdyaWQuc2V0KGV4aXN0aW5nLCBhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSk7XG4gICAgfVxuICAgIGlmIChrZWVwKSB7XG4gICAgICBsZXQgcG9zaXRpdmVfZGVsdGEgPSBMVU1fREVMVEEgPiAwO1xuICAgICAgaWYgKChwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sID49IE1BWF9MVU0pIHx8XG4gICAgICAgICAgKCFwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sIDw9IE1JTl9MVU0pKSB7XG4gICAgICAgIGV4aXN0aW5nLmNvbG9yID0gZ2V0SHNsQ2VsbENvbG9yKGV4aXN0aW5nKTtcbiAgICAgICAgZWRnZUNlbGxzLnB1c2goYWN0aXZlQ2VsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBY3RpdmVDZWxscy5wdXNoKGFjdGl2ZUNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhY3RpdmVDZWxscyA9IG5ld0FjdGl2ZUNlbGxzO1xufTtcblxubGV0IHJlcHJvZHVjZUNlbGxzID0gZnVuY3Rpb24oZHQsIHZpZXdSZWN0KTpib29sZWFuIHtcbiAgbGV0IHJldHVyblRydWUgPSBmYWxzZTtcbiAgd2hpbGUgKChhY3RpdmVDZWxscy5sZW5ndGggPiAwIHx8IGVkZ2VDZWxscy5sZW5ndGggPiAwKSAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkpIHtcbiAgICAvLyBsZXQgYWN0aXZlQ2VsbCA9IHdlaWdodGVkUmFuZG9tKGFjdGl2ZUNlbGxzLmNvbmNhdChlZGdlQ2VsbHMpLCAoY2VsbCkgPT4ge1xuICAgIC8vICAgbGV0IG5laWdoYm9ycyA9IGdyaWQuZ2V0TmVpZ2hib3JzKGNlbGwueCwgY2VsbC55KVxuICAgIC8vICAgICAgIC5maWx0ZXIoKG4pID0+IGdyaWQuZ2V0KG4ueCwgbi55KSA9PSBudWxsKTtcbiAgICAvLyAgIHJldHVybiBuZWlnaGJvcnMubGVuZ3RoO1xuICAgIC8vIH0pO1xuICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhY3RpdmVDZWxscy5sZW5ndGggKyBlZGdlQ2VsbHMubGVuZ3RoKSk7XG4gICAgbGV0IGFjdGl2ZUNlbGwgPSBpbmRleCA8IGFjdGl2ZUNlbGxzLmxlbmd0aCA/IGFjdGl2ZUNlbGxzW2luZGV4XSA6IGVkZ2VDZWxsc1tpbmRleCAtIGFjdGl2ZUNlbGxzLmxlbmd0aF07XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBsZXQgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCB2aWV3UmVjdCk7XG4gICAgICBsZXQgbmV3TmVpZ2hib3I6bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gbGV0IGZpbHRlcmVkTmVpZ2hib3JzOntuZWlnaGJvcjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9LCB3ZWlnaHQ6bnVtYmVyfVtdID0gbmVpZ2hib3JzLm1hcCgobmVpZ2hib3IpID0+IHtcbiAgICAgICAgLy8gICBsZXQgbmVpZ2hib3JOZWlnaGJvcnMgPSBncmlkLmdldE5laWdoYm9ycyhuZWlnaGJvci54LCBuZWlnaGJvci55KVxuICAgICAgICAvLyAgICAgICAuZmlsdGVyKChuKSA9PiBncmlkLmdldChuLngsIG4ueSkgPT0gbnVsbCk7XG4gICAgICAgIC8vICAgcmV0dXJuIHtcbiAgICAgICAgLy8gICAgIG5laWdoYm9yOiBuZWlnaGJvcixcbiAgICAgICAgLy8gICAgIHdlaWdodDogbmVpZ2hib3JOZWlnaGJvcnMubGVuZ3RoXG4gICAgICAgIC8vICAgfTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGZpbHRlcmVkTmVpZ2hib3JzLnB1c2goe25laWdoYm9yOiBudWxsLCB3ZWlnaHQ6IDEwfSk7XG4gICAgICAgIC8vIGxldCBuID0gd2VpZ2h0ZWRSYW5kb20oZmlsdGVyZWROZWlnaGJvcnMsIChuKSA9PiBNYXRoLnBvdyhuLndlaWdodCwgOCkpLm5laWdoYm9yO1xuICAgICAgICAvLyBpZiAobiA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBsZXQgbiA9IG5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKV07XG4gICAgICAgIGxldCBkZWx0YUh1ZSA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogSFVFX0NIQU5HRTtcbiAgICAgICAgbGV0IGRlbHRhU2F0ID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBTQVRfQ0hBTkdFO1xuICAgICAgICBncmlkLnNldCh7XG4gICAgICAgICAgaDogbW9kKGV4aXN0aW5nLmggKyBkZWx0YUh1ZSwgMSksXG4gICAgICAgICAgczogY2xhbXAoZXhpc3RpbmcucyArIGRlbHRhU2F0LCBNSU5fU0FULCBNQVhfU0FUKSxcbiAgICAgICAgICBsOiBJTklUSUFMX0xVTVxuICAgICAgICB9LCBuLngsIG4ueSk7XG4gICAgICAgIG5ld05laWdoYm9yID0gbjtcbiAgICAgIH1cbiAgICAgIGxldCBuZWlnaGJvckNvbXBlbnNhdGlvbiA9IG5ld05laWdoYm9yID09IG51bGwgPyAwIDogMTtcbiAgICAgIGxldCBmZXJ0aWxlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCBudWxsKTtcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoIC0gbmVpZ2hib3JDb21wZW5zYXRpb24gIT09IGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblRydWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxldCBlZGdlSW5kZXggPSBlZGdlQ2VsbHMuaW5kZXhPZihhY3RpdmVDZWxsKTtcbiAgICAgICAgaWYgKGVkZ2VJbmRleCA+PSAwKSB7XG4gICAgICAgIC8vIGlmIChpbmRleCA+PSBhY3RpdmVDZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBlZGdlQ2VsbHMuc3BsaWNlKGluZGV4IC0gYWN0aXZlQ2VsbHMubGVuZ3RoLCAxKTtcbiAgICAgICAgICBlZGdlQ2VsbHMuc3BsaWNlKGVkZ2VJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdOZWlnaGJvciAhPSBudWxsKSB7XG4gICAgICAgIGFjdGl2ZUNlbGxzLnB1c2gobmV3TmVpZ2hib3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuVHJ1ZTtcbn1cblxuXG5cbmxldCB2aWV3UmVjdCA9IHJlbmRlcmVyLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xudmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xudmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbnZpZXdSZWN0LnJpZ2h0ID0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KSArIDE7XG52aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG5mb3IgKGxldCBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xudXBkYXRlQWN0aXZlQ2VsbHMoMTAwLCB2aWV3UmVjdClcbn1cblxubGV0IGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sb29wKChkdDpudW1iZXIpID0+IHtcbiAgaWYgKFJFUFJfUFJPQkFCSUxJVFkgPCAwLjk1KSB7XG4gICAgUkVQUl9QUk9CQUJJTElUWSArPSBkdCAvIDIwMDAwMDAwMDA7XG4gIH1cbiAgaWYgKFJFUFJfUFJPQkFCSUxJVFkgPiAwLjk1KSB7XG4gICAgUkVQUl9QUk9CQUJJTElUWSA9IDAuOTU7XG4gIH1cblxuICBsZXQgY2FtZXJhQWx0ZXJlZCA9IGZhbHNlO1xuICBpZiAoZHJhZ1Bvc2l0aW9uICE9IG51bGwpIHtcbiAgICBpZiAobGFzdERyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAoZHJhZ1Bvc2l0aW9uLnggIT09IGxhc3REcmFnUG9zaXRpb24ueCB8fFxuICAgICAgICAgIGRyYWdQb3NpdGlvbi55ICE9PSBsYXN0RHJhZ1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgbGV0IHN0YXJ0ID0gY2FtZXJhLnVudHJhbnNmb3JtKGxhc3REcmFnUG9zaXRpb24ueCwgbGFzdERyYWdQb3NpdGlvbi55KTtcbiAgICAgICAgbGV0IGVuZCA9IGNhbWVyYS51bnRyYW5zZm9ybShkcmFnUG9zaXRpb24ueCwgZHJhZ1Bvc2l0aW9uLnkpO1xuICAgICAgICBjYW1lcmEubW92ZShzdGFydC54IC0gZW5kLngsIHN0YXJ0LnkgLSBlbmQueSk7XG4gICAgICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0RHJhZ1Bvc2l0aW9uID0ge3g6IGRyYWdQb3NpdGlvbi54LCB5OiBkcmFnUG9zaXRpb24ueX07XG4gIH0gZWxzZSBpZiAobGFzdERyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgbGFzdERyYWdQb3NpdGlvbiA9IG51bGw7XG4gIH1cbiAgaWYgKGtleUludGVyYWN0aXZpdHkuaXNEb3duKDE4OSkpIHsgLy8gbWludXNcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpICogMS4xKTtcbiAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgfVxuICBpZiAoa2V5SW50ZXJhY3Rpdml0eS5pc0Rvd24oMTg3KSkgeyAvLyBwbHVzXG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gIH1cblxuICBsZXQgdmlld1JlY3QgPSByZW5kZXJlci5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbiAgdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuICB2aWV3UmVjdC50b3AgPSBNYXRoLmZsb29yKHZpZXdSZWN0LnRvcCkgLSAxO1xuICB2aWV3UmVjdC5yaWdodCA9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCkgKyAxO1xuICB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4gIC8vZm9yIChsZXQgaSA9IDA7IGkgPCA1MDA7IGkrKykge1xuICB1cGRhdGVBY3RpdmVDZWxscyhkdCwgdmlld1JlY3QpO1xuICByZXByb2R1Y2VDZWxscyhkdCwgdmlld1JlY3QpO1xuICAvLyB9XG4gIGlmIChncmlkLmdldENvdW50KCkgLyAoKHZpZXdSZWN0LmJvdHRvbSAtIHZpZXdSZWN0LnRvcCkgKiAodmlld1JlY3QucmlnaHQgLSB2aWV3UmVjdC5sZWZ0KSkgPiAxLjAwMSkge1xuICAgIGxldCBjdXJyZW50Wm9vbSA9IGNhbWVyYS5nZXRab29tKCk7XG4gICAgaWYgKGN1cnJlbnRab29tIDwgMS8zKSB7XG4gICAgICBjYW1lcmEuc2V0Wm9vbShjdXJyZW50Wm9vbSAqIDIpO1xuICAgICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgKGFjdGl2ZUNlbGxzLmxlbmd0aCA9PT0gMCAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkgLyAyKSB7XG4gIC8vICAgbGV0IGV4aXN0aW5nOntba2V5OnN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIC8vICAgZ3JpZC5maWx0ZXJlZE1hcCh7eDogdmlld1JlY3QubGVmdCwgeTogdmlld1JlY3QudG9wfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgIHt4OiB2aWV3UmVjdC5yaWdodCwgeTogdmlld1JlY3QuYm90dG9tfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgICh2YWx1ZSwgeCwgeSkgPT4gKGV4aXN0aW5nW3ggKyAnLycgKyB5XSA9IHRydWUpKTtcbiAgLy8gICBsZXQgbm9uRXhpc3Rpbmc6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IHggPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpOyB4IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCk7IHgrKykge1xuICAvLyAgICAgZm9yIChsZXQgeSA9IE1hdGguZmxvb3Iodmlld1JlY3QudG9wKTsgeSA8PSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKTsgeSsrKSB7XG4gIC8vICAgICAgIGlmICghZXhpc3RpbmdbeCArICcvJyArIHldKSB7XG4gIC8vICAgICAgICAgbm9uRXhpc3RpbmcucHVzaCh7eDogeCwgeTogeX0pO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGFjdGl2ZUNlbGxzLnB1c2gobm9uRXhpc3RpbmdbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm9uRXhpc3RpbmcubGVuZ3RoKV0pO1xuICAvLyB9XG5cbiAgbGV0IG1haW5UcmlhbmdsZVJlbmRlcmVyID0gKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdldEhzbENlbGxDb2xvcihjZWxsKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAvLyBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICAvLyBjb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgLy8gY29udGV4dC5zdHJva2UoKTtcbiAgfTtcblxuICBpZiAoY2FtZXJhQWx0ZXJlZCB8fCBkaXJ0eUNhbnZhcykge1xuICAgIGRpcnR5Q2FudmFzID0gZmFsc2U7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBhY3RpdmVDZWxscywgbWFpblRyaWFuZ2xlUmVuZGVyZXIpO1xuICAgIHJlbmRlcmVyLnJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYSwgZWRnZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH1cblxuICAvLyByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIFtob3ZlcmVkXSwgKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgLy8gICBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgLy8gICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAvLyAgIGNvbnRleHQubGluZVdpZHRoID0gMztcbiAgLy8gICBjb250ZXh0LnN0cm9rZSgpO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gIC8vICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIC8vIH0pO1xuXG4gIC8vIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIC8vIGxldCB0aW1lUGFzc2VkID0gbm93VGltZSAtIGxhc3RUaW1lO1xuICAvLyBsYXN0VGltZSA9IG5vd1RpbWU7XG4gIC8vIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gIC8vIGNvbnRleHQuZm9udCA9ICcxNHB4IEFyaWFsJztcbiAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgLy8gY29udGV4dC5saW5lV2lkdGggPSAyO1xuICAvLyBsZXQgb25TY3JlZW5FZGdlID0gMDtcbiAgLy8gZm9yIChsZXQgZWRnZUNlbGwgb2YgZWRnZUNlbGxzKSB7XG4gIC8vICAgaWYgKHZpZXdSZWN0LmxlZnQgPD0gZWRnZUNlbGwueCAmJiBlZGdlQ2VsbC54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gIC8vICAgICAgIHZpZXdSZWN0LnRvcCA8PSBlZGdlQ2VsbC55ICYmIGVkZ2VDZWxsLnkgPD0gdmlld1JlY3QuYm90dG9tKSB7XG4gIC8vICAgICBvblNjcmVlbkVkZ2UrKztcbiAgLy8gICB9XG4gIC8vIH1cbiAgLy8gbGV0IGZwc1RleHQgPSAnRlBTOiAnICsgTWF0aC5yb3VuZCgxMDAwIC8gdGltZVBhc3NlZCkgLy8rICcgIEFjdGl2ZTogJyArIGFjdGl2ZUNlbGxzLmxlbmd0aCArICcgIEVkZ2U6ICcgKyBlZGdlQ2VsbHMubGVuZ3RoICsgJyAgb25zY3JlZW4gJyArIG9uU2NyZWVuRWRnZTtcbiAgLy8gY29udGV4dC5zdHJva2VUZXh0KGZwc1RleHQsIDEwLCAxMCk7XG4gIC8vIGNvbnRleHQuZmlsbFRleHQoZnBzVGV4dCwgMTAsIDEwKTtcbn0sIDApO1xuXG5cbnJldHVybjtcbi8qL1xuXG5cblxuXG5sZXQgdG9vbFNlbGVjdCA9IDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbC1zZWxlY3QnKTtcbmxldCB0b29sU2VsZWN0aW9uID0gJ2RyYXcnO1xubGV0IHNldFRvb2wgPSBmdW5jdGlvbihuZXdUb29sOnN0cmluZykge1xuICAvLyB0b29sU2VsZWN0aW9uID0gbmV3VG9vbDtcbiAgLy8gdG9vbFNlbGVjdC52YWx1ZSA9IG5ld1Rvb2w7XG4gIHdvcmxkLnNlbGVjdFRvb2woPGtleW9mIFRvb2xzQ29sbGVjdGlvbj5uZXdUb29sKTtcbn07XG5pZiAodG9vbFNlbGVjdCAhPSBudWxsKSB7XG4gIHRvb2xTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgc2V0VG9vbCh0b29sU2VsZWN0LnZhbHVlKTtcbiAgfSk7XG59XG5cblxuXG5sZXQgd29ybGQ6V29ybGQgPSBuZXcgV29ybGQoY2FudmFzKTtcbmxldCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmNvbnN0IFZFTE9DSVRZOm51bWJlciA9IDE1O1xuXG5sZXQga2V5cyA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5rZXlzLm1hcCgnbGVmdCcsIDY1KTtcbmtleXMubWFwKCdyaWdodCcsIDY4KTtcbmtleXMubWFwKCd1cCcsIDg3KTtcbmtleXMubWFwKCdkb3duJywgODMpO1xua2V5cy5tYXAoJ3pvb20tb3V0JywgODEpO1xua2V5cy5tYXAoJ3pvb20taW4nLCA2OSk7XG5sb29wKCgpID0+IHtcbiAgLy8gcmVuZGVyRnVsbFRyaWFuZ2xlR3JpZChncmlkLCByZW5kZXJlciwgY29udGV4dCk7XG5cbiAgd29ybGQucmVuZGVyKCk7XG5cbiAgbGV0IGNhbWVyYSA9IHdvcmxkLmdldENhbWVyYSgpO1xuXG4gIGlmIChrZXlzLmlzRG93bignem9vbS1vdXQnKSkge1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgKiAxLjEpO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bignem9vbS1pbicpKSB7XG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gIH1cblxuICBsZXQgZHggPSAwLCBkeSA9IDA7XG4gIGlmIChrZXlzLmlzRG93bignbGVmdCcpKSB7XG4gICAgZHggLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdyaWdodCcpKSB7XG4gICAgZHggKz0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCd1cCcpKSB7XG4gICAgZHkgLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdkb3duJykpIHtcbiAgICBkeSArPSBWRUxPQ0lUWTtcbiAgfVxuXG4gIGR4ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGR5ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGlmIChkeCAhPT0gMCB8fCBkeSAhPT0gMCkge1xuICAgIGNhbWVyYS5tb3ZlKGR4LCBkeSk7XG4gIH1cbn0sIDApO1xuXG4vLyAqL1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleUludGVyYWN0aXZpdHkge1xuICBwcml2YXRlIGtleXM6e1trZXk6c3RyaW5nXTogYm9vbGVhbn07XG4gIHByaXZhdGUga2V5TWFwOntba2V5OnN0cmluZ106IHN0cmluZ3xudW1iZXJ9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IHt9O1xuICAgIHRoaXMua2V5TWFwID0ge307XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGxldCBrZXljb2RlID0gZS5rZXlDb2RlO1xuICAgICAgdGhpcy5rZXlzW2tleWNvZGVdID0gdHJ1ZTtcbiAgICAgIGxldCBuYW1lID0gdGhpcy5rZXlNYXBba2V5Y29kZV07XG4gICAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMua2V5c1tuYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgbGV0IGtleWNvZGUgPSBlLmtleUNvZGU7XG4gICAgICBpZiAoa2V5Y29kZSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMua2V5c1trZXljb2RlXTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXljb2RlIGluIHRoaXMua2V5TWFwKSB7XG4gICAgICAgIGxldCBuYW1lID0gdGhpcy5rZXlNYXBba2V5Y29kZV07XG4gICAgICAgIGlmIChuYW1lICE9IG51bGwgJiYgbmFtZSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5rZXlzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBtYXAobmFtZTpzdHJpbmcsIGtleTpzdHJpbmd8bnVtYmVyKSB7XG4gICAgdGhpcy5rZXlNYXBba2V5XSA9IG5hbWU7XG4gIH1cblxuICBpc0Rvd24oa2V5OnN0cmluZ3xudW1iZXIpOmJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMua2V5c1trZXldO1xuICB9XG5cbiAgZ2V0RG93bigpOnN0cmluZ1tdIHtcbiAgICBsZXQga2V5czpzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmtleXMpIHtcbiAgICAgIGlmICh0aGlzLmlzRG93bihrZXkpKSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxufVxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuL2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlSW50ZXJhY3Rpdml0eSB7XG4gIGV2ZW50czpFdmVudHM7XG5cbiAgcHJpdmF0ZSBlbGVtZW50OkhUTUxFbGVtZW50O1xuICBwcml2YXRlIGRvd246Ym9vbGVhbjtcbiAgcHJpdmF0ZSBwb3NpdGlvbjp7eD86bnVtYmVyLCB5PzpudW1iZXJ9O1xuICBwcml2YXRlIGRyYWdnaW5nOmJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDpIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHt9O1xuICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZURvd24oZSkpO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZU1vdmUoZSkpO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcChlKSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlVXAoe1xuICAgICAgb2Zmc2V0WDogZS5vZmZzZXRYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICBvZmZzZXRZOiBlLm9mZnNldFkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wfSwgZmFsc2UpKTtcbiAgfVxuXG4gIGlzRG93bigpIHsgcmV0dXJuIHRoaXMuZG93bjsgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VVcChldmVudCwgZXZlbnRzOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuZG93bikge1xuICAgICAgbGV0IHBvc2l0aW9uID0ge3g6IGV2ZW50Lm9mZnNldFgsIHk6IGV2ZW50Lm9mZnNldFl9O1xuICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICBpZiAoZXZlbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1lbmQnLCBwb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnY2xpY2snLCBwb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMucG9zaXRpb24ueSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlTW92ZShldmVudCkge1xuICAgIGlmICh0aGlzLmRvd24pIHtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgICB0aGlzLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZO1xuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIGRvd24gd2hlbiB3ZSByZWNlaXZlIHRoZSBtb3VzZWRvd24gb3IgbW92ZSBldmVudCwgdGhlblxuICAgICAgLy8gd2UgYXJlIGRyYWdnaW5nLlxuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLXN0YXJ0JywgdGhpcy5wb3NpdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLW1vdmUnLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ldmVudHMuZW1pdCgnaG92ZXInLCB7eDogZXZlbnQub2Zmc2V0WCwgeTogZXZlbnQub2Zmc2V0WX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VEb3duKGV2ZW50KSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZO1xuICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgdGhpcy5ldmVudHMuZW1pdCgnZG93bicsIHRoaXMucG9zaXRpb24pO1xuICB9XG59XG4iXX0=
