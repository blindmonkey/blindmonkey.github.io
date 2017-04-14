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
    window.addEventListener('orientationchange', resize);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbW91c2UtaW50ZXJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPRSxZQUFZLGFBQW9CLEVBQUUsY0FBcUI7UUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQ3ZCLElBQUks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LENBQUMsQ0FBQztRQUNSLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElB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QUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQzdCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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O1FBQ2xFLENBQUM7SUFDSCxDQUFDO0lBRU8sZUFBZSxDQUFDLEtBQUs7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGO0FBL0RELHFDQStEQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDYW1lcmEge1xuICAvLyBXb3JsZC1zcGFjZSBjYW1lcmEgZm9jdXMgcG9zaXRpb24uXG4gIHByaXZhdGUgeDpudW1iZXI7XG4gIHByaXZhdGUgeTpudW1iZXI7XG4gIHByaXZhdGUgem9vbTpudW1iZXI7XG4gIHByaXZhdGUgdmlld3BvcnQ6e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn07XG5cbiAgY29uc3RydWN0b3Iodmlld3BvcnRXaWR0aDpudW1iZXIsIHZpZXdwb3J0SGVpZ2h0Om51bWJlcikge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLnpvb20gPSAxO1xuICAgIHRoaXMudmlld3BvcnQgPSB7d2lkdGg6IHZpZXdwb3J0V2lkdGgsIGhlaWdodDogdmlld3BvcnRIZWlnaHR9O1xuICB9XG5cbiAgZ2V0Vmlld3BvcnQoKSB7XG4gICAgcmV0dXJuIHt3aWR0aDogdGhpcy52aWV3cG9ydC53aWR0aCwgaGVpZ2h0OiB0aGlzLnZpZXdwb3J0LmhlaWdodH07XG4gIH1cblxuICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyKSB7XG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMudmlld3BvcnQuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgZ2V0Wm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy56b29tO1xuICB9XG5cbiAgc2V0Wm9vbShuZXdab29tOm51bWJlcikge1xuICAgIHRoaXMuem9vbSA9IG5ld1pvb207XG4gIH1cblxuICBtb3ZlKGR4Om51bWJlciwgZHk6bnVtYmVyKSB7XG4gICAgdGhpcy54ICs9IGR4O1xuICAgIHRoaXMueSArPSBkeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgd29ybGQtc3BhY2UgY29vcmRpbmF0ZSB0byBjYW1lcmEtc3BhY2UuXG4gICAqL1xuICB0cmFuc2Zvcm0oeDpudW1iZXIsIHk6bnVtYmVyKTp7eDpudW1iZXIsIHk6bnVtYmVyfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICh4IC0gdGhpcy54KSAvIHRoaXMuem9vbSArIHRoaXMudmlld3BvcnQud2lkdGggLyAyLFxuICAgICAgeTogKHkgLSB0aGlzLnkpIC8gdGhpcy56b29tICsgdGhpcy52aWV3cG9ydC5oZWlnaHQgLyAyLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyBhIGNvb3JkaW5hdGUgZnJvbSBjYW1lcmEtc3BhY2UgdG8gd29ybGQtc3BhY2UuXG4gICAqL1xuICB1bnRyYW5zZm9ybSh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHggLSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gMikgKiB0aGlzLnpvb20gKyB0aGlzLngsXG4gICAgICB5OiAoeSAtIHRoaXMudmlld3BvcnQuaGVpZ2h0IC8gMikgKiB0aGlzLnpvb20gKyB0aGlzLnksXG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IHR5cGUgSHN2Q29sb3IgPSB7aDpudW1iZXIsIHM6bnVtYmVyLCB2Om51bWJlcn07XG5leHBvcnQgdHlwZSBSZ2JDb2xvciA9IHtyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyfTtcblxubGV0IGNvbG9ycyA9IHtcbiAgcmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgcmFuZG9tQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcbiAgICB9O1xuICAgIGxldCByYW5kb21Db21wb25lbnRzID0gZnVuY3Rpb24obikge1xuICAgICAgbGV0IG91dDpudW1iZXJbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgb3V0LnB1c2gocmFuZG9tQ29tcG9uZW50KCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuICAgIHJldHVybiAncmdiKCcgKyByYW5kb21Db21wb25lbnRzKDMpLmpvaW4oJywnKSArICcpJztcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgcmV0dXJuICdyZ2IoJyArIFtyLCBnLCBiXS5qb2luKCcsJykgKyAnKSc7XG4gIH0sXG4gIGhleFRvUmdiOiBmdW5jdGlvbihzdHI6c3RyaW5nKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDEpO1xuICAgIHJldHVybiB7XG4gICAgICByOiBwYXJzZUludChzdHIuc2xpY2UoMCwgMiksIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHN0ci5zbGljZSgyLCA0KSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQoc3RyLnNsaWNlKDQsIDYpLCAxNiksXG4gICAgfTtcbiAgfSxcbiAgcmdiVG9IZXg6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICByID0gcnwwO1xuICAgIGcgPSBnfDA7XG4gICAgYiA9IGJ8MDtcblxuICAgIGlmIChyIDwgMCkgciA9IDA7XG4gICAgaWYgKHIgPiAyNTUpIHIgPSAyNTU7XG4gICAgaWYgKGcgPCAwKSBnID0gMDtcbiAgICBpZiAoZyA+IDI1NSkgZyA9IDI1NTtcbiAgICBpZiAoYiA8IDApIGIgPSAwO1xuICAgIGlmIChiID4gMjU1KSBiID0gMjU1O1xuXG4gICAgbGV0IHJzdHIgPSByLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAocnN0ci5sZW5ndGggPT09IDEpIHJzdHIgPSAnMCcgKyByc3RyO1xuICAgIGxldCBnc3RyID0gZy50b1N0cmluZygxNik7XG4gICAgaWYgKGdzdHIubGVuZ3RoID09PSAxKSBnc3RyID0gJzAnICsgZ3N0cjtcbiAgICBsZXQgYnN0ciA9IGIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChic3RyLmxlbmd0aCA9PT0gMSkgYnN0ciA9ICcwJyArIGJzdHI7XG4gICAgcmV0dXJuIFsnIycsIHJzdHIsIGdzdHIsIGJzdHJdLmpvaW4oJycpO1xuICB9LFxuICByZ2JUb0hzdjogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIC8vIGhzdiAgICAgICAgIG91dDtcbiAgICAvLyBkb3VibGUgICAgICBtaW4sIG1heCwgZGVsdGE7XG4gICAgciA9IHIgLyAyNTU7XG4gICAgZyA9IGcgLyAyNTU7XG4gICAgYiA9IGIgLyAyNTU7XG5cbiAgICBsZXQgbWluID0gciAgICA8IGcgPyByICAgOiBnO1xuICAgIG1pbiAgICAgPSBtaW4gIDwgYiA/IG1pbiA6IGI7XG5cbiAgICBsZXQgbWF4ID0gciAgICA+IGcgPyByICAgOiBnO1xuICAgIG1heCAgICAgPSBtYXggID4gYiA/IG1heCA6IGI7XG5cbiAgICBsZXQgb3V0ID0ge2g6IDAsIHM6IDAsIHY6IDB9O1xuICAgIGxldCB2ID0gbWF4O1xuICAgIGxldCBkZWx0YSA9IG1heCAtIG1pbjtcbiAgICBpZiAoZGVsdGEgPCAwLjAwMDAxKVxuICAgIHtcbiAgICAgICAgb3V0LnMgPSAwO1xuICAgICAgICBvdXQuaCA9IDA7IC8vIHVuZGVmaW5lZCwgbWF5YmUgbmFuP1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiggbWF4ID4gMC4wICkgeyAvLyBOT1RFOiBpZiBNYXggaXMgPT0gMCwgdGhpcyBkaXZpZGUgd291bGQgY2F1c2UgYSBjcmFzaFxuICAgICAgICBvdXQucyA9IChkZWx0YSAvIG1heCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgbWF4IGlzIDAsIHRoZW4gciA9IGcgPSBiID0gMFxuICAgICAgICAvLyBzID0gMCwgdiBpcyB1bmRlZmluZWRcbiAgICAgICAgb3V0LnMgPSAwLjA7XG4gICAgICAgIG91dC5oID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgaWYoIHIgPj0gbWF4ICkgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA+IGlzIGJvZ3VzLCBqdXN0IGtlZXBzIGNvbXBpbG9yIGhhcHB5XG4gICAgICAgIG91dC5oID0gKGcgLSBiKSAvIGRlbHRhOyAgICAgICAgLy8gYmV0d2VlbiB5ZWxsb3cgJiBtYWdlbnRhXG4gICAgZWxzZSBpZiggZyA+PSBtYXggKVxuICAgICAgICBvdXQuaCA9IDIuMCArICggYiAtIHIgKSAvIGRlbHRhOyAgLy8gYmV0d2VlbiBjeWFuICYgeWVsbG93XG4gICAgZWxzZVxuICAgICAgICBvdXQuaCA9IDQuMCArICggciAtIGcgKSAvIGRlbHRhOyAgLy8gYmV0d2VlbiBtYWdlbnRhICYgY3lhblxuXG4gICAgb3V0LmggKj0gNjAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWdyZWVzXG5cbiAgICBpZiggb3V0LmggPCAwLjAgKVxuICAgICAgICBvdXQuaCArPSAzNjAuMDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH0sXG4gIGhzdlRvUmdiOiBmdW5jdGlvbihoOm51bWJlciwgczpudW1iZXIsIGw6bnVtYmVyKSB7XG4gICAgdmFyIHIsIGcsIGI7XG5cbiAgICBpZihzID09IDApe1xuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXG4gICAgfWVsc2V7XG4gICAgICAgIHZhciBodWUycmdiID0gZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KXtcbiAgICAgICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XG4gICAgICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xuICAgICAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcbiAgICAgICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtyOiBNYXRoLnJvdW5kKHIgKiAyNTUpLCBnOiBNYXRoLnJvdW5kKGcgKiAyNTUpLCBiOiBNYXRoLnJvdW5kKGIgKiAyNTUpfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzO1xuIiwidHlwZSBIYW5kbGVyID0gKC4uLmFyZ3M6YW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50cyB7XG4gIHByaXZhdGUgaGFuZGxlcnM6e1trZXk6c3RyaW5nXTpBcnJheTxIYW5kbGVyPn07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICB9XG5cbiAgbGlzdGVuKGV2ZW50czpzdHJpbmd8QXJyYXk8c3RyaW5nPiwgaGFuZGxlcjpIYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBldmVudHMgPSBbZXZlbnRzXTtcbiAgICB9XG4gICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICBpZiAoIShldmVudCBpbiB0aGlzLmhhbmRsZXJzKSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5oYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICBlbWl0KGV2ZW50OnN0cmluZywgLi4uYXJnczphbnlbXSkge1xuICAgIGxldCBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmIChoYW5kbGVycyAhPSBudWxsKSB7XG4gICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRWaWV3TW9kZWw8VD4ge1xuICBwcml2YXRlIGdyaWQ6R3JpZDxUPjtcblxuICBjb25zdHJ1Y3RvcihncmlkOkdyaWQ8VD4pIHtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuICB9XG5cbiAgc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhOkNhbWVyYSwgeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGNlbGxTaXplID0gMTtcbiAgICBsZXQgY2VsbEhlaWdodCA9IGNlbGxTaXplO1xuICAgIGxldCBoYWxmQ2VsbEhlaWdodCA9IGNlbGxIZWlnaHQgLyAyO1xuICAgIGxldCBjZWxsV2lkdGggPSBNYXRoLnNxcnQoY2VsbEhlaWdodCAqIGNlbGxIZWlnaHQgLSBoYWxmQ2VsbEhlaWdodCAqIGhhbGZDZWxsSGVpZ2h0KTtcblxuICAgIGxldCB3b3JsZFNwYWNlID0gY2FtZXJhLnVudHJhbnNmb3JtKHgsIHkpO1xuICAgIHggPSB3b3JsZFNwYWNlLng7XG4gICAgeSA9IHdvcmxkU3BhY2UueTtcblxuICAgIGxldCBncmlkWCA9IHggLyBjZWxsV2lkdGg7XG4gICAgbGV0IGZsb29yR3JpZFggPSBNYXRoLmZsb29yKGdyaWRYKTtcbiAgICBsZXQgcmVtYWluZGVyWCA9IGdyaWRYIC0gZmxvb3JHcmlkWDtcblxuICAgIGxldCBncmlkWSA9IHkgLyBjZWxsSGVpZ2h0ICogMiArIDEgLSBncmlkWDtcbiAgICBsZXQgZmxvb3JlZEdyaWRZID0gTWF0aC5mbG9vcihncmlkWSAvIDIpICogMjtcblxuICAgIGxldCByZW1haW5kZXJZID0gKGdyaWRZIC0gZmxvb3JlZEdyaWRZKSAvIDI7XG4gICAgZ3JpZFkgPSBmbG9vcmVkR3JpZFk7XG4gICAgaWYgKHJlbWFpbmRlclkgPiAxIC0gcmVtYWluZGVyWCkge1xuICAgICAgZ3JpZFkgKz0gMTtcbiAgICB9XG4gICAgaWYgKGZsb29yR3JpZFggJSAyICE9PSAwKSB7XG4gICAgICBncmlkWSArPSAxO1xuICAgIH1cblxuICAgIGxldCBiaUNvbHVtbiA9IE1hdGguZmxvb3IoZmxvb3JHcmlkWCAvIDIpO1xuICAgIGdyaWRZICs9IGJpQ29sdW1uICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBncmlkWCxcbiAgICAgIHk6IGdyaWRZLFxuICAgIH07XG4gIH1cblxuICBnZXRHcmlkVmlld1JlY3QoY2FtZXJhOkNhbWVyYSk6e2xlZnQ6bnVtYmVyLCB0b3A6bnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyfSB7XG4gICAgbGV0IHZpZXdwb3J0ID0gY2FtZXJhLmdldFZpZXdwb3J0KCk7XG4gICAgbGV0IHt3aWR0aCwgaGVpZ2h0fSA9IHZpZXdwb3J0O1xuICAgIGxldCB0b3BMZWZ0ID0gdGhpcy5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIDAsIDApO1xuICAgIGxldCBib3R0b21SaWdodCA9IHRoaXMuc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdG9wTGVmdC54LCB0b3A6IHRvcExlZnQueSxcbiAgICAgIHJpZ2h0OiBib3R0b21SaWdodC54LCBib3R0b206IGJvdHRvbVJpZ2h0LnlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUcmlhbmdsZShjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgY2FtZXJhOkNhbWVyYSwgeDpudW1iZXIsIHk6bnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHQ6VHxudWxsLCB4Om51bWJlciwgeTpudW1iZXIpPT52b2lkKSB7XG4gICAgbGV0IHRyaWFuZ2xlUGF0aCA9IGZ1bmN0aW9uKFxuICAgICAgICB4MTpudW1iZXIsIHkxOm51bWJlciwgeDI6bnVtYmVyLCB5MjpudW1iZXIsIHgzOm51bWJlciwgeTM6bnVtYmVyKSB7XG4gICAgICBsZXQgcDEgPSBjYW1lcmEudHJhbnNmb3JtKHgxLCB5MSk7XG4gICAgICBsZXQgcDIgPSBjYW1lcmEudHJhbnNmb3JtKHgyLCB5Mik7XG4gICAgICBsZXQgcDMgPSBjYW1lcmEudHJhbnNmb3JtKHgzLCB5Myk7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8ocDEueCwgcDEueSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhwMi54LCBwMi55KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHAzLngsIHAzLnkpO1xuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB9O1xuICAgIGxldCBjZWxsSGVpZ2h0ID0gMTtcbiAgICBsZXQgaGFsZkNlbGxIZWlnaHQgPSBjZWxsSGVpZ2h0IC8gMjtcbiAgICBsZXQgY2VsbFdpZHRoID0gTWF0aC5zcXJ0KGNlbGxIZWlnaHQgKiBjZWxsSGVpZ2h0IC0gaGFsZkNlbGxIZWlnaHQgKiBoYWxmQ2VsbEhlaWdodCk7XG4gICAgbGV0IHh4ID0geDtcbiAgICBsZXQgeXkgPSB5IC8gMiAtIC41O1xuICAgIGxldCBsZWZ0VHJpYW5nbGUgPSB4ICUgMiAhPT0gMDtcbiAgICBpZiAoeSAlIDIgIT09IDApIHtcbiAgICAgICAgbGVmdFRyaWFuZ2xlID0gIWxlZnRUcmlhbmdsZTtcbiAgICB9XG4gICAgaWYgKGxlZnRUcmlhbmdsZSkge1xuICAgICAgdHJpYW5nbGVQYXRoKCB4eCAgICAqIGNlbGxXaWR0aCwgKHl5Ky41KSAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgKHh4KzEpICogY2VsbFdpZHRoLCAgeXkgICAgICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICh5eSsxKSAgKiBjZWxsSGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJpYW5nbGVQYXRoKCB4eCAgICAqIGNlbGxXaWR0aCwgIHl5ICAgICAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgKHh4KzEpICogY2VsbFdpZHRoLCAoeXkrLjUpICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICB4eCAqIGNlbGxXaWR0aCwgICAgICh5eSsxKSAqIGNlbGxIZWlnaHQpO1xuICAgIH1cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdyaWQuZ2V0KHgsIHkpO1xuICAgIGRyYXdUcmlhbmdsZShjb250ZXh0LCB2YWx1ZSwgeCwgeSk7XG4gIH1cblxuICByZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmE6Q2FtZXJhLCBjZWxsczpBcnJheTx7eDpudW1iZXIsIHk6bnVtYmVyfT4sXG4gICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dCwgdDpULCB4Om51bWJlciwgeTpudW1iZXIpPT52b2lkKSB7XG4gICAgZm9yIChsZXQgY29vcmQgb2YgY2VsbHMpIHtcbiAgICAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCBjb29yZC54LCBjb29yZC55LCBkcmF3VHJpYW5nbGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFsbENlbGxzKGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjYW1lcmE6Q2FtZXJhLFxuICAgICAgICAgICAgICAgICBkcmF3VHJpYW5nbGU6KGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgIC8vIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgbGV0IHZpc2libGVSZWN0ID0gdGhpcy5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbiAgICB0aGlzLmdyaWQuZmlsdGVyZWRNYXAoXG4gICAgICAgIHt4OiBNYXRoLmZsb29yKHZpc2libGVSZWN0LmxlZnQpLCB5OiBNYXRoLmZsb29yKHZpc2libGVSZWN0LnRvcCl9LFxuICAgICAgICB7eDogTWF0aC5jZWlsKHZpc2libGVSZWN0LnJpZ2h0ICsgMSksIHk6IE1hdGguY2VpbCh2aXNpYmxlUmVjdC5ib3R0b20gKyAxKX0sXG4gICAgICAgICh2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRyaWFuZ2xlKGNvbnRleHQsIGNhbWVyYSwgeCwgeSwgZHJhd1RyaWFuZ2xlKSk7XG4gICAgLy8gdGhpcy5ncmlkLm1hcCgodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB7XG4gICAgLy8gICB0aGlzLnJlbmRlclRyaWFuZ2xlKGNvbnRleHQsIGNhbWVyYSwgeCwgeSwgZHJhd1RyaWFuZ2xlKTtcbiAgICAvLyB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL2NhbWVyYSc7XG5cbmltcG9ydCBjb29yZHMgZnJvbSAnLi9jb29yZHMnO1xuXG5cbmNvbnN0IENPT1JEX0lOREVYOntba2V5Om51bWJlcl06e1trZXk6bnVtYmVyXTogc3RyaW5nfX0gPSB7fTtcblxuXG5jb25zdCBDSFVOS19TSVpFID0gNjQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQ8VD4ge1xuICBwcml2YXRlIGNvdW50Om51bWJlcjtcbiAgcHJpdmF0ZSBncmlkOntba2V5OnN0cmluZ106IHtjb29yZDoge3g6bnVtYmVyLCB5Om51bWJlcn0sIHZhbHVlOiBUfX07XG4gIHByaXZhdGUgY2h1bmtzOntba2V5OnN0cmluZ106IHtcbiAgICBjb29yZDp7eDpudW1iZXIsIHk6bnVtYmVyfSxcbiAgICBjb3VudDpudW1iZXIsXG4gICAgZGF0YTp7W2tleTpzdHJpbmddOiB7Y29vcmQ6IHt4Om51bWJlciwgeTpudW1iZXJ9LCB2YWx1ZTogVH19fX07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5ncmlkID0ge307XG4gICAgdGhpcy5jaHVua3MgPSB7fTtcbiAgfVxuXG4gIGdldENvdW50KCkgeyByZXR1cm4gdGhpcy5jb3VudDsgfVxuXG4gIHByaXZhdGUgZ2V0S2V5KHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIHggPSB4fDA7XG4gICAgeSA9IHl8MDtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3gsIHldKTtcbiAgICAvLyBsZXQgYSA9IENPT1JEX0lOREVYW3hdO1xuICAgIC8vIGlmIChhICE9IG51bGwpIHtcbiAgICAvLyAgIGxldCBiID0gYVt5XTtcbiAgICAvLyAgIGlmIChiICE9IG51bGwpIHtcbiAgICAvLyAgICAgcmV0dXJuIGI7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIGxldCByZXN1bHQgPSB4ICsgJy8nICsgeTsvL1t4LCB5XS5qb2luKCcvJyk7XG4gICAgLy8gaWYgKCEoeCBpbiBDT09SRF9JTkRFWCkpIHtcbiAgICAvLyAgIENPT1JEX0lOREVYW3hdID0ge307XG4gICAgLy8gfVxuICAgIC8vIHJldHVybiBDT09SRF9JTkRFWFt4XVt5XSA9IHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2h1bmtDb29yZCh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge3g6IE1hdGguZmxvb3IoeCAvIENIVU5LX1NJWkUpLFxuICAgICAgICAgICAgeTogTWF0aC5mbG9vcih5IC8gQ0hVTktfU0laRSl9XG4gIH1cblxuICBnZXQoeDpudW1iZXIsIHk6bnVtYmVyKTpUfG51bGwge1xuICAgIGxldCBjaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKHgsIHkpO1xuICAgIGxldCBjaHVua0tleSA9IHRoaXMuZ2V0S2V5KGNodW5rQ29vcmQueCwgY2h1bmtDb29yZC55KTtcbiAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgaWYgKGNodW5rID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIGxldCBjZWxsID0gY2h1bmsuZGF0YVt0aGlzLmdldEtleSh4LCB5KV07XG4gICAgcmV0dXJuIGNlbGwgJiYgY2VsbC52YWx1ZTtcbiAgICAvLyBsZXQgdmFsdWUgPSB0aGlzLmdyaWRbdGhpcy5nZXRLZXkoeCwgeSldO1xuICAgIC8vIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS52YWx1ZTtcbiAgfVxuXG4gIHNldCh2YWx1ZTpUfG51bGwsIHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIC8vIGxldCBrZXkgPSB0aGlzLmdldEtleSh4LCB5KTtcbiAgICAvLyBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIC8vICAgaWYgKGtleSBpbiB0aGlzLmdyaWQpIHtcbiAgICAvLyAgICAgZGVsZXRlIHRoaXMuZ3JpZFtrZXldO1xuICAgIC8vICAgfVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICB0aGlzLmdyaWRba2V5XSA9IHtjb29yZDp7eCwgeX0sIHZhbHVlOiB2YWx1ZX07XG4gICAgLy8gfVxuICAgIGxldCBrZXkgPSB0aGlzLmdldEtleSh4LCB5KTtcbiAgICBsZXQgY2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZCh4LCB5KTtcbiAgICBsZXQgY2h1bmtLZXkgPSB0aGlzLmdldEtleShjaHVua0Nvb3JkLngsIGNodW5rQ29vcmQueSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIGlmICghKGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSkge1xuICAgICAgICB0aGlzLmNodW5rc1tjaHVua0tleV0gPSB7Y29vcmQ6IGNodW5rQ29vcmQsIGNvdW50OiAwLCBkYXRhOiB7fX07XG4gICAgICB9XG4gICAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICBpZiAoIShrZXkgaW4gY2h1bmsuZGF0YSkpIHtcbiAgICAgICAgY2h1bmsuY291bnQrKztcbiAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgfVxuICAgICAgY2h1bmsuZGF0YVtrZXldID0ge2Nvb3JkOnt4LCB5fSwgdmFsdWU6IHZhbHVlfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSB7XG4gICAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBjaHVuay5kYXRhKSB7XG4gICAgICAgICAgY2h1bmsuY291bnQtLTtcbiAgICAgICAgICB0aGlzLmNvdW50LS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNodW5rLmNvdW50ID4gMCkge1xuICAgICAgICAgIGRlbGV0ZSBjaHVuay5kYXRhW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgLy8gaWYgKHZhbHVlID09IG51bGwpXG4gIH1cblxuICBtYXAoZjoodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ3JpZCkge1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5ncmlkW2tleV07XG4gICAgICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgIH1cbiAgfVxuXG4gIGZpbHRlcmVkTWFwKG1pbjp7eDpudW1iZXIsIHk6bnVtYmVyfSwgbWF4Ont4Om51bWJlciwgeTpudW1iZXJ9LFxuICAgICAgICAgICAgICBmOih2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAvLyBUT0RPOiBJbmRleCB0aGUgZ3JpZCBvciBzb21ldGhpbmcuIEl0J3MgcHJldHR5IGluZWZmaWNpZW50LlxuICAgIGxldCBzdGFydENodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQobWluLngsIG1pbi55KTtcbiAgICBsZXQgZW5kQ2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZChtYXgueCwgbWF4LnkpO1xuICAgIGVuZENodW5rQ29vcmQueCsrO1xuICAgIGVuZENodW5rQ29vcmQueSsrO1xuICAgIGZvciAobGV0IGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSB7XG4gICAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICBsZXQgY2h1bmtDb29yZCA9IGNodW5rLmNvb3JkO1xuICAgICAgaWYgKHN0YXJ0Q2h1bmtDb29yZC54IDw9IGNodW5rQ29vcmQueCAmJiBjaHVua0Nvb3JkLnggPD0gZW5kQ2h1bmtDb29yZC54ICYmXG4gICAgICAgICAgc3RhcnRDaHVua0Nvb3JkLnkgPD0gY2h1bmtDb29yZC55ICYmIGNodW5rQ29vcmQueSA8PSBlbmRDaHVua0Nvb3JkLnkpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNodW5rLmRhdGEpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBjaHVuay5kYXRhW2tleV07XG4gICAgICAgICAgbGV0IGNvb3JkID0gdmFsdWUuY29vcmQ7XG4gICAgICAgICAgaWYgKG1pbi54IDw9IGNvb3JkLnggJiYgY29vcmQueCA8IG1heC54ICYmXG4gICAgICAgICAgICAgIG1pbi55IDw9IGNvb3JkLnkgJiYgY29vcmQueSA8IG1heC55KSB7XG4gICAgICAgICAgICBmKHZhbHVlLnZhbHVlLCBjb29yZC54LCBjb29yZC55KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZm9yIChsZXQga2V5IGluIHRoaXMuZ3JpZCkge1xuICAgIC8vICAgbGV0IHZhbHVlID0gdGhpcy5ncmlkW2tleV07XG4gICAgLy8gICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAvLyAgIGlmIChtaW4ueCA8PSBjb29yZC54ICYmIGNvb3JkLnggPCBtYXgueCAmJlxuICAgIC8vICAgICAgIG1pbi55IDw9IGNvb3JkLnkgJiYgY29vcmQueSA8IG1heC55KSB7XG4gICAgLy8gICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICB9XG5cbiAgZ2V0RGlyZWN0TmVpZ2hib3JzKHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIGxldCBkYyA9IChkeDpudW1iZXIsIGR5Om51bWJlcikgPT4ge3JldHVybiB7eDogeCArIGR4LCB5OiB5ICsgZHl9fTtcbiAgICBsZXQgbmVpZ2hib3JzID0gW2RjKDAsIC0xKSwgZGMoMCwgMSldO1xuICAgIGlmIChNYXRoLmFicyh4ICUgMikgPT09IE1hdGguYWJzKHkgJSAyKSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgMCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZ2V0TmVpZ2hib3JzKHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIGxldCBkYyA9IChkeDpudW1iZXIsIGR5Om51bWJlcikgPT4ge3JldHVybiB7eDogeCArIGR4LCB5OiB5ICsgZHl9fTtcbiAgICBsZXQgbmVpZ2hib3JzID0gW1xuICAgICAgZGMoLTEsIDApLCBkYygtMSwgLTEpLCBkYygwLCAtMSksXG4gICAgICBkYygxLCAtMSksIGRjKDEsIDApLCBkYygxLCAxKSxcbiAgICAgIGRjKDAsIDEpLCBkYygtMSwgMSksXG4gICAgICBkYygwLCAtMiksIGRjKDAsIDIpXG4gICAgXTtcbiAgICBpZiAoTWF0aC5hYnMoeCAlIDIpID09PSBNYXRoLmFicyh5ICUgMikpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKC0xLCAtMikpO1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIDIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgLTIpKTtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKDEsIDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL2NhbWVyYSc7XG5pbXBvcnQgQ29sb3JTZWxlY3RDb21wb25lbnQgZnJvbSAnLi9jb2xvci1zZWxlY3QnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBHcmlkVmlld01vZGVsIGZyb20gJy4vZ3JpZC12aWV3LW1vZGVsJztcbmltcG9ydCBLZXlJbnRlcmFjdGl2aXR5IGZyb20gJy4va2V5LWludGVyYWN0aXZpdHknO1xuaW1wb3J0IE1vdXNlSW50ZXJhY3Rpdml0eSBmcm9tICcuL21vdXNlLWludGVyYWN0aXZpdHknO1xuXG5pbXBvcnQgV29ybGQgZnJvbSAnLi93b3JsZCc7XG5pbXBvcnQgeyBUb29sc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Rvb2xzJztcblxuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5cblxubGV0IHdlaWdodGVkUmFuZG9tID0gZnVuY3Rpb248VD4obGlzdDpBcnJheTxUPiwgd2VpZ2h0Rm46KFQpID0+IG51bWJlcikge1xuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHRocm93ICdlcnJvcic7XG4gIGxldCB0b3RhbFdlaWdodDpudW1iZXIgPSAwO1xuICBsZXQgd2VpZ2h0czpudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpIHtcbiAgICBsZXQgd2VpZ2h0ID0gTWF0aC5hYnMod2VpZ2h0Rm4oaXRlbSkpO1xuICAgIHRvdGFsV2VpZ2h0ICs9IHdlaWdodDtcbiAgICB3ZWlnaHRzLnB1c2god2VpZ2h0KTtcbiAgfVxuICBsZXQgbiA9IE1hdGgucmFuZG9tKCkgKiB0b3RhbFdlaWdodDtcbiAgbGV0IGN1bXVsYXRpdmVTdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHdlaWdodHMubGVuZ3RoOyBpKyspIHtcbiAgICBjdW11bGF0aXZlU3VtICs9IHdlaWdodHNbaV07XG4gICAgaWYgKG4gPD0gY3VtdWxhdGl2ZVN1bSkge1xuICAgICAgcmV0dXJuIGxpc3RbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG59O1xuXG5cbmxldCBzZXRTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgbGV0IHN0YXR1c0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKTtcbiAgaWYgKHN0YXR1c0RpdiAhPSBudWxsKSB7XG4gICAgc3RhdHVzRGl2LnRleHRDb250ZW50ID0gc3RhdHVzO1xuICB9XG59O1xuXG5cbmxldCBsb29wID0gZnVuY3Rpb24oZiwgZHQpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChkdCkgPT4gbG9vcChmLCBkdCkpO1xuICBmKGR0KTtcbn07XG5cblxudHlwZSBDZWxsVHlwZSA9IHN0cmluZztcblxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblxubGV0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5sZXQgY2FudmFzV2lkdGg6bnVtYmVyID0gY2FudmFzLndpZHRoO1xubGV0IGNhbnZhc0hlaWdodDpudW1iZXIgPSBjYW52YXMuaGVpZ2h0O1xuXG5cbi8vKiBBZGQvcmVtb3ZlIGEgJy8nIHRvL2Zyb20gdGhlIGJlZ2lubmluZyBvZiB0aGlzIGxpbmUgdG8gc3dpdGNoIG1vZGVzXG5cbmxldCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmxldCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuY2FtZXJhLnNldFpvb20oMS85Nik7XG5cblxudHlwZSBIU0xDZWxsID0ge2g6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIsIGNvbG9yPzpzdHJpbmd9O1xubGV0IGdyaWQ6R3JpZDxIU0xDZWxsPiA9IG5ldyBHcmlkPEhTTENlbGw+KCk7XG5sZXQgcmVuZGVyZXI6R3JpZFZpZXdNb2RlbDxIU0xDZWxsPiA9IG5ldyBHcmlkVmlld01vZGVsPEhTTENlbGw+KGdyaWQpO1xuXG5cbmxldCBkaXJ0eUNhbnZhcyA9IGZhbHNlO1xuXG5cbmxldCByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgZGlydHlDYW52YXMgPSB0cnVlO1xufTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgcmVzaXplKTtcbnJlc2l6ZSgpO1xuXG5sZXQgZ2V0SHNsQ2VsbENvbG9yID0gZnVuY3Rpb24oY2VsbDpIU0xDZWxsKTpzdHJpbmcge1xuICBsZXQgY29sb3IgPSBjZWxsLmNvbG9yO1xuICBpZiAoY29sb3IgPT0gbnVsbCkge1xuICAgIGxldCByZ2IgPSBjb2xvcnMuaHN2VG9SZ2IoY2VsbC5oLCBjZWxsLnMsIGNlbGwubCk7XG4gICAgY29sb3IgPSBjb2xvcnMucmdiVG9IZXgocmdiLnIsIHJnYi5nLCByZ2IuYik7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufTtcblxuLy8gZ3JpZC5zZXQoe2g6IDAsIHM6IDEsIGw6IDF9LCAwLCAwKTtcblxubGV0IG1vZCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtOm51bWJlcik6bnVtYmVyIHtcbiAgbGV0IG1vZGRlZCA9IG4gJSBtO1xuICBpZiAobiA8IDApIG4gKz0gbTtcbiAgcmV0dXJuIG47XG59O1xubGV0IGNsYW1wID0gZnVuY3Rpb24objpudW1iZXIsIG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlciB7XG4gIGlmIChuIDwgbWluKSByZXR1cm4gbWluO1xuICBpZiAobiA+IG1heCkgcmV0dXJuIG1heDtcbiAgcmV0dXJuIG47XG59O1xuXG5cblxuXG5sZXQgYWN0aXZlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFt7eDogMCwgeTogMH1dO1xubGV0IGVkZ2VDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW11cblxuY29uc3QgSU5JVElBTF9MVU0gPSAxO1xuY29uc3QgTUFYX0xVTSA9IDAuNDtcbmNvbnN0IE1JTl9MVU0gPSAwLjc1O1xuY29uc3QgTFVNX0RFTFRBID0gLTAuMDAwMDE7LTAuMDAwMDU7MC4wMDA1O1xubGV0IFJFUFJfUFJPQkFCSUxJVFkgPSAwLjAwNTswLjE7MC4yMDswLjAwMjQ7XG5jb25zdCBIVUVfQ0hBTkdFID0gMC4wMjtcbmNvbnN0IFNBVF9DSEFOR0UgPSAwLjA1O1xuY29uc3QgTUlOX1NBVCA9IDAuNztcbmNvbnN0IE1BWF9TQVQgPSAxO1xuXG5sZXQgZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oZ3JpZCwgeCwgeSwgdmlld1JlY3QpIHtcbiAgbGV0IG5laWdoYm9ycyA9IGdyaWQuZ2V0RGlyZWN0TmVpZ2hib3JzKHgsIHkpO1xuICBuZWlnaGJvcnMgPSBuZWlnaGJvcnMuZmlsdGVyKFxuICAgICAgKHZhbHVlOnt4Om51bWJlciwgeTpudW1iZXJ9KSA9PiBncmlkLmdldCh2YWx1ZS54LCB2YWx1ZS55KSA9PSBudWxsKTtcbiAgaWYgKHZpZXdSZWN0ICE9IG51bGwpIHtcbiAgICBuZWlnaGJvcnMgPSBuZWlnaGJvcnMuZmlsdGVyKFxuICAgICAgKHZhbHVlOnt4Om51bWJlciwgeTpudW1iZXJ9KSA9PiAoXG4gICAgICAgICAgdmlld1JlY3QubGVmdCA8PSB2YWx1ZS54ICYmIHZhbHVlLnggPD0gdmlld1JlY3QucmlnaHQgJiZcbiAgICAgICAgICB2aWV3UmVjdC50b3AgPD0gdmFsdWUueSAmJiB2YWx1ZS55IDw9IHZpZXdSZWN0LmJvdHRvbSkpO1xuICB9XG4gIHJldHVybiBuZWlnaGJvcnM7XG59O1xuXG5cbmxldCBrZXlJbnRlcmFjdGl2aXR5ID0gbmV3IEtleUludGVyYWN0aXZpdHkoKTtcblxuXG5sZXQgaW50ZXJhY3Rpdml0eSA9IG5ldyBNb3VzZUludGVyYWN0aXZpdHkoY2FudmFzKTtcbmxldCBkcmFnUG9zaXRpb246bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG5sZXQgbGFzdERyYWdQb3NpdGlvbjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9ID0gbnVsbDtcblxuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdkcmFnLXN0YXJ0JywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgaWYgKHBvc2l0aW9uLnggPT0gbnVsbCB8fCBwb3NpdGlvbi55ID09IG51bGwpIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IHt4OiBwb3NpdGlvbi54LCB5OiBwb3NpdGlvbi55fTtcbi8vICAgfVxuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2RyYWctbW92ZScsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGlmIChwb3NpdGlvbi54ID09IG51bGwgfHwgcG9zaXRpb24ueSA9PSBudWxsKSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSB7eDogcG9zaXRpb24ueCwgeTogcG9zaXRpb24ueX07XG4vLyAgIH1cbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKFsnZHJhZy1lbmQnLCAnY2xpY2snXSwgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgZHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vICAgbGFzdERyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignY2xpY2snLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBjb25zb2xlLmxvZyhnZXROZWlnaGJvcnMoZ3JpZCwgaG92ZXJlZC54LCBob3ZlcmVkLnksIG51bGwpKTtcbi8vIH0pO1xuXG4vLyBsZXQgaG92ZXJlZCA9IHt4OiAwLCB5OiAwfTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignaG92ZXInLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBsZXQgZ3JpZENvb3JkID0gcmVuZGVyZXIuc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcbi8vICAgaG92ZXJlZC54ID0gTWF0aC5mbG9vcihncmlkQ29vcmQueCk7XG4vLyAgIGhvdmVyZWQueSA9IE1hdGguZmxvb3IoZ3JpZENvb3JkLnkpO1xuLy8gfSk7XG5cblxubGV0IHVwZGF0ZUFjdGl2ZUNlbGxzID0gZnVuY3Rpb24oZHQsIHZpZXdSZWN0KTp2b2lkIHtcbiAgbGV0IG5ld0FjdGl2ZUNlbGxzOnt4Om51bWJlciwgeTpudW1iZXJ9W10gPSBbXTtcbiAgZm9yIChsZXQgYWN0aXZlQ2VsbCBvZiBhY3RpdmVDZWxscykge1xuICAgIGxldCBrZWVwID0gdHJ1ZTtcbiAgICBsZXQgZXhpc3RpbmcgPSBncmlkLmdldChhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSk7XG4gICAgbGV0IGV4aXN0ZWQgPSBleGlzdGluZyAhPSBudWxsO1xuICAgIGlmIChleGlzdGluZyA9PSBudWxsKSB7XG4gICAgICBleGlzdGluZyA9IHtoOiBNYXRoLnJhbmRvbSgpLCBzOiBNYXRoLnJhbmRvbSgpICogKE1BWF9TQVQgLSBNSU5fU0FUKSArIE1JTl9TQVQsIGw6IElOSVRJQUxfTFVNfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld0wgPSBleGlzdGluZy5sICs9IExVTV9ERUxUQSAqIChkdCAvIDEwMDApO1xuICAgICAgaWYgKExVTV9ERUxUQSA+IDAgJiYgbmV3TCA+PSBNQVhfTFVNKSB7XG4gICAgICAgIG5ld0wgPSBNQVhfTFVNO1xuICAgICAgfVxuICAgICAgaWYgKExVTV9ERUxUQSA8IDAgJiYgbmV3TCA8PSBNSU5fTFVNKSB7XG4gICAgICAgIG5ld0wgPSBNSU5fTFVNO1xuICAgICAgfVxuICAgICAgZXhpc3RpbmcubCA9IG5ld0w7XG4gICAgfVxuICAgIGlmICghZXhpc3RlZCkge1xuICAgICAgZ3JpZC5zZXQoZXhpc3RpbmcsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55KTtcbiAgICB9XG4gICAgaWYgKGtlZXApIHtcbiAgICAgIGxldCBwb3NpdGl2ZV9kZWx0YSA9IExVTV9ERUxUQSA+IDA7XG4gICAgICBpZiAoKHBvc2l0aXZlX2RlbHRhICYmIGV4aXN0aW5nLmwgPj0gTUFYX0xVTSkgfHxcbiAgICAgICAgICAoIXBvc2l0aXZlX2RlbHRhICYmIGV4aXN0aW5nLmwgPD0gTUlOX0xVTSkpIHtcbiAgICAgICAgZXhpc3RpbmcuY29sb3IgPSBnZXRIc2xDZWxsQ29sb3IoZXhpc3RpbmcpO1xuICAgICAgICBlZGdlQ2VsbHMucHVzaChhY3RpdmVDZWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0FjdGl2ZUNlbGxzLnB1c2goYWN0aXZlQ2VsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGFjdGl2ZUNlbGxzID0gbmV3QWN0aXZlQ2VsbHM7XG59O1xuXG5sZXQgcmVwcm9kdWNlQ2VsbHMgPSBmdW5jdGlvbihkdCwgdmlld1JlY3QpOmJvb2xlYW4ge1xuICBsZXQgcmV0dXJuVHJ1ZSA9IGZhbHNlO1xuICB3aGlsZSAoKGFjdGl2ZUNlbGxzLmxlbmd0aCA+IDAgfHwgZWRnZUNlbGxzLmxlbmd0aCA+IDApICYmIE1hdGgucmFuZG9tKCkgPD0gUkVQUl9QUk9CQUJJTElUWSkge1xuICAgIC8vIGxldCBhY3RpdmVDZWxsID0gd2VpZ2h0ZWRSYW5kb20oYWN0aXZlQ2VsbHMuY29uY2F0KGVkZ2VDZWxscyksIChjZWxsKSA9PiB7XG4gICAgLy8gICBsZXQgbmVpZ2hib3JzID0gZ3JpZC5nZXROZWlnaGJvcnMoY2VsbC54LCBjZWxsLnkpXG4gICAgLy8gICAgICAgLmZpbHRlcigobikgPT4gZ3JpZC5nZXQobi54LCBuLnkpID09IG51bGwpO1xuICAgIC8vICAgcmV0dXJuIG5laWdoYm9ycy5sZW5ndGg7XG4gICAgLy8gfSk7XG4gICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGFjdGl2ZUNlbGxzLmxlbmd0aCArIGVkZ2VDZWxscy5sZW5ndGgpKTtcbiAgICBsZXQgYWN0aXZlQ2VsbCA9IGluZGV4IDwgYWN0aXZlQ2VsbHMubGVuZ3RoID8gYWN0aXZlQ2VsbHNbaW5kZXhdIDogZWRnZUNlbGxzW2luZGV4IC0gYWN0aXZlQ2VsbHMubGVuZ3RoXTtcbiAgICBsZXQgZXhpc3RpbmcgPSBncmlkLmdldChhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSk7XG4gICAgaWYgKGV4aXN0aW5nICE9IG51bGwpIHtcbiAgICAgIGxldCBuZWlnaGJvcnMgPSBnZXROZWlnaGJvcnMoZ3JpZCwgYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnksIHZpZXdSZWN0KTtcbiAgICAgIGxldCBuZXdOZWlnaGJvcjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9ID0gbnVsbDtcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBsZXQgZmlsdGVyZWROZWlnaGJvcnM6e25laWdoYm9yOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0sIHdlaWdodDpudW1iZXJ9W10gPSBuZWlnaGJvcnMubWFwKChuZWlnaGJvcikgPT4ge1xuICAgICAgICAvLyAgIGxldCBuZWlnaGJvck5laWdoYm9ycyA9IGdyaWQuZ2V0TmVpZ2hib3JzKG5laWdoYm9yLngsIG5laWdoYm9yLnkpXG4gICAgICAgIC8vICAgICAgIC5maWx0ZXIoKG4pID0+IGdyaWQuZ2V0KG4ueCwgbi55KSA9PSBudWxsKTtcbiAgICAgICAgLy8gICByZXR1cm4ge1xuICAgICAgICAvLyAgICAgbmVpZ2hib3I6IG5laWdoYm9yLFxuICAgICAgICAvLyAgICAgd2VpZ2h0OiBuZWlnaGJvck5laWdoYm9ycy5sZW5ndGhcbiAgICAgICAgLy8gICB9O1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgLy8gZmlsdGVyZWROZWlnaGJvcnMucHVzaCh7bmVpZ2hib3I6IG51bGwsIHdlaWdodDogMTB9KTtcbiAgICAgICAgLy8gbGV0IG4gPSB3ZWlnaHRlZFJhbmRvbShmaWx0ZXJlZE5laWdoYm9ycywgKG4pID0+IE1hdGgucG93KG4ud2VpZ2h0LCA4KSkubmVpZ2hib3I7XG4gICAgICAgIC8vIGlmIChuID09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgICAgIGxldCBuID0gbmVpZ2hib3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5laWdoYm9ycy5sZW5ndGgpXTtcbiAgICAgICAgbGV0IGRlbHRhSHVlID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBIVUVfQ0hBTkdFO1xuICAgICAgICBsZXQgZGVsdGFTYXQgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIFNBVF9DSEFOR0U7XG4gICAgICAgIGdyaWQuc2V0KHtcbiAgICAgICAgICBoOiBtb2QoZXhpc3RpbmcuaCArIGRlbHRhSHVlLCAxKSxcbiAgICAgICAgICBzOiBjbGFtcChleGlzdGluZy5zICsgZGVsdGFTYXQsIE1JTl9TQVQsIE1BWF9TQVQpLFxuICAgICAgICAgIGw6IElOSVRJQUxfTFVNXG4gICAgICAgIH0sIG4ueCwgbi55KTtcbiAgICAgICAgbmV3TmVpZ2hib3IgPSBuO1xuICAgICAgfVxuICAgICAgbGV0IG5laWdoYm9yQ29tcGVuc2F0aW9uID0gbmV3TmVpZ2hib3IgPT0gbnVsbCA/IDAgOiAxO1xuICAgICAgbGV0IGZlcnRpbGVOZWlnaGJvcnMgPSBnZXROZWlnaGJvcnMoZ3JpZCwgYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnksIG51bGwpO1xuICAgICAgaWYgKG5laWdoYm9ycy5sZW5ndGggLSBuZWlnaGJvckNvbXBlbnNhdGlvbiAhPT0gZmVydGlsZU5laWdoYm9ycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuVHJ1ZSA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoZmVydGlsZU5laWdoYm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbGV0IGVkZ2VJbmRleCA9IGVkZ2VDZWxscy5pbmRleE9mKGFjdGl2ZUNlbGwpO1xuICAgICAgICBpZiAoZWRnZUluZGV4ID49IDApIHtcbiAgICAgICAgLy8gaWYgKGluZGV4ID49IGFjdGl2ZUNlbGxzLmxlbmd0aCkge1xuICAgICAgICAgIC8vIGVkZ2VDZWxscy5zcGxpY2UoaW5kZXggLSBhY3RpdmVDZWxscy5sZW5ndGgsIDEpO1xuICAgICAgICAgIGVkZ2VDZWxscy5zcGxpY2UoZWRnZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG5ld05laWdoYm9yICE9IG51bGwpIHtcbiAgICAgICAgYWN0aXZlQ2VsbHMucHVzaChuZXdOZWlnaGJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXR1cm5UcnVlO1xufVxuXG5cblxubGV0IHZpZXdSZWN0ID0gcmVuZGVyZXIuZ2V0R3JpZFZpZXdSZWN0KGNhbWVyYSk7XG52aWV3UmVjdC5sZWZ0ID0gTWF0aC5mbG9vcih2aWV3UmVjdC5sZWZ0KSAtIDE7XG52aWV3UmVjdC50b3AgPSBNYXRoLmZsb29yKHZpZXdSZWN0LnRvcCkgLSAxO1xudmlld1JlY3QucmlnaHQgPSBNYXRoLmNlaWwodmlld1JlY3QucmlnaHQpICsgMTtcbnZpZXdSZWN0LmJvdHRvbSA9IE1hdGguY2VpbCh2aWV3UmVjdC5ib3R0b20pICsgMTtcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XG51cGRhdGVBY3RpdmVDZWxscygxMDAsIHZpZXdSZWN0KVxufVxuXG5sZXQgbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbmxvb3AoKGR0Om51bWJlcikgPT4ge1xuICBpZiAoUkVQUl9QUk9CQUJJTElUWSA8IDAuOTUpIHtcbiAgICBSRVBSX1BST0JBQklMSVRZICs9IGR0IC8gMjAwMDAwMDAwMDtcbiAgfVxuICBpZiAoUkVQUl9QUk9CQUJJTElUWSA+IDAuOTUpIHtcbiAgICBSRVBSX1BST0JBQklMSVRZID0gMC45NTtcbiAgfVxuXG4gIGxldCBjYW1lcmFBbHRlcmVkID0gZmFsc2U7XG4gIGlmIChkcmFnUG9zaXRpb24gIT0gbnVsbCkge1xuICAgIGlmIChsYXN0RHJhZ1Bvc2l0aW9uICE9IG51bGwpIHtcbiAgICAgIGlmIChkcmFnUG9zaXRpb24ueCAhPT0gbGFzdERyYWdQb3NpdGlvbi54IHx8XG4gICAgICAgICAgZHJhZ1Bvc2l0aW9uLnkgIT09IGxhc3REcmFnUG9zaXRpb24ueSkge1xuICAgICAgICBsZXQgc3RhcnQgPSBjYW1lcmEudW50cmFuc2Zvcm0obGFzdERyYWdQb3NpdGlvbi54LCBsYXN0RHJhZ1Bvc2l0aW9uLnkpO1xuICAgICAgICBsZXQgZW5kID0gY2FtZXJhLnVudHJhbnNmb3JtKGRyYWdQb3NpdGlvbi54LCBkcmFnUG9zaXRpb24ueSk7XG4gICAgICAgIGNhbWVyYS5tb3ZlKHN0YXJ0LnggLSBlbmQueCwgc3RhcnQueSAtIGVuZC55KTtcbiAgICAgICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3REcmFnUG9zaXRpb24gPSB7eDogZHJhZ1Bvc2l0aW9uLngsIHk6IGRyYWdQb3NpdGlvbi55fTtcbiAgfSBlbHNlIGlmIChsYXN0RHJhZ1Bvc2l0aW9uICE9IG51bGwpIHtcbiAgICBsYXN0RHJhZ1Bvc2l0aW9uID0gbnVsbDtcbiAgfVxuICBpZiAoa2V5SW50ZXJhY3Rpdml0eS5pc0Rvd24oMTg5KSkgeyAvLyBtaW51c1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgKiAxLjEpO1xuICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICB9XG4gIGlmIChrZXlJbnRlcmFjdGl2aXR5LmlzRG93bigxODcpKSB7IC8vIHBsdXNcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpIC8gMS4xKTtcbiAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIGxldCB2aWV3UmVjdCA9IHJlbmRlcmVyLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuICB2aWV3UmVjdC5sZWZ0ID0gTWF0aC5mbG9vcih2aWV3UmVjdC5sZWZ0KSAtIDE7XG4gIHZpZXdSZWN0LnRvcCA9IE1hdGguZmxvb3Iodmlld1JlY3QudG9wKSAtIDE7XG4gIHZpZXdSZWN0LnJpZ2h0ID0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KSArIDE7XG4gIHZpZXdSZWN0LmJvdHRvbSA9IE1hdGguY2VpbCh2aWV3UmVjdC5ib3R0b20pICsgMTtcbiAgLy9mb3IgKGxldCBpID0gMDsgaSA8IDUwMDsgaSsrKSB7XG4gIHVwZGF0ZUFjdGl2ZUNlbGxzKGR0LCB2aWV3UmVjdCk7XG4gIHJlcHJvZHVjZUNlbGxzKGR0LCB2aWV3UmVjdCk7XG4gIC8vIH1cbiAgaWYgKGdyaWQuZ2V0Q291bnQoKSAvICgodmlld1JlY3QuYm90dG9tIC0gdmlld1JlY3QudG9wKSAqICh2aWV3UmVjdC5yaWdodCAtIHZpZXdSZWN0LmxlZnQpKSA+IDEuMDAxKSB7XG4gICAgbGV0IGN1cnJlbnRab29tID0gY2FtZXJhLmdldFpvb20oKTtcbiAgICBpZiAoY3VycmVudFpvb20gPCAxLzMpIHtcbiAgICAgIGNhbWVyYS5zZXRab29tKGN1cnJlbnRab29tICogMik7XG4gICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiAoYWN0aXZlQ2VsbHMubGVuZ3RoID09PSAwICYmIE1hdGgucmFuZG9tKCkgPD0gUkVQUl9QUk9CQUJJTElUWSAvIDIpIHtcbiAgLy8gICBsZXQgZXhpc3Rpbmc6e1trZXk6c3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgLy8gICBncmlkLmZpbHRlcmVkTWFwKHt4OiB2aWV3UmVjdC5sZWZ0LCB5OiB2aWV3UmVjdC50b3B9LFxuICAvLyAgICAgICAgICAgICAgICAgICAge3g6IHZpZXdSZWN0LnJpZ2h0LCB5OiB2aWV3UmVjdC5ib3R0b219LFxuICAvLyAgICAgICAgICAgICAgICAgICAgKHZhbHVlLCB4LCB5KSA9PiAoZXhpc3RpbmdbeCArICcvJyArIHldID0gdHJ1ZSkpO1xuICAvLyAgIGxldCBub25FeGlzdGluZzp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIC8vICAgZm9yIChsZXQgeCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCk7IHggPD0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KTsgeCsrKSB7XG4gIC8vICAgICBmb3IgKGxldCB5ID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApOyB5IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5ib3R0b20pOyB5KyspIHtcbiAgLy8gICAgICAgaWYgKCFleGlzdGluZ1t4ICsgJy8nICsgeV0pIHtcbiAgLy8gICAgICAgICBub25FeGlzdGluZy5wdXNoKHt4OiB4LCB5OiB5fSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgYWN0aXZlQ2VsbHMucHVzaChub25FeGlzdGluZ1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub25FeGlzdGluZy5sZW5ndGgpXSk7XG4gIC8vIH1cblxuICBsZXQgbWFpblRyaWFuZ2xlUmVuZGVyZXIgPSAoY29udGV4dCwgY2VsbCwgeCwgeSkgPT4ge1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ2V0SHNsQ2VsbENvbG9yKGNlbGwpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIC8vIGNvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAgIC8vIGNvbnRleHQubGluZVdpZHRoID0gMC41O1xuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZSgpO1xuICB9O1xuXG4gIGlmIChjYW1lcmFBbHRlcmVkIHx8IGRpcnR5Q2FudmFzKSB7XG4gICAgZGlydHlDYW52YXMgPSBmYWxzZTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIGFjdGl2ZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBlZGdlQ2VsbHMsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfVxuXG4gIC8vIHJlbmRlcmVyLnJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYSwgW2hvdmVyZWRdLCAoY29udGV4dCwgY2VsbCwgeCwgeSkgPT4ge1xuICAvLyAgIGNvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gIC8vICAgY29udGV4dC5saW5lV2lkdGggPSAzO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIC8vICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgLy8gICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gIC8vICAgY29udGV4dC5zdHJva2UoKTtcbiAgLy8gfSk7XG5cbiAgLy8gbGV0IG5vd1RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgLy8gbGV0IHRpbWVQYXNzZWQgPSBub3dUaW1lIC0gbGFzdFRpbWU7XG4gIC8vIGxhc3RUaW1lID0gbm93VGltZTtcbiAgLy8gY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgLy8gY29udGV4dC5mb250ID0gJzE0cHggQXJpYWwnO1xuICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAvLyBjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG4gIC8vIGxldCBvblNjcmVlbkVkZ2UgPSAwO1xuICAvLyBmb3IgKGxldCBlZGdlQ2VsbCBvZiBlZGdlQ2VsbHMpIHtcbiAgLy8gICBpZiAodmlld1JlY3QubGVmdCA8PSBlZGdlQ2VsbC54ICYmIGVkZ2VDZWxsLnggPD0gdmlld1JlY3QucmlnaHQgJiZcbiAgLy8gICAgICAgdmlld1JlY3QudG9wIDw9IGVkZ2VDZWxsLnkgJiYgZWRnZUNlbGwueSA8PSB2aWV3UmVjdC5ib3R0b20pIHtcbiAgLy8gICAgIG9uU2NyZWVuRWRnZSsrO1xuICAvLyAgIH1cbiAgLy8gfVxuICAvLyBsZXQgZnBzVGV4dCA9ICdGUFM6ICcgKyBNYXRoLnJvdW5kKDEwMDAgLyB0aW1lUGFzc2VkKSAvLysgJyAgQWN0aXZlOiAnICsgYWN0aXZlQ2VsbHMubGVuZ3RoICsgJyAgRWRnZTogJyArIGVkZ2VDZWxscy5sZW5ndGggKyAnICBvbnNjcmVlbiAnICsgb25TY3JlZW5FZGdlO1xuICAvLyBjb250ZXh0LnN0cm9rZVRleHQoZnBzVGV4dCwgMTAsIDEwKTtcbiAgLy8gY29udGV4dC5maWxsVGV4dChmcHNUZXh0LCAxMCwgMTApO1xufSwgMCk7XG5cblxucmV0dXJuO1xuLyovXG5cblxuXG5cbmxldCB0b29sU2VsZWN0ID0gPEhUTUxTZWxlY3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sLXNlbGVjdCcpO1xubGV0IHRvb2xTZWxlY3Rpb24gPSAnZHJhdyc7XG5sZXQgc2V0VG9vbCA9IGZ1bmN0aW9uKG5ld1Rvb2w6c3RyaW5nKSB7XG4gIC8vIHRvb2xTZWxlY3Rpb24gPSBuZXdUb29sO1xuICAvLyB0b29sU2VsZWN0LnZhbHVlID0gbmV3VG9vbDtcbiAgd29ybGQuc2VsZWN0VG9vbCg8a2V5b2YgVG9vbHNDb2xsZWN0aW9uPm5ld1Rvb2wpO1xufTtcbmlmICh0b29sU2VsZWN0ICE9IG51bGwpIHtcbiAgdG9vbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBzZXRUb29sKHRvb2xTZWxlY3QudmFsdWUpO1xuICB9KTtcbn1cblxuXG5cbmxldCB3b3JsZDpXb3JsZCA9IG5ldyBXb3JsZChjYW52YXMpO1xubGV0IGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY29uc3QgVkVMT0NJVFk6bnVtYmVyID0gMTU7XG5cbmxldCBrZXlzID0gbmV3IEtleUludGVyYWN0aXZpdHkoKTtcbmtleXMubWFwKCdsZWZ0JywgNjUpO1xua2V5cy5tYXAoJ3JpZ2h0JywgNjgpO1xua2V5cy5tYXAoJ3VwJywgODcpO1xua2V5cy5tYXAoJ2Rvd24nLCA4Myk7XG5rZXlzLm1hcCgnem9vbS1vdXQnLCA4MSk7XG5rZXlzLm1hcCgnem9vbS1pbicsIDY5KTtcbmxvb3AoKCkgPT4ge1xuICAvLyByZW5kZXJGdWxsVHJpYW5nbGVHcmlkKGdyaWQsIHJlbmRlcmVyLCBjb250ZXh0KTtcblxuICB3b3JsZC5yZW5kZXIoKTtcblxuICBsZXQgY2FtZXJhID0gd29ybGQuZ2V0Q2FtZXJhKCk7XG5cbiAgaWYgKGtleXMuaXNEb3duKCd6b29tLW91dCcpKSB7XG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAqIDEuMSk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCd6b29tLWluJykpIHtcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpIC8gMS4xKTtcbiAgfVxuXG4gIGxldCBkeCA9IDAsIGR5ID0gMDtcbiAgaWYgKGtleXMuaXNEb3duKCdsZWZ0JykpIHtcbiAgICBkeCAtPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ3JpZ2h0JykpIHtcbiAgICBkeCArPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ3VwJykpIHtcbiAgICBkeSAtPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ2Rvd24nKSkge1xuICAgIGR5ICs9IFZFTE9DSVRZO1xuICB9XG5cbiAgZHggKj0gY2FtZXJhLmdldFpvb20oKTtcbiAgZHkgKj0gY2FtZXJhLmdldFpvb20oKTtcbiAgaWYgKGR4ICE9PSAwIHx8IGR5ICE9PSAwKSB7XG4gICAgY2FtZXJhLm1vdmUoZHgsIGR5KTtcbiAgfVxufSwgMCk7XG5cbi8vICovXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5SW50ZXJhY3Rpdml0eSB7XG4gIHByaXZhdGUga2V5czp7W2tleTpzdHJpbmddOiBib29sZWFufTtcbiAgcHJpdmF0ZSBrZXlNYXA6e1trZXk6c3RyaW5nXTogc3RyaW5nfG51bWJlcn07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0ge307XG4gICAgdGhpcy5rZXlNYXAgPSB7fTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgbGV0IGtleWNvZGUgPSBlLmtleUNvZGU7XG4gICAgICB0aGlzLmtleXNba2V5Y29kZV0gPSB0cnVlO1xuICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5rZXlzW25hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBsZXQga2V5Y29kZSA9IGUua2V5Q29kZTtcbiAgICAgIGlmIChrZXljb2RlIGluIHRoaXMua2V5cykge1xuICAgICAgICBkZWxldGUgdGhpcy5rZXlzW2tleWNvZGVdO1xuICAgICAgfVxuICAgICAgaWYgKGtleWNvZGUgaW4gdGhpcy5rZXlNYXApIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgICAgaWYgKG5hbWUgIT0gbnVsbCAmJiBuYW1lIGluIHRoaXMua2V5cykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmtleXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG1hcChuYW1lOnN0cmluZywga2V5OnN0cmluZ3xudW1iZXIpIHtcbiAgICB0aGlzLmtleU1hcFtrZXldID0gbmFtZTtcbiAgfVxuXG4gIGlzRG93bihrZXk6c3RyaW5nfG51bWJlcik6Ym9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5rZXlzW2tleV07XG4gIH1cblxuICBnZXREb3duKCk6c3RyaW5nW10ge1xuICAgIGxldCBrZXlzOnN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMua2V5cykge1xuICAgICAgaWYgKHRoaXMuaXNEb3duKGtleSkpIHtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2VJbnRlcmFjdGl2aXR5IHtcbiAgZXZlbnRzOkV2ZW50cztcblxuICBwcml2YXRlIGVsZW1lbnQ6SFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgZG93bjpib29sZWFuO1xuICBwcml2YXRlIHBvc2l0aW9uOnt4PzpudW1iZXIsIHk/Om51bWJlcn07XG4gIHByaXZhdGUgZHJhZ2dpbmc6Ym9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OkhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnBvc2l0aW9uID0ge307XG4gICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlRG93bihlKSk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlTW92ZShlKSk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZVVwKGUpKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcCh7XG4gICAgICBvZmZzZXRYOiBlLm9mZnNldFggLSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3B9LCBmYWxzZSkpO1xuICB9XG5cbiAgaXNEb3duKCkgeyByZXR1cm4gdGhpcy5kb3duOyB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZVVwKGV2ZW50LCBldmVudHM6Ym9vbGVhbiA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5kb3duKSB7XG4gICAgICBsZXQgcG9zaXRpb24gPSB7eDogZXZlbnQub2Zmc2V0WCwgeTogZXZlbnQub2Zmc2V0WX07XG4gICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgIGlmIChldmVudHMpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLWVuZCcsIHBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdjbGljaycsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZG93bikge1xuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgIHRoaXMucG9zaXRpb24ueSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgZG93biB3aGVuIHdlIHJlY2VpdmUgdGhlIG1vdXNlZG93biBvciBtb3ZlIGV2ZW50LCB0aGVuXG4gICAgICAvLyB3ZSBhcmUgZHJhZ2dpbmcuXG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctc3RhcnQnLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctbW92ZScsIHRoaXMucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV2ZW50cy5lbWl0KCdob3ZlcicsIHt4OiBldmVudC5vZmZzZXRYLCB5OiBldmVudC5vZmZzZXRZfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZURvd24oZXZlbnQpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBldmVudC5vZmZzZXRYO1xuICAgIHRoaXMucG9zaXRpb24ueSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgdGhpcy5kb3duID0gdHJ1ZTtcbiAgICB0aGlzLmV2ZW50cy5lbWl0KCdkb3duJywgdGhpcy5wb3NpdGlvbik7XG4gIH1cbn1cbiJdfQ==
