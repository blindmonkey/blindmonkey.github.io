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
class Params {
    static number(key, defaultValue) {
        let value = Number(this.params[key]);
        if (value == null || isNaN(value) || !isFinite(value)) {
            value = defaultValue;
        }
        return value;
    }
    static string(key, defaultValue) {
        let value = this.params[key];
        if (value == null) {
            value = defaultValue;
        }
        return value;
    }
}
Params.params = (() => {
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
    const MIN_LUM = Params.number('minlum', 0.75);
    const LUM_DELTA = Params.number('lumdelta', -0.00001);
    -0.00005;
    0.0005;
    let REPR_PROBABILITY = Params.number('repr', 0.005);
    0.1;
    0.20;
    0.0024;
    const HUE_CHANGE = Math.abs(Params.number('huechange', 0.02));
    const SAT_CHANGE = Math.abs(Params.number('satchange', 0.05));
    const MIN_SAT = Params.number('minsat', 0.7);
    const MAX_SAT = Params.number('maxsat', 1);
    const MIN_ZOOM = Params.number('minzoom', 1 / 3);
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
    // let viewRect = renderer.getGridViewRect(camera);
    // viewRect.left = Math.floor(viewRect.left) - 1;
    // viewRect.top = Math.floor(viewRect.top) - 1;
    // viewRect.right = Math.ceil(viewRect.right) + 1;
    // viewRect.bottom = Math.ceil(viewRect.bottom) + 1;
    // for (let i = 0; i < 1000; i++) {
    // updateActiveCells(100, viewRect)
    // }
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
        // }
        if (grid.getCount() / ((viewRect.bottom - viewRect.top) * (viewRect.right - viewRect.left)) > 1.001) {
            let currentZoom = camera.getZoom();
            if (currentZoom < MIN_ZOOM) {
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
        reproduceCells(dt, viewRect);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbW91c2UtaW50ZXJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPRSxZQUFZLGFBQW9CLEVBQUUsY0FBcUI7UUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQ3ZCLElBQUks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LENBQUMsQ0FBQztRQUNSLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElB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QUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQzdCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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QyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDO0lBQ0gsQ0FBQztJQUVPLGVBQWUsQ0FBQyxLQUFLO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQS9ERCxxQ0ErREMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FtZXJhIHtcbiAgLy8gV29ybGQtc3BhY2UgY2FtZXJhIGZvY3VzIHBvc2l0aW9uLlxuICBwcml2YXRlIHg6bnVtYmVyO1xuICBwcml2YXRlIHk6bnVtYmVyO1xuICBwcml2YXRlIHpvb206bnVtYmVyO1xuICBwcml2YXRlIHZpZXdwb3J0Ont3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXJ9O1xuXG4gIGNvbnN0cnVjdG9yKHZpZXdwb3J0V2lkdGg6bnVtYmVyLCB2aWV3cG9ydEhlaWdodDpudW1iZXIpIHtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgdGhpcy56b29tID0gMTtcbiAgICB0aGlzLnZpZXdwb3J0ID0ge3dpZHRoOiB2aWV3cG9ydFdpZHRoLCBoZWlnaHQ6IHZpZXdwb3J0SGVpZ2h0fTtcbiAgfVxuXG4gIGdldFZpZXdwb3J0KCkge1xuICAgIHJldHVybiB7d2lkdGg6IHRoaXMudmlld3BvcnQud2lkdGgsIGhlaWdodDogdGhpcy52aWV3cG9ydC5oZWlnaHR9O1xuICB9XG5cbiAgcmVzaXplKHdpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcikge1xuICAgIHRoaXMudmlld3BvcnQud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG4gIGdldFpvb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuem9vbTtcbiAgfVxuXG4gIHNldFpvb20obmV3Wm9vbTpudW1iZXIpIHtcbiAgICB0aGlzLnpvb20gPSBuZXdab29tO1xuICB9XG5cbiAgbW92ZShkeDpudW1iZXIsIGR5Om51bWJlcikge1xuICAgIHRoaXMueCArPSBkeDtcbiAgICB0aGlzLnkgKz0gZHk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyBhIHdvcmxkLXNwYWNlIGNvb3JkaW5hdGUgdG8gY2FtZXJhLXNwYWNlLlxuICAgKi9cbiAgdHJhbnNmb3JtKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoeCAtIHRoaXMueCkgLyB0aGlzLnpvb20gKyB0aGlzLnZpZXdwb3J0LndpZHRoIC8gMixcbiAgICAgIHk6ICh5IC0gdGhpcy55KSAvIHRoaXMuem9vbSArIHRoaXMudmlld3BvcnQuaGVpZ2h0IC8gMixcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSBjb29yZGluYXRlIGZyb20gY2FtZXJhLXNwYWNlIHRvIHdvcmxkLXNwYWNlLlxuICAgKi9cbiAgdW50cmFuc2Zvcm0oeDpudW1iZXIsIHk6bnVtYmVyKTp7eDpudW1iZXIsIHk6bnVtYmVyfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICh4IC0gdGhpcy52aWV3cG9ydC53aWR0aCAvIDIpICogdGhpcy56b29tICsgdGhpcy54LFxuICAgICAgeTogKHkgLSB0aGlzLnZpZXdwb3J0LmhlaWdodCAvIDIpICogdGhpcy56b29tICsgdGhpcy55LFxuICAgIH07XG4gIH1cbn1cbiIsImV4cG9ydCB0eXBlIEhzdkNvbG9yID0ge2g6bnVtYmVyLCBzOm51bWJlciwgdjpudW1iZXJ9O1xuZXhwb3J0IHR5cGUgUmdiQ29sb3IgPSB7cjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcn07XG5cbmxldCBjb2xvcnMgPSB7XG4gIHJhbmRvbTogZnVuY3Rpb24oKSB7XG4gICAgbGV0IHJhbmRvbUNvbXBvbmVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1Nik7XG4gICAgfTtcbiAgICBsZXQgcmFuZG9tQ29tcG9uZW50cyA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgIGxldCBvdXQ6bnVtYmVyW10gPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIG91dC5wdXNoKHJhbmRvbUNvbXBvbmVudCgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcbiAgICByZXR1cm4gJ3JnYignICsgcmFuZG9tQ29tcG9uZW50cygzKS5qb2luKCcsJykgKyAnKSc7XG4gIH0sXG4gIHJnYjogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIHJldHVybiAncmdiKCcgKyBbciwgZywgYl0uam9pbignLCcpICsgJyknO1xuICB9LFxuICBoZXhUb1JnYjogZnVuY3Rpb24oc3RyOnN0cmluZykge1xuICAgIHN0ciA9IHN0ci5zbGljZSgxKTtcbiAgICByZXR1cm4ge1xuICAgICAgcjogcGFyc2VJbnQoc3RyLnNsaWNlKDAsIDIpLCAxNiksXG4gICAgICBnOiBwYXJzZUludChzdHIuc2xpY2UoMiwgNCksIDE2KSxcbiAgICAgIGI6IHBhcnNlSW50KHN0ci5zbGljZSg0LCA2KSwgMTYpLFxuICAgIH07XG4gIH0sXG4gIHJnYlRvSGV4OiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgciA9IHJ8MDtcbiAgICBnID0gZ3wwO1xuICAgIGIgPSBifDA7XG5cbiAgICBpZiAociA8IDApIHIgPSAwO1xuICAgIGlmIChyID4gMjU1KSByID0gMjU1O1xuICAgIGlmIChnIDwgMCkgZyA9IDA7XG4gICAgaWYgKGcgPiAyNTUpIGcgPSAyNTU7XG4gICAgaWYgKGIgPCAwKSBiID0gMDtcbiAgICBpZiAoYiA+IDI1NSkgYiA9IDI1NTtcblxuICAgIGxldCByc3RyID0gci50b1N0cmluZygxNik7XG4gICAgaWYgKHJzdHIubGVuZ3RoID09PSAxKSByc3RyID0gJzAnICsgcnN0cjtcbiAgICBsZXQgZ3N0ciA9IGcudG9TdHJpbmcoMTYpO1xuICAgIGlmIChnc3RyLmxlbmd0aCA9PT0gMSkgZ3N0ciA9ICcwJyArIGdzdHI7XG4gICAgbGV0IGJzdHIgPSBiLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAoYnN0ci5sZW5ndGggPT09IDEpIGJzdHIgPSAnMCcgKyBic3RyO1xuICAgIHJldHVybiBbJyMnLCByc3RyLCBnc3RyLCBic3RyXS5qb2luKCcnKTtcbiAgfSxcbiAgcmdiVG9Ic3Y6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICAvLyBoc3YgICAgICAgICBvdXQ7XG4gICAgLy8gZG91YmxlICAgICAgbWluLCBtYXgsIGRlbHRhO1xuICAgIHIgPSByIC8gMjU1O1xuICAgIGcgPSBnIC8gMjU1O1xuICAgIGIgPSBiIC8gMjU1O1xuXG4gICAgbGV0IG1pbiA9IHIgICAgPCBnID8gciAgIDogZztcbiAgICBtaW4gICAgID0gbWluICA8IGIgPyBtaW4gOiBiO1xuXG4gICAgbGV0IG1heCA9IHIgICAgPiBnID8gciAgIDogZztcbiAgICBtYXggICAgID0gbWF4ICA+IGIgPyBtYXggOiBiO1xuXG4gICAgbGV0IG91dCA9IHtoOiAwLCBzOiAwLCB2OiAwfTtcbiAgICBsZXQgdiA9IG1heDtcbiAgICBsZXQgZGVsdGEgPSBtYXggLSBtaW47XG4gICAgaWYgKGRlbHRhIDwgMC4wMDAwMSlcbiAgICB7XG4gICAgICAgIG91dC5zID0gMDtcbiAgICAgICAgb3V0LmggPSAwOyAvLyB1bmRlZmluZWQsIG1heWJlIG5hbj9cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgaWYoIG1heCA+IDAuMCApIHsgLy8gTk9URTogaWYgTWF4IGlzID09IDAsIHRoaXMgZGl2aWRlIHdvdWxkIGNhdXNlIGEgY3Jhc2hcbiAgICAgICAgb3V0LnMgPSAoZGVsdGEgLyBtYXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIG1heCBpcyAwLCB0aGVuIHIgPSBnID0gYiA9IDBcbiAgICAgICAgLy8gcyA9IDAsIHYgaXMgdW5kZWZpbmVkXG4gICAgICAgIG91dC5zID0gMC4wO1xuICAgICAgICBvdXQuaCA9IDA7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmKCByID49IG1heCApICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPiBpcyBib2d1cywganVzdCBrZWVwcyBjb21waWxvciBoYXBweVxuICAgICAgICBvdXQuaCA9IChnIC0gYikgLyBkZWx0YTsgICAgICAgIC8vIGJldHdlZW4geWVsbG93ICYgbWFnZW50YVxuICAgIGVsc2UgaWYoIGcgPj0gbWF4IClcbiAgICAgICAgb3V0LmggPSAyLjAgKyAoIGIgLSByICkgLyBkZWx0YTsgIC8vIGJldHdlZW4gY3lhbiAmIHllbGxvd1xuICAgIGVsc2VcbiAgICAgICAgb3V0LmggPSA0LjAgKyAoIHIgLSBnICkgLyBkZWx0YTsgIC8vIGJldHdlZW4gbWFnZW50YSAmIGN5YW5cblxuICAgIG91dC5oICo9IDYwLjA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVncmVlc1xuXG4gICAgaWYoIG91dC5oIDwgMC4wIClcbiAgICAgICAgb3V0LmggKz0gMzYwLjA7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9LFxuICBoc3ZUb1JnYjogZnVuY3Rpb24oaDpudW1iZXIsIHM6bnVtYmVyLCBsOm51bWJlcikge1xuICAgIHZhciByLCBnLCBiO1xuXG4gICAgaWYocyA9PSAwKXtcbiAgICAgICAgciA9IGcgPSBiID0gbDsgLy8gYWNocm9tYXRpY1xuICAgIH1lbHNle1xuICAgICAgICB2YXIgaHVlMnJnYiA9IGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCl7XG4gICAgICAgICAgICBpZih0IDwgMCkgdCArPSAxO1xuICAgICAgICAgICAgaWYodCA+IDEpIHQgLT0gMTtcbiAgICAgICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICAgICAgICAgICAgaWYodCA8IDEvMikgcmV0dXJuIHE7XG4gICAgICAgICAgICBpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xuICAgICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xuICAgIH1cblxuICAgIHJldHVybiB7cjogTWF0aC5yb3VuZChyICogMjU1KSwgZzogTWF0aC5yb3VuZChnICogMjU1KSwgYjogTWF0aC5yb3VuZChiICogMjU1KX07XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbG9ycztcbiIsInR5cGUgSGFuZGxlciA9ICguLi5hcmdzOmFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudHMge1xuICBwcml2YXRlIGhhbmRsZXJzOntba2V5OnN0cmluZ106QXJyYXk8SGFuZGxlcj59O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcbiAgfVxuXG4gIGxpc3RlbihldmVudHM6c3RyaW5nfEFycmF5PHN0cmluZz4sIGhhbmRsZXI6SGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJykge1xuICAgICAgZXZlbnRzID0gW2V2ZW50c107XG4gICAgfVxuICAgIGZvciAobGV0IGV2ZW50IG9mIGV2ZW50cykge1xuICAgICAgaWYgKCEoZXZlbnQgaW4gdGhpcy5oYW5kbGVycykpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVyc1tldmVudF0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudDpzdHJpbmcsIC4uLmFyZ3M6YW55W10pIHtcbiAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XTtcbiAgICBpZiAoaGFuZGxlcnMgIT0gbnVsbCkge1xuICAgICAgZm9yIChsZXQgaGFuZGxlciBvZiBoYW5kbGVycykge1xuICAgICAgICBoYW5kbGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL2NhbWVyYSc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkVmlld01vZGVsPFQ+IHtcbiAgcHJpdmF0ZSBncmlkOkdyaWQ8VD47XG5cbiAgY29uc3RydWN0b3IoZ3JpZDpHcmlkPFQ+KSB7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgfVxuXG4gIHNjcmVlblRvR3JpZENvb3JkKGNhbWVyYTpDYW1lcmEsIHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIGxldCBjZWxsU2l6ZSA9IDE7XG4gICAgbGV0IGNlbGxIZWlnaHQgPSBjZWxsU2l6ZTtcbiAgICBsZXQgaGFsZkNlbGxIZWlnaHQgPSBjZWxsSGVpZ2h0IC8gMjtcbiAgICBsZXQgY2VsbFdpZHRoID0gTWF0aC5zcXJ0KGNlbGxIZWlnaHQgKiBjZWxsSGVpZ2h0IC0gaGFsZkNlbGxIZWlnaHQgKiBoYWxmQ2VsbEhlaWdodCk7XG5cbiAgICBsZXQgd29ybGRTcGFjZSA9IGNhbWVyYS51bnRyYW5zZm9ybSh4LCB5KTtcbiAgICB4ID0gd29ybGRTcGFjZS54O1xuICAgIHkgPSB3b3JsZFNwYWNlLnk7XG5cbiAgICBsZXQgZ3JpZFggPSB4IC8gY2VsbFdpZHRoO1xuICAgIGxldCBmbG9vckdyaWRYID0gTWF0aC5mbG9vcihncmlkWCk7XG4gICAgbGV0IHJlbWFpbmRlclggPSBncmlkWCAtIGZsb29yR3JpZFg7XG5cbiAgICBsZXQgZ3JpZFkgPSB5IC8gY2VsbEhlaWdodCAqIDIgKyAxIC0gZ3JpZFg7XG4gICAgbGV0IGZsb29yZWRHcmlkWSA9IE1hdGguZmxvb3IoZ3JpZFkgLyAyKSAqIDI7XG5cbiAgICBsZXQgcmVtYWluZGVyWSA9IChncmlkWSAtIGZsb29yZWRHcmlkWSkgLyAyO1xuICAgIGdyaWRZID0gZmxvb3JlZEdyaWRZO1xuICAgIGlmIChyZW1haW5kZXJZID4gMSAtIHJlbWFpbmRlclgpIHtcbiAgICAgIGdyaWRZICs9IDE7XG4gICAgfVxuICAgIGlmIChmbG9vckdyaWRYICUgMiAhPT0gMCkge1xuICAgICAgZ3JpZFkgKz0gMTtcbiAgICB9XG5cbiAgICBsZXQgYmlDb2x1bW4gPSBNYXRoLmZsb29yKGZsb29yR3JpZFggLyAyKTtcbiAgICBncmlkWSArPSBiaUNvbHVtbiAqIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogZ3JpZFgsXG4gICAgICB5OiBncmlkWSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0R3JpZFZpZXdSZWN0KGNhbWVyYTpDYW1lcmEpOntsZWZ0Om51bWJlciwgdG9wOm51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0Om51bWJlciwgYm90dG9tOm51bWJlcn0ge1xuICAgIGxldCB2aWV3cG9ydCA9IGNhbWVyYS5nZXRWaWV3cG9ydCgpO1xuICAgIGxldCB7d2lkdGgsIGhlaWdodH0gPSB2aWV3cG9ydDtcbiAgICBsZXQgdG9wTGVmdCA9IHRoaXMuc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhLCAwLCAwKTtcbiAgICBsZXQgYm90dG9tUmlnaHQgPSB0aGlzLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgd2lkdGgsIGhlaWdodCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRvcExlZnQueCwgdG9wOiB0b3BMZWZ0LnksXG4gICAgICByaWdodDogYm90dG9tUmlnaHQueCwgYm90dG9tOiBib3R0b21SaWdodC55XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVHJpYW5nbGUoY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbWVyYTpDYW1lcmEsIHg6bnVtYmVyLCB5Om51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICBkcmF3VHJpYW5nbGU6KGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB0OlR8bnVsbCwgeDpudW1iZXIsIHk6bnVtYmVyKT0+dm9pZCkge1xuICAgIGxldCB0cmlhbmdsZVBhdGggPSBmdW5jdGlvbihcbiAgICAgICAgeDE6bnVtYmVyLCB5MTpudW1iZXIsIHgyOm51bWJlciwgeTI6bnVtYmVyLCB4MzpudW1iZXIsIHkzOm51bWJlcikge1xuICAgICAgbGV0IHAxID0gY2FtZXJhLnRyYW5zZm9ybSh4MSwgeTEpO1xuICAgICAgbGV0IHAyID0gY2FtZXJhLnRyYW5zZm9ybSh4MiwgeTIpO1xuICAgICAgbGV0IHAzID0gY2FtZXJhLnRyYW5zZm9ybSh4MywgeTMpO1xuICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgIGNvbnRleHQubW92ZVRvKHAxLngsIHAxLnkpO1xuICAgICAgY29udGV4dC5saW5lVG8ocDIueCwgcDIueSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhwMy54LCBwMy55KTtcbiAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgfTtcbiAgICBsZXQgY2VsbEhlaWdodCA9IDE7XG4gICAgbGV0IGhhbGZDZWxsSGVpZ2h0ID0gY2VsbEhlaWdodCAvIDI7XG4gICAgbGV0IGNlbGxXaWR0aCA9IE1hdGguc3FydChjZWxsSGVpZ2h0ICogY2VsbEhlaWdodCAtIGhhbGZDZWxsSGVpZ2h0ICogaGFsZkNlbGxIZWlnaHQpO1xuICAgIGxldCB4eCA9IHg7XG4gICAgbGV0IHl5ID0geSAvIDIgLSAuNTtcbiAgICBsZXQgbGVmdFRyaWFuZ2xlID0geCAlIDIgIT09IDA7XG4gICAgaWYgKHkgJSAyICE9PSAwKSB7XG4gICAgICAgIGxlZnRUcmlhbmdsZSA9ICFsZWZ0VHJpYW5nbGU7XG4gICAgfVxuICAgIGlmIChsZWZ0VHJpYW5nbGUpIHtcbiAgICAgIHRyaWFuZ2xlUGF0aCggeHggICAgKiBjZWxsV2lkdGgsICh5eSsuNSkgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICh4eCsxKSAqIGNlbGxXaWR0aCwgIHl5ICAgICAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgKHh4KzEpICogY2VsbFdpZHRoLCAoeXkrMSkgICogY2VsbEhlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyaWFuZ2xlUGF0aCggeHggICAgKiBjZWxsV2lkdGgsICB5eSAgICAgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICh4eCsxKSAqIGNlbGxXaWR0aCwgKHl5Ky41KSAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgeHggKiBjZWxsV2lkdGgsICAgICAoeXkrMSkgKiBjZWxsSGVpZ2h0KTtcbiAgICB9XG4gICAgbGV0IHZhbHVlID0gdGhpcy5ncmlkLmdldCh4LCB5KTtcbiAgICBkcmF3VHJpYW5nbGUoY29udGV4dCwgdmFsdWUsIHgsIHkpO1xuICB9XG5cbiAgcmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhOkNhbWVyYSwgY2VsbHM6QXJyYXk8e3g6bnVtYmVyLCB5Om51bWJlcn0+LFxuICAgICAgICAgICAgICBkcmF3VHJpYW5nbGU6KGNvbnRleHQsIHQ6VCwgeDpudW1iZXIsIHk6bnVtYmVyKT0+dm9pZCkge1xuICAgIGZvciAobGV0IGNvb3JkIG9mIGNlbGxzKSB7XG4gICAgICB0aGlzLnJlbmRlclRyaWFuZ2xlKGNvbnRleHQsIGNhbWVyYSwgY29vcmQueCwgY29vcmQueSwgZHJhd1RyaWFuZ2xlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJBbGxDZWxscyhjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgY2FtZXJhOkNhbWVyYSxcbiAgICAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0OlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4gdm9pZCkge1xuICAgIC8vIGNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAvLyBjb250ZXh0LmZpbGxSZWN0KDAsIDAsIGNvbnRleHQuY2FudmFzLndpZHRoLCBjb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgIGxldCB2aXNpYmxlUmVjdCA9IHRoaXMuZ2V0R3JpZFZpZXdSZWN0KGNhbWVyYSk7XG4gICAgdGhpcy5ncmlkLmZpbHRlcmVkTWFwKFxuICAgICAgICB7eDogTWF0aC5mbG9vcih2aXNpYmxlUmVjdC5sZWZ0KSwgeTogTWF0aC5mbG9vcih2aXNpYmxlUmVjdC50b3ApfSxcbiAgICAgICAge3g6IE1hdGguY2VpbCh2aXNpYmxlUmVjdC5yaWdodCArIDEpLCB5OiBNYXRoLmNlaWwodmlzaWJsZVJlY3QuYm90dG9tICsgMSl9LFxuICAgICAgICAodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PlxuICAgICAgICAgICAgdGhpcy5yZW5kZXJUcmlhbmdsZShjb250ZXh0LCBjYW1lcmEsIHgsIHksIGRyYXdUcmlhbmdsZSkpO1xuICAgIC8vIHRoaXMuZ3JpZC5tYXAoKHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4ge1xuICAgIC8vICAgdGhpcy5yZW5kZXJUcmlhbmdsZShjb250ZXh0LCBjYW1lcmEsIHgsIHksIGRyYXdUcmlhbmdsZSk7XG4gICAgLy8gfSk7XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi9jYW1lcmEnO1xuXG5pbXBvcnQgY29vcmRzIGZyb20gJy4vY29vcmRzJztcblxuXG5jb25zdCBDT09SRF9JTkRFWDp7W2tleTpudW1iZXJdOntba2V5Om51bWJlcl06IHN0cmluZ319ID0ge307XG5cblxuY29uc3QgQ0hVTktfU0laRSA9IDY0O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkPFQ+IHtcbiAgcHJpdmF0ZSBjb3VudDpudW1iZXI7XG4gIHByaXZhdGUgZ3JpZDp7W2tleTpzdHJpbmddOiB7Y29vcmQ6IHt4Om51bWJlciwgeTpudW1iZXJ9LCB2YWx1ZTogVH19O1xuICBwcml2YXRlIGNodW5rczp7W2tleTpzdHJpbmddOiB7XG4gICAgY29vcmQ6e3g6bnVtYmVyLCB5Om51bWJlcn0sXG4gICAgY291bnQ6bnVtYmVyLFxuICAgIGRhdGE6e1trZXk6c3RyaW5nXToge2Nvb3JkOiB7eDpudW1iZXIsIHk6bnVtYmVyfSwgdmFsdWU6IFR9fX19O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuZ3JpZCA9IHt9O1xuICAgIHRoaXMuY2h1bmtzID0ge307XG4gIH1cblxuICBnZXRDb3VudCgpIHsgcmV0dXJuIHRoaXMuY291bnQ7IH1cblxuICBwcml2YXRlIGdldEtleSh4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICB4ID0geHwwO1xuICAgIHkgPSB5fDA7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFt4LCB5XSk7XG4gICAgLy8gbGV0IGEgPSBDT09SRF9JTkRFWFt4XTtcbiAgICAvLyBpZiAoYSAhPSBudWxsKSB7XG4gICAgLy8gICBsZXQgYiA9IGFbeV07XG4gICAgLy8gICBpZiAoYiAhPSBudWxsKSB7XG4gICAgLy8gICAgIHJldHVybiBiO1xuICAgIC8vICAgfVxuICAgIC8vIH1cbiAgICAvLyBsZXQgcmVzdWx0ID0geCArICcvJyArIHk7Ly9beCwgeV0uam9pbignLycpO1xuICAgIC8vIGlmICghKHggaW4gQ09PUkRfSU5ERVgpKSB7XG4gICAgLy8gICBDT09SRF9JTkRFWFt4XSA9IHt9O1xuICAgIC8vIH1cbiAgICAvLyByZXR1cm4gQ09PUkRfSU5ERVhbeF1beV0gPSByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGdldENodW5rQ29vcmQoeDpudW1iZXIsIHk6bnVtYmVyKTp7eDpudW1iZXIsIHk6bnVtYmVyfSB7XG4gICAgcmV0dXJuIHt4OiBNYXRoLmZsb29yKHggLyBDSFVOS19TSVpFKSxcbiAgICAgICAgICAgIHk6IE1hdGguZmxvb3IoeSAvIENIVU5LX1NJWkUpfVxuICB9XG5cbiAgZ2V0KHg6bnVtYmVyLCB5Om51bWJlcik6VHxudWxsIHtcbiAgICBsZXQgY2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZCh4LCB5KTtcbiAgICBsZXQgY2h1bmtLZXkgPSB0aGlzLmdldEtleShjaHVua0Nvb3JkLngsIGNodW5rQ29vcmQueSk7XG4gICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgIGlmIChjaHVuayA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICBsZXQgY2VsbCA9IGNodW5rLmRhdGFbdGhpcy5nZXRLZXkoeCwgeSldO1xuICAgIHJldHVybiBjZWxsICYmIGNlbGwudmFsdWU7XG4gICAgLy8gbGV0IHZhbHVlID0gdGhpcy5ncmlkW3RoaXMuZ2V0S2V5KHgsIHkpXTtcbiAgICAvLyByZXR1cm4gdmFsdWUgJiYgdmFsdWUudmFsdWU7XG4gIH1cblxuICBzZXQodmFsdWU6VHxudWxsLCB4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICAvLyBsZXQga2V5ID0gdGhpcy5nZXRLZXkoeCwgeSk7XG4gICAgLy8gaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAvLyAgIGlmIChrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgLy8gICAgIGRlbGV0ZSB0aGlzLmdyaWRba2V5XTtcbiAgICAvLyAgIH1cbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgdGhpcy5ncmlkW2tleV0gPSB7Y29vcmQ6e3gsIHl9LCB2YWx1ZTogdmFsdWV9O1xuICAgIC8vIH1cbiAgICBsZXQga2V5ID0gdGhpcy5nZXRLZXkoeCwgeSk7XG4gICAgbGV0IGNodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQoeCwgeSk7XG4gICAgbGV0IGNodW5rS2V5ID0gdGhpcy5nZXRLZXkoY2h1bmtDb29yZC54LCBjaHVua0Nvb3JkLnkpO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICBpZiAoIShjaHVua0tleSBpbiB0aGlzLmNodW5rcykpIHtcbiAgICAgICAgdGhpcy5jaHVua3NbY2h1bmtLZXldID0ge2Nvb3JkOiBjaHVua0Nvb3JkLCBjb3VudDogMCwgZGF0YToge319O1xuICAgICAgfVxuICAgICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgaWYgKCEoa2V5IGluIGNodW5rLmRhdGEpKSB7XG4gICAgICAgIGNodW5rLmNvdW50Kys7XG4gICAgICAgIHRoaXMuY291bnQrKztcbiAgICAgIH1cbiAgICAgIGNodW5rLmRhdGFba2V5XSA9IHtjb29yZDp7eCwgeX0sIHZhbHVlOiB2YWx1ZX07XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaHVua0tleSBpbiB0aGlzLmNodW5rcykge1xuICAgICAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICAgIGlmIChrZXkgaW4gY2h1bmsuZGF0YSkge1xuICAgICAgICAgIGNodW5rLmNvdW50LS07XG4gICAgICAgICAgdGhpcy5jb3VudC0tO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaHVuay5jb3VudCA+IDApIHtcbiAgICAgICAgICBkZWxldGUgY2h1bmsuZGF0YVtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgIC8vIGlmICh2YWx1ZSA9PSBudWxsKVxuICB9XG5cbiAgbWFwKGY6KHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4gdm9pZCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdyaWQpIHtcbiAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZFtrZXldO1xuICAgICAgbGV0IGNvb3JkID0gdmFsdWUuY29vcmQ7XG4gICAgICBmKHZhbHVlLnZhbHVlLCBjb29yZC54LCBjb29yZC55KTtcbiAgICB9XG4gIH1cblxuICBmaWx0ZXJlZE1hcChtaW46e3g6bnVtYmVyLCB5Om51bWJlcn0sIG1heDp7eDpudW1iZXIsIHk6bnVtYmVyfSxcbiAgICAgICAgICAgICAgZjoodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgLy8gVE9ETzogSW5kZXggdGhlIGdyaWQgb3Igc29tZXRoaW5nLiBJdCdzIHByZXR0eSBpbmVmZmljaWVudC5cbiAgICBsZXQgc3RhcnRDaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKG1pbi54LCBtaW4ueSk7XG4gICAgbGV0IGVuZENodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQobWF4LngsIG1heC55KTtcbiAgICBlbmRDaHVua0Nvb3JkLngrKztcbiAgICBlbmRDaHVua0Nvb3JkLnkrKztcbiAgICBmb3IgKGxldCBjaHVua0tleSBpbiB0aGlzLmNodW5rcykge1xuICAgICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgbGV0IGNodW5rQ29vcmQgPSBjaHVuay5jb29yZDtcbiAgICAgIGlmIChzdGFydENodW5rQ29vcmQueCA8PSBjaHVua0Nvb3JkLnggJiYgY2h1bmtDb29yZC54IDw9IGVuZENodW5rQ29vcmQueCAmJlxuICAgICAgICAgIHN0YXJ0Q2h1bmtDb29yZC55IDw9IGNodW5rQ29vcmQueSAmJiBjaHVua0Nvb3JkLnkgPD0gZW5kQ2h1bmtDb29yZC55KSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBjaHVuay5kYXRhKSB7XG4gICAgICAgICAgbGV0IHZhbHVlID0gY2h1bmsuZGF0YVtrZXldO1xuICAgICAgICAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgICAgICAgIGlmIChtaW4ueCA8PSBjb29yZC54ICYmIGNvb3JkLnggPCBtYXgueCAmJlxuICAgICAgICAgICAgICBtaW4ueSA8PSBjb29yZC55ICYmIGNvb3JkLnkgPCBtYXgueSkge1xuICAgICAgICAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZvciAobGV0IGtleSBpbiB0aGlzLmdyaWQpIHtcbiAgICAvLyAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZFtrZXldO1xuICAgIC8vICAgbGV0IGNvb3JkID0gdmFsdWUuY29vcmQ7XG4gICAgLy8gICBpZiAobWluLnggPD0gY29vcmQueCAmJiBjb29yZC54IDwgbWF4LnggJiZcbiAgICAvLyAgICAgICBtaW4ueSA8PSBjb29yZC55ICYmIGNvb3JkLnkgPCBtYXgueSkge1xuICAgIC8vICAgICBmKHZhbHVlLnZhbHVlLCBjb29yZC54LCBjb29yZC55KTtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgfVxuXG4gIGdldERpcmVjdE5laWdoYm9ycyh4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICBsZXQgZGMgPSAoZHg6bnVtYmVyLCBkeTpudW1iZXIpID0+IHtyZXR1cm4ge3g6IHggKyBkeCwgeTogeSArIGR5fX07XG4gICAgbGV0IG5laWdoYm9ycyA9IFtkYygwLCAtMSksIGRjKDAsIDEpXTtcbiAgICBpZiAoTWF0aC5hYnMoeCAlIDIpID09PSBNYXRoLmFicyh5ICUgMikpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKC0xLCAwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKDEsIDApKTtcbiAgICB9XG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxuXG4gIGdldE5laWdoYm9ycyh4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICBsZXQgZGMgPSAoZHg6bnVtYmVyLCBkeTpudW1iZXIpID0+IHtyZXR1cm4ge3g6IHggKyBkeCwgeTogeSArIGR5fX07XG4gICAgbGV0IG5laWdoYm9ycyA9IFtcbiAgICAgIGRjKC0xLCAwKSwgZGMoLTEsIC0xKSwgZGMoMCwgLTEpLFxuICAgICAgZGMoMSwgLTEpLCBkYygxLCAwKSwgZGMoMSwgMSksXG4gICAgICBkYygwLCAxKSwgZGMoLTEsIDEpLFxuICAgICAgZGMoMCwgLTIpLCBkYygwLCAyKVxuICAgIF07XG4gICAgaWYgKE1hdGguYWJzKHggJSAyKSA9PT0gTWF0aC5hYnMoeSAlIDIpKSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgLTIpKTtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKC0xLCAyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKDEsIC0yKSk7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAyKSk7XG4gICAgfVxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi9jYW1lcmEnO1xuaW1wb3J0IENvbG9yU2VsZWN0Q29tcG9uZW50IGZyb20gJy4vY29sb3Itc2VsZWN0JztcbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQgR3JpZFZpZXdNb2RlbCBmcm9tICcuL2dyaWQtdmlldy1tb2RlbCc7XG5pbXBvcnQgS2V5SW50ZXJhY3Rpdml0eSBmcm9tICcuL2tleS1pbnRlcmFjdGl2aXR5JztcbmltcG9ydCBNb3VzZUludGVyYWN0aXZpdHkgZnJvbSAnLi9tb3VzZS1pbnRlcmFjdGl2aXR5JztcblxuaW1wb3J0IFdvcmxkIGZyb20gJy4vd29ybGQnO1xuaW1wb3J0IHsgVG9vbHNDb2xsZWN0aW9uIH0gZnJvbSAnLi90b29scyc7XG5cbmltcG9ydCBjb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xuXG5cbmNsYXNzIFBhcmFtcyB7XG4gIHByaXZhdGUgc3RhdGljIHBhcmFtczp7W2tleTpzdHJpbmddOiBzdHJpbmd9ID0gKCgpID0+IHtcbiAgICBsZXQgcmF3UGFyYW1zID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnPycpLnNsaWNlKDEpLmpvaW4oJz8nKS5zcGxpdCgnIycpWzBdLnNwbGl0KCcmJyk7XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIGZvciAobGV0IHBhcmFtIG9mIHJhd1BhcmFtcykge1xuICAgICAgbGV0IHNwbGl0ID0gcGFyYW0uc3BsaXQoJz0nKTtcbiAgICAgIGxldCBrZXkgPSBzcGxpdFswXTtcbiAgICAgIGxldCB2YWx1ZSA9IHNwbGl0LnNsaWNlKDEpLmpvaW4oJz0nKTtcbiAgICAgIHBhcmFtc1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0pKCk7XG5cbiAgc3RhdGljIG51bWJlcihrZXk6c3RyaW5nLCBkZWZhdWx0VmFsdWU6bnVtYmVyKTpudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IE51bWJlcih0aGlzLnBhcmFtc1trZXldKTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJpbmcoa2V5OnN0cmluZywgZGVmYXVsdFZhbHVlOnN0cmluZyk6c3RyaW5nIHtcbiAgICBsZXQgdmFsdWU6c3RyaW5nfG51bGwgPSB0aGlzLnBhcmFtc1trZXldO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG5cblxubGV0IHdlaWdodGVkUmFuZG9tID0gZnVuY3Rpb248VD4obGlzdDpBcnJheTxUPiwgd2VpZ2h0Rm46KFQpID0+IG51bWJlcikge1xuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHRocm93ICdlcnJvcic7XG4gIGxldCB0b3RhbFdlaWdodDpudW1iZXIgPSAwO1xuICBsZXQgd2VpZ2h0czpudW1iZXJbXSA9IFtdO1xuICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpIHtcbiAgICBsZXQgd2VpZ2h0ID0gTWF0aC5hYnMod2VpZ2h0Rm4oaXRlbSkpO1xuICAgIHRvdGFsV2VpZ2h0ICs9IHdlaWdodDtcbiAgICB3ZWlnaHRzLnB1c2god2VpZ2h0KTtcbiAgfVxuICBsZXQgbiA9IE1hdGgucmFuZG9tKCkgKiB0b3RhbFdlaWdodDtcbiAgbGV0IGN1bXVsYXRpdmVTdW0gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHdlaWdodHMubGVuZ3RoOyBpKyspIHtcbiAgICBjdW11bGF0aXZlU3VtICs9IHdlaWdodHNbaV07XG4gICAgaWYgKG4gPD0gY3VtdWxhdGl2ZVN1bSkge1xuICAgICAgcmV0dXJuIGxpc3RbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG59O1xuXG5cbmxldCBzZXRTdGF0dXMgPSBmdW5jdGlvbihzdGF0dXMpIHtcbiAgbGV0IHN0YXR1c0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKTtcbiAgaWYgKHN0YXR1c0RpdiAhPSBudWxsKSB7XG4gICAgc3RhdHVzRGl2LnRleHRDb250ZW50ID0gc3RhdHVzO1xuICB9XG59O1xuXG5cbmxldCBsb29wID0gZnVuY3Rpb24oZiwgZHQpIHtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChkdCkgPT4gbG9vcChmLCBkdCkpO1xuICBmKGR0KTtcbn07XG5cblxudHlwZSBDZWxsVHlwZSA9IHN0cmluZztcblxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cblxubGV0IGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5sZXQgY2FudmFzV2lkdGg6bnVtYmVyID0gY2FudmFzLndpZHRoO1xubGV0IGNhbnZhc0hlaWdodDpudW1iZXIgPSBjYW52YXMuaGVpZ2h0O1xuXG5cbi8vKiBBZGQvcmVtb3ZlIGEgJy8nIHRvL2Zyb20gdGhlIGJlZ2lubmluZyBvZiB0aGlzIGxpbmUgdG8gc3dpdGNoIG1vZGVzXG5cbmxldCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmxldCBjYW1lcmEgPSBuZXcgQ2FtZXJhKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpO1xuY2FtZXJhLnNldFpvb20oMS85Nik7XG5cblxudHlwZSBIU0xDZWxsID0ge2g6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIsIGNvbG9yPzpzdHJpbmd9O1xubGV0IGdyaWQ6R3JpZDxIU0xDZWxsPiA9IG5ldyBHcmlkPEhTTENlbGw+KCk7XG5sZXQgcmVuZGVyZXI6R3JpZFZpZXdNb2RlbDxIU0xDZWxsPiA9IG5ldyBHcmlkVmlld01vZGVsPEhTTENlbGw+KGdyaWQpO1xuXG5cbmxldCBkaXJ0eUNhbnZhcyA9IGZhbHNlO1xuXG5cbmxldCByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgZGlydHlDYW52YXMgPSB0cnVlO1xufTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgcmVzaXplKTtcbnJlc2l6ZSgpO1xuXG5sZXQgZ2V0SHNsQ2VsbENvbG9yID0gZnVuY3Rpb24oY2VsbDpIU0xDZWxsKTpzdHJpbmcge1xuICBsZXQgY29sb3IgPSBjZWxsLmNvbG9yO1xuICBpZiAoY29sb3IgPT0gbnVsbCkge1xuICAgIGxldCByZ2IgPSBjb2xvcnMuaHN2VG9SZ2IoY2VsbC5oLCBjZWxsLnMsIGNlbGwubCk7XG4gICAgY29sb3IgPSBjb2xvcnMucmdiVG9IZXgocmdiLnIsIHJnYi5nLCByZ2IuYik7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufTtcblxuLy8gZ3JpZC5zZXQoe2g6IDAsIHM6IDEsIGw6IDF9LCAwLCAwKTtcblxubGV0IG1vZCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtOm51bWJlcik6bnVtYmVyIHtcbiAgbGV0IG1vZGRlZCA9IG4gJSBtO1xuICBpZiAobiA8IDApIG4gKz0gbTtcbiAgcmV0dXJuIG47XG59O1xubGV0IGNsYW1wID0gZnVuY3Rpb24objpudW1iZXIsIG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlciB7XG4gIGlmIChuIDwgbWluKSByZXR1cm4gbWluO1xuICBpZiAobiA+IG1heCkgcmV0dXJuIG1heDtcbiAgcmV0dXJuIG47XG59O1xuXG5cblxuXG5sZXQgYWN0aXZlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFt7eDogMCwgeTogMH1dO1xubGV0IGVkZ2VDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW11cblxuY29uc3QgSU5JVElBTF9MVU0gPSAxO1xuY29uc3QgTUFYX0xVTSA9IDAuNDtcbmNvbnN0IE1JTl9MVU0gPSBQYXJhbXMubnVtYmVyKCdtaW5sdW0nLCAwLjc1KTtcbmNvbnN0IExVTV9ERUxUQSA9IFBhcmFtcy5udW1iZXIoJ2x1bWRlbHRhJywgLTAuMDAwMDEpOy0wLjAwMDA1OzAuMDAwNTtcbmxldCBSRVBSX1BST0JBQklMSVRZID0gUGFyYW1zLm51bWJlcigncmVwcicsIDAuMDA1KTswLjE7MC4yMDswLjAwMjQ7XG5jb25zdCBIVUVfQ0hBTkdFID0gTWF0aC5hYnMoUGFyYW1zLm51bWJlcignaHVlY2hhbmdlJywgMC4wMikpO1xuY29uc3QgU0FUX0NIQU5HRSA9IE1hdGguYWJzKFBhcmFtcy5udW1iZXIoJ3NhdGNoYW5nZScsIDAuMDUpKTtcbmNvbnN0IE1JTl9TQVQgPSBQYXJhbXMubnVtYmVyKCdtaW5zYXQnLCAwLjcpO1xuY29uc3QgTUFYX1NBVCA9IFBhcmFtcy5udW1iZXIoJ21heHNhdCcsIDEpO1xuY29uc3QgTUlOX1pPT00gPSBQYXJhbXMubnVtYmVyKCdtaW56b29tJywgMS8zKTtcblxubGV0IGdldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGdyaWQsIHgsIHksIHZpZXdSZWN0KSB7XG4gIGxldCBuZWlnaGJvcnMgPSBncmlkLmdldERpcmVjdE5laWdoYm9ycyh4LCB5KTtcbiAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gZ3JpZC5nZXQodmFsdWUueCwgdmFsdWUueSkgPT0gbnVsbCk7XG4gIGlmICh2aWV3UmVjdCAhPSBudWxsKSB7XG4gICAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gKFxuICAgICAgICAgIHZpZXdSZWN0LmxlZnQgPD0gdmFsdWUueCAmJiB2YWx1ZS54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gICAgICAgICAgdmlld1JlY3QudG9wIDw9IHZhbHVlLnkgJiYgdmFsdWUueSA8PSB2aWV3UmVjdC5ib3R0b20pKTtcbiAgfVxuICByZXR1cm4gbmVpZ2hib3JzO1xufTtcblxuXG5sZXQga2V5SW50ZXJhY3Rpdml0eSA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5cblxubGV0IGludGVyYWN0aXZpdHkgPSBuZXcgTW91c2VJbnRlcmFjdGl2aXR5KGNhbnZhcyk7XG5sZXQgZHJhZ1Bvc2l0aW9uOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xubGV0IGxhc3REcmFnUG9zaXRpb246bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG5cbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignZHJhZy1zdGFydCcsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGlmIChwb3NpdGlvbi54ID09IG51bGwgfHwgcG9zaXRpb24ueSA9PSBudWxsKSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSB7eDogcG9zaXRpb24ueCwgeTogcG9zaXRpb24ueX07XG4vLyAgIH1cbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdkcmFnLW1vdmUnLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBpZiAocG9zaXRpb24ueCA9PSBudWxsIHx8IHBvc2l0aW9uLnkgPT0gbnVsbCkge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0ge3g6IHBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnl9O1xuLy8gICB9XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbihbJ2RyYWctZW5kJywgJ2NsaWNrJ10sIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2NsaWNrJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgY29uc29sZS5sb2coZ2V0TmVpZ2hib3JzKGdyaWQsIGhvdmVyZWQueCwgaG92ZXJlZC55LCBudWxsKSk7XG4vLyB9KTtcblxuLy8gbGV0IGhvdmVyZWQgPSB7eDogMCwgeTogMH07XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2hvdmVyJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgbGV0IGdyaWRDb29yZCA9IHJlbmRlcmVyLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG4vLyAgIGhvdmVyZWQueCA9IE1hdGguZmxvb3IoZ3JpZENvb3JkLngpO1xuLy8gICBob3ZlcmVkLnkgPSBNYXRoLmZsb29yKGdyaWRDb29yZC55KTtcbi8vIH0pO1xuXG5cbmxldCB1cGRhdGVBY3RpdmVDZWxscyA9IGZ1bmN0aW9uKGR0LCB2aWV3UmVjdCk6dm9pZCB7XG4gIGxldCBuZXdBY3RpdmVDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIGZvciAobGV0IGFjdGl2ZUNlbGwgb2YgYWN0aXZlQ2VsbHMpIHtcbiAgICBsZXQga2VlcCA9IHRydWU7XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGxldCBleGlzdGVkID0gZXhpc3RpbmcgIT0gbnVsbDtcbiAgICBpZiAoZXhpc3RpbmcgPT0gbnVsbCkge1xuICAgICAgZXhpc3RpbmcgPSB7aDogTWF0aC5yYW5kb20oKSwgczogTWF0aC5yYW5kb20oKSAqIChNQVhfU0FUIC0gTUlOX1NBVCkgKyBNSU5fU0FULCBsOiBJTklUSUFMX0xVTX07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdMID0gZXhpc3RpbmcubCArPSBMVU1fREVMVEEgKiAoZHQgLyAxMDAwKTtcbiAgICAgIGlmIChMVU1fREVMVEEgPiAwICYmIG5ld0wgPj0gTUFYX0xVTSkge1xuICAgICAgICBuZXdMID0gTUFYX0xVTTtcbiAgICAgIH1cbiAgICAgIGlmIChMVU1fREVMVEEgPCAwICYmIG5ld0wgPD0gTUlOX0xVTSkge1xuICAgICAgICBuZXdMID0gTUlOX0xVTTtcbiAgICAgIH1cbiAgICAgIGV4aXN0aW5nLmwgPSBuZXdMO1xuICAgIH1cbiAgICBpZiAoIWV4aXN0ZWQpIHtcbiAgICAgIGdyaWQuc2V0KGV4aXN0aW5nLCBhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSk7XG4gICAgfVxuICAgIGlmIChrZWVwKSB7XG4gICAgICBsZXQgcG9zaXRpdmVfZGVsdGEgPSBMVU1fREVMVEEgPiAwO1xuICAgICAgaWYgKChwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sID49IE1BWF9MVU0pIHx8XG4gICAgICAgICAgKCFwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sIDw9IE1JTl9MVU0pKSB7XG4gICAgICAgIGV4aXN0aW5nLmNvbG9yID0gZ2V0SHNsQ2VsbENvbG9yKGV4aXN0aW5nKTtcbiAgICAgICAgZWRnZUNlbGxzLnB1c2goYWN0aXZlQ2VsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBY3RpdmVDZWxscy5wdXNoKGFjdGl2ZUNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhY3RpdmVDZWxscyA9IG5ld0FjdGl2ZUNlbGxzO1xufTtcblxubGV0IHJlcHJvZHVjZUNlbGxzID0gZnVuY3Rpb24oZHQsIHZpZXdSZWN0KTpib29sZWFuIHtcbiAgbGV0IHJldHVyblRydWUgPSBmYWxzZTtcbiAgd2hpbGUgKChhY3RpdmVDZWxscy5sZW5ndGggPiAwIHx8IGVkZ2VDZWxscy5sZW5ndGggPiAwKSAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkpIHtcbiAgICAvLyBsZXQgYWN0aXZlQ2VsbCA9IHdlaWdodGVkUmFuZG9tKGFjdGl2ZUNlbGxzLmNvbmNhdChlZGdlQ2VsbHMpLCAoY2VsbCkgPT4ge1xuICAgIC8vICAgbGV0IG5laWdoYm9ycyA9IGdyaWQuZ2V0TmVpZ2hib3JzKGNlbGwueCwgY2VsbC55KVxuICAgIC8vICAgICAgIC5maWx0ZXIoKG4pID0+IGdyaWQuZ2V0KG4ueCwgbi55KSA9PSBudWxsKTtcbiAgICAvLyAgIHJldHVybiBuZWlnaGJvcnMubGVuZ3RoO1xuICAgIC8vIH0pO1xuICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhY3RpdmVDZWxscy5sZW5ndGggKyBlZGdlQ2VsbHMubGVuZ3RoKSk7XG4gICAgbGV0IGFjdGl2ZUNlbGwgPSBpbmRleCA8IGFjdGl2ZUNlbGxzLmxlbmd0aCA/IGFjdGl2ZUNlbGxzW2luZGV4XSA6IGVkZ2VDZWxsc1tpbmRleCAtIGFjdGl2ZUNlbGxzLmxlbmd0aF07XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBsZXQgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCB2aWV3UmVjdCk7XG4gICAgICBsZXQgbmV3TmVpZ2hib3I6bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gbGV0IGZpbHRlcmVkTmVpZ2hib3JzOntuZWlnaGJvcjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9LCB3ZWlnaHQ6bnVtYmVyfVtdID0gbmVpZ2hib3JzLm1hcCgobmVpZ2hib3IpID0+IHtcbiAgICAgICAgLy8gICBsZXQgbmVpZ2hib3JOZWlnaGJvcnMgPSBncmlkLmdldE5laWdoYm9ycyhuZWlnaGJvci54LCBuZWlnaGJvci55KVxuICAgICAgICAvLyAgICAgICAuZmlsdGVyKChuKSA9PiBncmlkLmdldChuLngsIG4ueSkgPT0gbnVsbCk7XG4gICAgICAgIC8vICAgcmV0dXJuIHtcbiAgICAgICAgLy8gICAgIG5laWdoYm9yOiBuZWlnaGJvcixcbiAgICAgICAgLy8gICAgIHdlaWdodDogbmVpZ2hib3JOZWlnaGJvcnMubGVuZ3RoXG4gICAgICAgIC8vICAgfTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGZpbHRlcmVkTmVpZ2hib3JzLnB1c2goe25laWdoYm9yOiBudWxsLCB3ZWlnaHQ6IDEwfSk7XG4gICAgICAgIC8vIGxldCBuID0gd2VpZ2h0ZWRSYW5kb20oZmlsdGVyZWROZWlnaGJvcnMsIChuKSA9PiBNYXRoLnBvdyhuLndlaWdodCwgOCkpLm5laWdoYm9yO1xuICAgICAgICAvLyBpZiAobiA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBsZXQgbiA9IG5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKV07XG4gICAgICAgIGxldCBkZWx0YUh1ZSA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogSFVFX0NIQU5HRTtcbiAgICAgICAgbGV0IGRlbHRhU2F0ID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBTQVRfQ0hBTkdFO1xuICAgICAgICBncmlkLnNldCh7XG4gICAgICAgICAgaDogbW9kKGV4aXN0aW5nLmggKyBkZWx0YUh1ZSwgMSksXG4gICAgICAgICAgczogY2xhbXAoZXhpc3RpbmcucyArIGRlbHRhU2F0LCBNSU5fU0FULCBNQVhfU0FUKSxcbiAgICAgICAgICBsOiBJTklUSUFMX0xVTVxuICAgICAgICB9LCBuLngsIG4ueSk7XG4gICAgICAgIG5ld05laWdoYm9yID0gbjtcbiAgICAgIH1cbiAgICAgIGxldCBuZWlnaGJvckNvbXBlbnNhdGlvbiA9IG5ld05laWdoYm9yID09IG51bGwgPyAwIDogMTtcbiAgICAgIGxldCBmZXJ0aWxlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCBudWxsKTtcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoIC0gbmVpZ2hib3JDb21wZW5zYXRpb24gIT09IGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblRydWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxldCBlZGdlSW5kZXggPSBlZGdlQ2VsbHMuaW5kZXhPZihhY3RpdmVDZWxsKTtcbiAgICAgICAgaWYgKGVkZ2VJbmRleCA+PSAwKSB7XG4gICAgICAgIC8vIGlmIChpbmRleCA+PSBhY3RpdmVDZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBlZGdlQ2VsbHMuc3BsaWNlKGluZGV4IC0gYWN0aXZlQ2VsbHMubGVuZ3RoLCAxKTtcbiAgICAgICAgICBlZGdlQ2VsbHMuc3BsaWNlKGVkZ2VJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdOZWlnaGJvciAhPSBudWxsKSB7XG4gICAgICAgIGFjdGl2ZUNlbGxzLnB1c2gobmV3TmVpZ2hib3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuVHJ1ZTtcbn1cblxuXG5cbi8vIGxldCB2aWV3UmVjdCA9IHJlbmRlcmVyLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuLy8gdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuLy8gdmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbi8vIHZpZXdSZWN0LnJpZ2h0ID0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KSArIDE7XG4vLyB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4vLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xuLy8gdXBkYXRlQWN0aXZlQ2VsbHMoMTAwLCB2aWV3UmVjdClcbi8vIH1cblxubGV0IGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sb29wKChkdDpudW1iZXIpID0+IHtcbiAgaWYgKFJFUFJfUFJPQkFCSUxJVFkgPCAwLjk1KSB7XG4gICAgUkVQUl9QUk9CQUJJTElUWSArPSBkdCAvIDIwMDAwMDAwMDA7XG4gIH1cbiAgaWYgKFJFUFJfUFJPQkFCSUxJVFkgPiAwLjk1KSB7XG4gICAgUkVQUl9QUk9CQUJJTElUWSA9IDAuOTU7XG4gIH1cblxuICBsZXQgY2FtZXJhQWx0ZXJlZCA9IGZhbHNlO1xuICBpZiAoZHJhZ1Bvc2l0aW9uICE9IG51bGwpIHtcbiAgICBpZiAobGFzdERyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAoZHJhZ1Bvc2l0aW9uLnggIT09IGxhc3REcmFnUG9zaXRpb24ueCB8fFxuICAgICAgICAgIGRyYWdQb3NpdGlvbi55ICE9PSBsYXN0RHJhZ1Bvc2l0aW9uLnkpIHtcbiAgICAgICAgbGV0IHN0YXJ0ID0gY2FtZXJhLnVudHJhbnNmb3JtKGxhc3REcmFnUG9zaXRpb24ueCwgbGFzdERyYWdQb3NpdGlvbi55KTtcbiAgICAgICAgbGV0IGVuZCA9IGNhbWVyYS51bnRyYW5zZm9ybShkcmFnUG9zaXRpb24ueCwgZHJhZ1Bvc2l0aW9uLnkpO1xuICAgICAgICBjYW1lcmEubW92ZShzdGFydC54IC0gZW5kLngsIHN0YXJ0LnkgLSBlbmQueSk7XG4gICAgICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0RHJhZ1Bvc2l0aW9uID0ge3g6IGRyYWdQb3NpdGlvbi54LCB5OiBkcmFnUG9zaXRpb24ueX07XG4gIH0gZWxzZSBpZiAobGFzdERyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgbGFzdERyYWdQb3NpdGlvbiA9IG51bGw7XG4gIH1cbiAgaWYgKGtleUludGVyYWN0aXZpdHkuaXNEb3duKDE4OSkpIHsgLy8gbWludXNcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpICogMS4xKTtcbiAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgfVxuICBpZiAoa2V5SW50ZXJhY3Rpdml0eS5pc0Rvd24oMTg3KSkgeyAvLyBwbHVzXG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gIH1cblxuICBsZXQgdmlld1JlY3QgPSByZW5kZXJlci5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbiAgdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuICB2aWV3UmVjdC50b3AgPSBNYXRoLmZsb29yKHZpZXdSZWN0LnRvcCkgLSAxO1xuICB2aWV3UmVjdC5yaWdodCA9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCkgKyAxO1xuICB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4gIC8vZm9yIChsZXQgaSA9IDA7IGkgPCA1MDA7IGkrKykge1xuICB1cGRhdGVBY3RpdmVDZWxscyhkdCwgdmlld1JlY3QpO1xuICAvLyB9XG4gIGlmIChncmlkLmdldENvdW50KCkgLyAoKHZpZXdSZWN0LmJvdHRvbSAtIHZpZXdSZWN0LnRvcCkgKiAodmlld1JlY3QucmlnaHQgLSB2aWV3UmVjdC5sZWZ0KSkgPiAxLjAwMSkge1xuICAgIGxldCBjdXJyZW50Wm9vbSA9IGNhbWVyYS5nZXRab29tKCk7XG4gICAgaWYgKGN1cnJlbnRab29tIDwgTUlOX1pPT00pIHtcbiAgICAgIGNhbWVyYS5zZXRab29tKGN1cnJlbnRab29tICogMik7XG4gICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiAoYWN0aXZlQ2VsbHMubGVuZ3RoID09PSAwICYmIE1hdGgucmFuZG9tKCkgPD0gUkVQUl9QUk9CQUJJTElUWSAvIDIpIHtcbiAgLy8gICBsZXQgZXhpc3Rpbmc6e1trZXk6c3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgLy8gICBncmlkLmZpbHRlcmVkTWFwKHt4OiB2aWV3UmVjdC5sZWZ0LCB5OiB2aWV3UmVjdC50b3B9LFxuICAvLyAgICAgICAgICAgICAgICAgICAge3g6IHZpZXdSZWN0LnJpZ2h0LCB5OiB2aWV3UmVjdC5ib3R0b219LFxuICAvLyAgICAgICAgICAgICAgICAgICAgKHZhbHVlLCB4LCB5KSA9PiAoZXhpc3RpbmdbeCArICcvJyArIHldID0gdHJ1ZSkpO1xuICAvLyAgIGxldCBub25FeGlzdGluZzp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIC8vICAgZm9yIChsZXQgeCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCk7IHggPD0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KTsgeCsrKSB7XG4gIC8vICAgICBmb3IgKGxldCB5ID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApOyB5IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5ib3R0b20pOyB5KyspIHtcbiAgLy8gICAgICAgaWYgKCFleGlzdGluZ1t4ICsgJy8nICsgeV0pIHtcbiAgLy8gICAgICAgICBub25FeGlzdGluZy5wdXNoKHt4OiB4LCB5OiB5fSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgYWN0aXZlQ2VsbHMucHVzaChub25FeGlzdGluZ1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub25FeGlzdGluZy5sZW5ndGgpXSk7XG4gIC8vIH1cblxuICBsZXQgbWFpblRyaWFuZ2xlUmVuZGVyZXIgPSAoY29udGV4dCwgY2VsbCwgeCwgeSkgPT4ge1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ2V0SHNsQ2VsbENvbG9yKGNlbGwpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIC8vIGNvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAgIC8vIGNvbnRleHQubGluZVdpZHRoID0gMC41O1xuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZSgpO1xuICB9O1xuXG4gIGlmIChjYW1lcmFBbHRlcmVkIHx8IGRpcnR5Q2FudmFzKSB7XG4gICAgZGlydHlDYW52YXMgPSBmYWxzZTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIGFjdGl2ZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBlZGdlQ2VsbHMsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfVxuICByZXByb2R1Y2VDZWxscyhkdCwgdmlld1JlY3QpO1xuXG4gIC8vIHJlbmRlcmVyLnJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYSwgW2hvdmVyZWRdLCAoY29udGV4dCwgY2VsbCwgeCwgeSkgPT4ge1xuICAvLyAgIGNvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gIC8vICAgY29udGV4dC5saW5lV2lkdGggPSAzO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIC8vICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjMDAwJztcbiAgLy8gICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XG4gIC8vICAgY29udGV4dC5zdHJva2UoKTtcbiAgLy8gfSk7XG5cbiAgLy8gbGV0IG5vd1RpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgLy8gbGV0IHRpbWVQYXNzZWQgPSBub3dUaW1lIC0gbGFzdFRpbWU7XG4gIC8vIGxhc3RUaW1lID0gbm93VGltZTtcbiAgLy8gY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgLy8gY29udGV4dC5mb250ID0gJzE0cHggQXJpYWwnO1xuICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAvLyBjb250ZXh0LmxpbmVXaWR0aCA9IDI7XG4gIC8vIGxldCBvblNjcmVlbkVkZ2UgPSAwO1xuICAvLyBmb3IgKGxldCBlZGdlQ2VsbCBvZiBlZGdlQ2VsbHMpIHtcbiAgLy8gICBpZiAodmlld1JlY3QubGVmdCA8PSBlZGdlQ2VsbC54ICYmIGVkZ2VDZWxsLnggPD0gdmlld1JlY3QucmlnaHQgJiZcbiAgLy8gICAgICAgdmlld1JlY3QudG9wIDw9IGVkZ2VDZWxsLnkgJiYgZWRnZUNlbGwueSA8PSB2aWV3UmVjdC5ib3R0b20pIHtcbiAgLy8gICAgIG9uU2NyZWVuRWRnZSsrO1xuICAvLyAgIH1cbiAgLy8gfVxuICAvLyBsZXQgZnBzVGV4dCA9ICdGUFM6ICcgKyBNYXRoLnJvdW5kKDEwMDAgLyB0aW1lUGFzc2VkKSAvLysgJyAgQWN0aXZlOiAnICsgYWN0aXZlQ2VsbHMubGVuZ3RoICsgJyAgRWRnZTogJyArIGVkZ2VDZWxscy5sZW5ndGggKyAnICBvbnNjcmVlbiAnICsgb25TY3JlZW5FZGdlO1xuICAvLyBjb250ZXh0LnN0cm9rZVRleHQoZnBzVGV4dCwgMTAsIDEwKTtcbiAgLy8gY29udGV4dC5maWxsVGV4dChmcHNUZXh0LCAxMCwgMTApO1xufSwgMCk7XG5cblxucmV0dXJuO1xuLyovXG5cblxuXG5cbmxldCB0b29sU2VsZWN0ID0gPEhUTUxTZWxlY3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sLXNlbGVjdCcpO1xubGV0IHRvb2xTZWxlY3Rpb24gPSAnZHJhdyc7XG5sZXQgc2V0VG9vbCA9IGZ1bmN0aW9uKG5ld1Rvb2w6c3RyaW5nKSB7XG4gIC8vIHRvb2xTZWxlY3Rpb24gPSBuZXdUb29sO1xuICAvLyB0b29sU2VsZWN0LnZhbHVlID0gbmV3VG9vbDtcbiAgd29ybGQuc2VsZWN0VG9vbCg8a2V5b2YgVG9vbHNDb2xsZWN0aW9uPm5ld1Rvb2wpO1xufTtcbmlmICh0b29sU2VsZWN0ICE9IG51bGwpIHtcbiAgdG9vbFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBzZXRUb29sKHRvb2xTZWxlY3QudmFsdWUpO1xuICB9KTtcbn1cblxuXG5cbmxldCB3b3JsZDpXb3JsZCA9IG5ldyBXb3JsZChjYW52YXMpO1xubGV0IGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY29uc3QgVkVMT0NJVFk6bnVtYmVyID0gMTU7XG5cbmxldCBrZXlzID0gbmV3IEtleUludGVyYWN0aXZpdHkoKTtcbmtleXMubWFwKCdsZWZ0JywgNjUpO1xua2V5cy5tYXAoJ3JpZ2h0JywgNjgpO1xua2V5cy5tYXAoJ3VwJywgODcpO1xua2V5cy5tYXAoJ2Rvd24nLCA4Myk7XG5rZXlzLm1hcCgnem9vbS1vdXQnLCA4MSk7XG5rZXlzLm1hcCgnem9vbS1pbicsIDY5KTtcbmxvb3AoKCkgPT4ge1xuICAvLyByZW5kZXJGdWxsVHJpYW5nbGVHcmlkKGdyaWQsIHJlbmRlcmVyLCBjb250ZXh0KTtcblxuICB3b3JsZC5yZW5kZXIoKTtcblxuICBsZXQgY2FtZXJhID0gd29ybGQuZ2V0Q2FtZXJhKCk7XG5cbiAgaWYgKGtleXMuaXNEb3duKCd6b29tLW91dCcpKSB7XG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAqIDEuMSk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCd6b29tLWluJykpIHtcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpIC8gMS4xKTtcbiAgfVxuXG4gIGxldCBkeCA9IDAsIGR5ID0gMDtcbiAgaWYgKGtleXMuaXNEb3duKCdsZWZ0JykpIHtcbiAgICBkeCAtPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ3JpZ2h0JykpIHtcbiAgICBkeCArPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ3VwJykpIHtcbiAgICBkeSAtPSBWRUxPQ0lUWTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ2Rvd24nKSkge1xuICAgIGR5ICs9IFZFTE9DSVRZO1xuICB9XG5cbiAgZHggKj0gY2FtZXJhLmdldFpvb20oKTtcbiAgZHkgKj0gY2FtZXJhLmdldFpvb20oKTtcbiAgaWYgKGR4ICE9PSAwIHx8IGR5ICE9PSAwKSB7XG4gICAgY2FtZXJhLm1vdmUoZHgsIGR5KTtcbiAgfVxufSwgMCk7XG5cbi8vICovXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5SW50ZXJhY3Rpdml0eSB7XG4gIHByaXZhdGUga2V5czp7W2tleTpzdHJpbmddOiBib29sZWFufTtcbiAgcHJpdmF0ZSBrZXlNYXA6e1trZXk6c3RyaW5nXTogc3RyaW5nfG51bWJlcn07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0ge307XG4gICAgdGhpcy5rZXlNYXAgPSB7fTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgbGV0IGtleWNvZGUgPSBlLmtleUNvZGU7XG4gICAgICB0aGlzLmtleXNba2V5Y29kZV0gPSB0cnVlO1xuICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5rZXlzW25hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBsZXQga2V5Y29kZSA9IGUua2V5Q29kZTtcbiAgICAgIGlmIChrZXljb2RlIGluIHRoaXMua2V5cykge1xuICAgICAgICBkZWxldGUgdGhpcy5rZXlzW2tleWNvZGVdO1xuICAgICAgfVxuICAgICAgaWYgKGtleWNvZGUgaW4gdGhpcy5rZXlNYXApIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgICAgaWYgKG5hbWUgIT0gbnVsbCAmJiBuYW1lIGluIHRoaXMua2V5cykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmtleXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG1hcChuYW1lOnN0cmluZywga2V5OnN0cmluZ3xudW1iZXIpIHtcbiAgICB0aGlzLmtleU1hcFtrZXldID0gbmFtZTtcbiAgfVxuXG4gIGlzRG93bihrZXk6c3RyaW5nfG51bWJlcik6Ym9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5rZXlzW2tleV07XG4gIH1cblxuICBnZXREb3duKCk6c3RyaW5nW10ge1xuICAgIGxldCBrZXlzOnN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMua2V5cykge1xuICAgICAgaWYgKHRoaXMuaXNEb3duKGtleSkpIHtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4vZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW91c2VJbnRlcmFjdGl2aXR5IHtcbiAgZXZlbnRzOkV2ZW50cztcblxuICBwcml2YXRlIGVsZW1lbnQ6SFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgZG93bjpib29sZWFuO1xuICBwcml2YXRlIHBvc2l0aW9uOnt4PzpudW1iZXIsIHk/Om51bWJlcn07XG4gIHByaXZhdGUgZHJhZ2dpbmc6Ym9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50OkhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLnBvc2l0aW9uID0ge307XG4gICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlRG93bihlKSk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlTW92ZShlKSk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZVVwKGUpKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcCh7XG4gICAgICBvZmZzZXRYOiBlLm9mZnNldFggLSB0aGlzLmVsZW1lbnQub2Zmc2V0TGVmdCxcbiAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSAtIHRoaXMuZWxlbWVudC5vZmZzZXRUb3B9LCBmYWxzZSkpO1xuICB9XG5cbiAgaXNEb3duKCkgeyByZXR1cm4gdGhpcy5kb3duOyB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZVVwKGV2ZW50LCBldmVudHM6Ym9vbGVhbiA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5kb3duKSB7XG4gICAgICBsZXQgcG9zaXRpb24gPSB7eDogZXZlbnQub2Zmc2V0WCwgeTogZXZlbnQub2Zmc2V0WX07XG4gICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgIGlmIChldmVudHMpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLWVuZCcsIHBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdjbGljaycsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5wb3NpdGlvbi55ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VNb3ZlKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuZG93bikge1xuICAgICAgdGhpcy5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgIHRoaXMucG9zaXRpb24ueSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgICAvLyBJZiB0aGUgbW91c2UgaXMgZG93biB3aGVuIHdlIHJlY2VpdmUgdGhlIG1vdXNlZG93biBvciBtb3ZlIGV2ZW50LCB0aGVuXG4gICAgICAvLyB3ZSBhcmUgZHJhZ2dpbmcuXG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctc3RhcnQnLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctbW92ZScsIHRoaXMucG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV2ZW50cy5lbWl0KCdob3ZlcicsIHt4OiBldmVudC5vZmZzZXRYLCB5OiBldmVudC5vZmZzZXRZfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZURvd24oZXZlbnQpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnggPSBldmVudC5vZmZzZXRYO1xuICAgIHRoaXMucG9zaXRpb24ueSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgdGhpcy5kb3duID0gdHJ1ZTtcbiAgICB0aGlzLmV2ZW50cy5lbWl0KCdkb3duJywgdGhpcy5wb3NpdGlvbik7XG4gIH1cbn1cbiJdfQ==
