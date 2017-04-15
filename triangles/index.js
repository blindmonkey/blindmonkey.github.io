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
    camera.setZoom(Params.number('zoom', 1 / 96));
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
    const LUM_DELTA = Params.number('lumdelta', -0.03);
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
    let lastFrame = null;
    let lastTime = new Date().getTime();
    loop((dt) => {
        let thisFrame = dt;
        if (lastFrame != null) {
            dt = thisFrame - lastFrame;
        }
        lastFrame = thisFrame;
        if (REPR_PROBABILITY < 0.95) {
            REPR_PROBABILITY += dt / 300000;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbW91c2UtaW50ZXJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPRSxZQUFZLGFBQW9CLEVBQUUsY0FBcUI7UUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQ3ZCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLENBQUMsQ0FBUSxFQUFFLENBQVE7UUFDMUIsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDckQsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7U0FDdkQsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUNILFdBQVcsQ0FBQyxDQUFRLEVBQUUsQ0FBUTtRQUM1QixNQUFNLENBQUM7WUFDTCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNyRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN2RCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBdkRELHlCQXVEQzs7Ozs7QUNwREQsSUFBSSxNQUFNLEdBQUc7SUFDWCxNQUFNLEVBQUU7UUFDTixJQUFJLGVBQWUsR0FBRztZQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxnQkFBZ0IsR0FBRyxVQUFTLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQVksRUFBRSxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0RCxDQUFDO0lBQ0QsR0FBRyxFQUFFLFVBQVMsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO1FBQ3hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDNUMsQ0FBQztJQUNELFFBQVEsRUFBRSxVQUFTLEdBQVU7UUFDM0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDakMsQ0FBQztJQUNKLENBQUM7SUFDRCxRQUFRLEVBQUUsVUFBUyxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVE7UUFDN0MsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDUixDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElB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QUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQzdCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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QyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztJQUNILENBQUM7SUFFTyxlQUFlLENBQUMsS0FBSztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0Y7QUEvREQscUNBK0RDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbWVyYSB7XG4gIC8vIFdvcmxkLXNwYWNlIGNhbWVyYSBmb2N1cyBwb3NpdGlvbi5cbiAgcHJpdmF0ZSB4Om51bWJlcjtcbiAgcHJpdmF0ZSB5Om51bWJlcjtcbiAgcHJpdmF0ZSB6b29tOm51bWJlcjtcbiAgcHJpdmF0ZSB2aWV3cG9ydDp7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfTtcblxuICBjb25zdHJ1Y3Rvcih2aWV3cG9ydFdpZHRoOm51bWJlciwgdmlld3BvcnRIZWlnaHQ6bnVtYmVyKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMuem9vbSA9IDE7XG4gICAgdGhpcy52aWV3cG9ydCA9IHt3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodH07XG4gIH1cblxuICBnZXRWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4ge3dpZHRoOiB0aGlzLnZpZXdwb3J0LndpZHRoLCBoZWlnaHQ6IHRoaXMudmlld3BvcnQuaGVpZ2h0fTtcbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICBnZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLnpvb207XG4gIH1cblxuICBzZXRab29tKG5ld1pvb206bnVtYmVyKSB7XG4gICAgdGhpcy56b29tID0gbmV3Wm9vbTtcbiAgfVxuXG4gIG1vdmUoZHg6bnVtYmVyLCBkeTpudW1iZXIpIHtcbiAgICB0aGlzLnggKz0gZHg7XG4gICAgdGhpcy55ICs9IGR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSB3b3JsZC1zcGFjZSBjb29yZGluYXRlIHRvIGNhbWVyYS1zcGFjZS5cbiAgICovXG4gIHRyYW5zZm9ybSh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHggLSB0aGlzLngpIC8gdGhpcy56b29tICsgdGhpcy52aWV3cG9ydC53aWR0aCAvIDIsXG4gICAgICB5OiAoeSAtIHRoaXMueSkgLyB0aGlzLnpvb20gKyB0aGlzLnZpZXdwb3J0LmhlaWdodCAvIDIsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgY29vcmRpbmF0ZSBmcm9tIGNhbWVyYS1zcGFjZSB0byB3b3JsZC1zcGFjZS5cbiAgICovXG4gIHVudHJhbnNmb3JtKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoeCAtIHRoaXMudmlld3BvcnQud2lkdGggLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueCxcbiAgICAgIHk6ICh5IC0gdGhpcy52aWV3cG9ydC5oZWlnaHQgLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueSxcbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgdHlwZSBIc3ZDb2xvciA9IHtoOm51bWJlciwgczpudW1iZXIsIHY6bnVtYmVyfTtcbmV4cG9ydCB0eXBlIFJnYkNvbG9yID0ge3I6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXJ9O1xuXG5sZXQgY29sb3JzID0ge1xuICByYW5kb206IGZ1bmN0aW9uKCkge1xuICAgIGxldCByYW5kb21Db21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuICAgIH07XG4gICAgbGV0IHJhbmRvbUNvbXBvbmVudHMgPSBmdW5jdGlvbihuKSB7XG4gICAgICBsZXQgb3V0Om51bWJlcltdID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBvdXQucHVzaChyYW5kb21Db21wb25lbnQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbUNvbXBvbmVudHMoMykuam9pbignLCcpICsgJyknO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICByZXR1cm4gJ3JnYignICsgW3IsIGcsIGJdLmpvaW4oJywnKSArICcpJztcbiAgfSxcbiAgaGV4VG9SZ2I6IGZ1bmN0aW9uKHN0cjpzdHJpbmcpIHtcbiAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHI6IHBhcnNlSW50KHN0ci5zbGljZSgwLCAyKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQoc3RyLnNsaWNlKDIsIDQpLCAxNiksXG4gICAgICBiOiBwYXJzZUludChzdHIuc2xpY2UoNCwgNiksIDE2KSxcbiAgICB9O1xuICB9LFxuICByZ2JUb0hleDogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIHIgPSByfDA7XG4gICAgZyA9IGd8MDtcbiAgICBiID0gYnwwO1xuXG4gICAgaWYgKHIgPCAwKSByID0gMDtcbiAgICBpZiAociA+IDI1NSkgciA9IDI1NTtcbiAgICBpZiAoZyA8IDApIGcgPSAwO1xuICAgIGlmIChnID4gMjU1KSBnID0gMjU1O1xuICAgIGlmIChiIDwgMCkgYiA9IDA7XG4gICAgaWYgKGIgPiAyNTUpIGIgPSAyNTU7XG5cbiAgICBsZXQgcnN0ciA9IHIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChyc3RyLmxlbmd0aCA9PT0gMSkgcnN0ciA9ICcwJyArIHJzdHI7XG4gICAgbGV0IGdzdHIgPSBnLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAoZ3N0ci5sZW5ndGggPT09IDEpIGdzdHIgPSAnMCcgKyBnc3RyO1xuICAgIGxldCBic3RyID0gYi50b1N0cmluZygxNik7XG4gICAgaWYgKGJzdHIubGVuZ3RoID09PSAxKSBic3RyID0gJzAnICsgYnN0cjtcbiAgICByZXR1cm4gWycjJywgcnN0ciwgZ3N0ciwgYnN0cl0uam9pbignJyk7XG4gIH0sXG4gIHJnYlRvSHN2OiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgLy8gaHN2ICAgICAgICAgb3V0O1xuICAgIC8vIGRvdWJsZSAgICAgIG1pbiwgbWF4LCBkZWx0YTtcbiAgICByID0gciAvIDI1NTtcbiAgICBnID0gZyAvIDI1NTtcbiAgICBiID0gYiAvIDI1NTtcblxuICAgIGxldCBtaW4gPSByICAgIDwgZyA/IHIgICA6IGc7XG4gICAgbWluICAgICA9IG1pbiAgPCBiID8gbWluIDogYjtcblxuICAgIGxldCBtYXggPSByICAgID4gZyA/IHIgICA6IGc7XG4gICAgbWF4ICAgICA9IG1heCAgPiBiID8gbWF4IDogYjtcblxuICAgIGxldCBvdXQgPSB7aDogMCwgczogMCwgdjogMH07XG4gICAgbGV0IHYgPSBtYXg7XG4gICAgbGV0IGRlbHRhID0gbWF4IC0gbWluO1xuICAgIGlmIChkZWx0YSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICBvdXQucyA9IDA7XG4gICAgICAgIG91dC5oID0gMDsgLy8gdW5kZWZpbmVkLCBtYXliZSBuYW4/XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmKCBtYXggPiAwLjAgKSB7IC8vIE5PVEU6IGlmIE1heCBpcyA9PSAwLCB0aGlzIGRpdmlkZSB3b3VsZCBjYXVzZSBhIGNyYXNoXG4gICAgICAgIG91dC5zID0gKGRlbHRhIC8gbWF4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBtYXggaXMgMCwgdGhlbiByID0gZyA9IGIgPSAwXG4gICAgICAgIC8vIHMgPSAwLCB2IGlzIHVuZGVmaW5lZFxuICAgICAgICBvdXQucyA9IDAuMDtcbiAgICAgICAgb3V0LmggPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiggciA+PSBtYXggKSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vID4gaXMgYm9ndXMsIGp1c3Qga2VlcHMgY29tcGlsb3IgaGFwcHlcbiAgICAgICAgb3V0LmggPSAoZyAtIGIpIC8gZGVsdGE7ICAgICAgICAvLyBiZXR3ZWVuIHllbGxvdyAmIG1hZ2VudGFcbiAgICBlbHNlIGlmKCBnID49IG1heCApXG4gICAgICAgIG91dC5oID0gMi4wICsgKCBiIC0gciApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIGN5YW4gJiB5ZWxsb3dcbiAgICBlbHNlXG4gICAgICAgIG91dC5oID0gNC4wICsgKCByIC0gZyApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIG1hZ2VudGEgJiBjeWFuXG5cbiAgICBvdXQuaCAqPSA2MC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlZ3JlZXNcblxuICAgIGlmKCBvdXQuaCA8IDAuMCApXG4gICAgICAgIG91dC5oICs9IDM2MC4wO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfSxcbiAgaHN2VG9SZ2I6IGZ1bmN0aW9uKGg6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIpIHtcbiAgICB2YXIgciwgZywgYjtcblxuICAgIGlmKHMgPT0gMCl7XG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcbiAgICB9ZWxzZXtcbiAgICAgICAgdmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpe1xuICAgICAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcbiAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG4gICAgICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3I6IE1hdGgucm91bmQociAqIDI1NSksIGc6IE1hdGgucm91bmQoZyAqIDI1NSksIGI6IE1hdGgucm91bmQoYiAqIDI1NSl9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnM7XG4iLCJ0eXBlIEhhbmRsZXIgPSAoLi4uYXJnczphbnlbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRzIHtcbiAgcHJpdmF0ZSBoYW5kbGVyczp7W2tleTpzdHJpbmddOkFycmF5PEhhbmRsZXI+fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gIH1cblxuICBsaXN0ZW4oZXZlbnRzOnN0cmluZ3xBcnJheTxzdHJpbmc+LCBoYW5kbGVyOkhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGV2ZW50cyA9IFtldmVudHNdO1xuICAgIH1cbiAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuaGFuZGxlcnMpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOmFueVtdKSB7XG4gICAgbGV0IGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKGhhbmRsZXJzICE9IG51bGwpIHtcbiAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi9jYW1lcmEnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZFZpZXdNb2RlbDxUPiB7XG4gIHByaXZhdGUgZ3JpZDpHcmlkPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKGdyaWQ6R3JpZDxUPikge1xuICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gIH1cblxuICBzY3JlZW5Ub0dyaWRDb29yZChjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICBsZXQgY2VsbFNpemUgPSAxO1xuICAgIGxldCBjZWxsSGVpZ2h0ID0gY2VsbFNpemU7XG4gICAgbGV0IGhhbGZDZWxsSGVpZ2h0ID0gY2VsbEhlaWdodCAvIDI7XG4gICAgbGV0IGNlbGxXaWR0aCA9IE1hdGguc3FydChjZWxsSGVpZ2h0ICogY2VsbEhlaWdodCAtIGhhbGZDZWxsSGVpZ2h0ICogaGFsZkNlbGxIZWlnaHQpO1xuXG4gICAgbGV0IHdvcmxkU3BhY2UgPSBjYW1lcmEudW50cmFuc2Zvcm0oeCwgeSk7XG4gICAgeCA9IHdvcmxkU3BhY2UueDtcbiAgICB5ID0gd29ybGRTcGFjZS55O1xuXG4gICAgbGV0IGdyaWRYID0geCAvIGNlbGxXaWR0aDtcbiAgICBsZXQgZmxvb3JHcmlkWCA9IE1hdGguZmxvb3IoZ3JpZFgpO1xuICAgIGxldCByZW1haW5kZXJYID0gZ3JpZFggLSBmbG9vckdyaWRYO1xuXG4gICAgbGV0IGdyaWRZID0geSAvIGNlbGxIZWlnaHQgKiAyICsgMSAtIGdyaWRYO1xuICAgIGxldCBmbG9vcmVkR3JpZFkgPSBNYXRoLmZsb29yKGdyaWRZIC8gMikgKiAyO1xuXG4gICAgbGV0IHJlbWFpbmRlclkgPSAoZ3JpZFkgLSBmbG9vcmVkR3JpZFkpIC8gMjtcbiAgICBncmlkWSA9IGZsb29yZWRHcmlkWTtcbiAgICBpZiAocmVtYWluZGVyWSA+IDEgLSByZW1haW5kZXJYKSB7XG4gICAgICBncmlkWSArPSAxO1xuICAgIH1cbiAgICBpZiAoZmxvb3JHcmlkWCAlIDIgIT09IDApIHtcbiAgICAgIGdyaWRZICs9IDE7XG4gICAgfVxuXG4gICAgbGV0IGJpQ29sdW1uID0gTWF0aC5mbG9vcihmbG9vckdyaWRYIC8gMik7XG4gICAgZ3JpZFkgKz0gYmlDb2x1bW4gKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGdyaWRYLFxuICAgICAgeTogZ3JpZFksXG4gICAgfTtcbiAgfVxuXG4gIGdldEdyaWRWaWV3UmVjdChjYW1lcmE6Q2FtZXJhKTp7bGVmdDpudW1iZXIsIHRvcDpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXJ9IHtcbiAgICBsZXQgdmlld3BvcnQgPSBjYW1lcmEuZ2V0Vmlld3BvcnQoKTtcbiAgICBsZXQge3dpZHRoLCBoZWlnaHR9ID0gdmlld3BvcnQ7XG4gICAgbGV0IHRvcExlZnQgPSB0aGlzLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgMCwgMCk7XG4gICAgbGV0IGJvdHRvbVJpZ2h0ID0gdGhpcy5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0b3BMZWZ0LngsIHRvcDogdG9wTGVmdC55LFxuICAgICAgcmlnaHQ6IGJvdHRvbVJpZ2h0LngsIGJvdHRvbTogYm90dG9tUmlnaHQueVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRyaWFuZ2xlKGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgdDpUfG51bGwsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBsZXQgdHJpYW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgICAgIHgxOm51bWJlciwgeTE6bnVtYmVyLCB4MjpudW1iZXIsIHkyOm51bWJlciwgeDM6bnVtYmVyLCB5MzpudW1iZXIpIHtcbiAgICAgIGxldCBwMSA9IGNhbWVyYS50cmFuc2Zvcm0oeDEsIHkxKTtcbiAgICAgIGxldCBwMiA9IGNhbWVyYS50cmFuc2Zvcm0oeDIsIHkyKTtcbiAgICAgIGxldCBwMyA9IGNhbWVyYS50cmFuc2Zvcm0oeDMsIHkzKTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHAyLngsIHAyLnkpO1xuICAgICAgY29udGV4dC5saW5lVG8ocDMueCwgcDMueSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH07XG4gICAgbGV0IGNlbGxIZWlnaHQgPSAxO1xuICAgIGxldCBoYWxmQ2VsbEhlaWdodCA9IGNlbGxIZWlnaHQgLyAyO1xuICAgIGxldCBjZWxsV2lkdGggPSBNYXRoLnNxcnQoY2VsbEhlaWdodCAqIGNlbGxIZWlnaHQgLSBoYWxmQ2VsbEhlaWdodCAqIGhhbGZDZWxsSGVpZ2h0KTtcbiAgICBsZXQgeHggPSB4O1xuICAgIGxldCB5eSA9IHkgLyAyIC0gLjU7XG4gICAgbGV0IGxlZnRUcmlhbmdsZSA9IHggJSAyICE9PSAwO1xuICAgIGlmICh5ICUgMiAhPT0gMCkge1xuICAgICAgICBsZWZ0VHJpYW5nbGUgPSAhbGVmdFRyaWFuZ2xlO1xuICAgIH1cbiAgICBpZiAobGVmdFRyaWFuZ2xlKSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAoeXkrLjUpICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICB5eSAgICAgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICh4eCsxKSAqIGNlbGxXaWR0aCwgKHl5KzEpICAqIGNlbGxIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAgeXkgICAgICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICh5eSsuNSkgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgIHh4ICogY2VsbFdpZHRoLCAgICAgKHl5KzEpICogY2VsbEhlaWdodCk7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZC5nZXQoeCwgeSk7XG4gICAgZHJhd1RyaWFuZ2xlKGNvbnRleHQsIHZhbHVlLCB4LCB5KTtcbiAgfVxuXG4gIHJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYTpDYW1lcmEsIGNlbGxzOkFycmF5PHt4Om51bWJlciwgeTpudW1iZXJ9PixcbiAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0LCB0OlQsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBmb3IgKGxldCBjb29yZCBvZiBjZWxscykge1xuICAgICAgdGhpcy5yZW5kZXJUcmlhbmdsZShjb250ZXh0LCBjYW1lcmEsIGNvb3JkLngsIGNvb3JkLnksIGRyYXdUcmlhbmdsZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQWxsQ2VsbHMoY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbWVyYTpDYW1lcmEsXG4gICAgICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdDpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgLy8gY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgdmlzaWJsZVJlY3QgPSB0aGlzLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuICAgIHRoaXMuZ3JpZC5maWx0ZXJlZE1hcChcbiAgICAgICAge3g6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QubGVmdCksIHk6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QudG9wKX0sXG4gICAgICAgIHt4OiBNYXRoLmNlaWwodmlzaWJsZVJlY3QucmlnaHQgKyAxKSwgeTogTWF0aC5jZWlsKHZpc2libGVSZWN0LmJvdHRvbSArIDEpfSxcbiAgICAgICAgKHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpKTtcbiAgICAvLyB0aGlzLmdyaWQubWFwKCh2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHtcbiAgICAvLyAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpO1xuICAgIC8vIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcblxuaW1wb3J0IGNvb3JkcyBmcm9tICcuL2Nvb3Jkcyc7XG5cblxuY29uc3QgQ09PUkRfSU5ERVg6e1trZXk6bnVtYmVyXTp7W2tleTpudW1iZXJdOiBzdHJpbmd9fSA9IHt9O1xuXG5cbmNvbnN0IENIVU5LX1NJWkUgPSA2NDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZDxUPiB7XG4gIHByaXZhdGUgY291bnQ6bnVtYmVyO1xuICBwcml2YXRlIGdyaWQ6e1trZXk6c3RyaW5nXToge2Nvb3JkOiB7eDpudW1iZXIsIHk6bnVtYmVyfSwgdmFsdWU6IFR9fTtcbiAgcHJpdmF0ZSBjaHVua3M6e1trZXk6c3RyaW5nXToge1xuICAgIGNvb3JkOnt4Om51bWJlciwgeTpudW1iZXJ9LFxuICAgIGNvdW50Om51bWJlcixcbiAgICBkYXRhOntba2V5OnN0cmluZ106IHtjb29yZDoge3g6bnVtYmVyLCB5Om51bWJlcn0sIHZhbHVlOiBUfX19fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmdyaWQgPSB7fTtcbiAgICB0aGlzLmNodW5rcyA9IHt9O1xuICB9XG5cbiAgZ2V0Q291bnQoKSB7IHJldHVybiB0aGlzLmNvdW50OyB9XG5cbiAgcHJpdmF0ZSBnZXRLZXkoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgeCA9IHh8MDtcbiAgICB5ID0geXwwO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbeCwgeV0pO1xuICAgIC8vIGxldCBhID0gQ09PUkRfSU5ERVhbeF07XG4gICAgLy8gaWYgKGEgIT0gbnVsbCkge1xuICAgIC8vICAgbGV0IGIgPSBhW3ldO1xuICAgIC8vICAgaWYgKGIgIT0gbnVsbCkge1xuICAgIC8vICAgICByZXR1cm4gYjtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgLy8gbGV0IHJlc3VsdCA9IHggKyAnLycgKyB5Oy8vW3gsIHldLmpvaW4oJy8nKTtcbiAgICAvLyBpZiAoISh4IGluIENPT1JEX0lOREVYKSkge1xuICAgIC8vICAgQ09PUkRfSU5ERVhbeF0gPSB7fTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIENPT1JEX0lOREVYW3hdW3ldID0gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaHVua0Nvb3JkKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7eDogTWF0aC5mbG9vcih4IC8gQ0hVTktfU0laRSksXG4gICAgICAgICAgICB5OiBNYXRoLmZsb29yKHkgLyBDSFVOS19TSVpFKX1cbiAgfVxuXG4gIGdldCh4Om51bWJlciwgeTpudW1iZXIpOlR8bnVsbCB7XG4gICAgbGV0IGNodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQoeCwgeSk7XG4gICAgbGV0IGNodW5rS2V5ID0gdGhpcy5nZXRLZXkoY2h1bmtDb29yZC54LCBjaHVua0Nvb3JkLnkpO1xuICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICBpZiAoY2h1bmsgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgbGV0IGNlbGwgPSBjaHVuay5kYXRhW3RoaXMuZ2V0S2V5KHgsIHkpXTtcbiAgICByZXR1cm4gY2VsbCAmJiBjZWxsLnZhbHVlO1xuICAgIC8vIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZFt0aGlzLmdldEtleSh4LCB5KV07XG4gICAgLy8gcmV0dXJuIHZhbHVlICYmIHZhbHVlLnZhbHVlO1xuICB9XG5cbiAgc2V0KHZhbHVlOlR8bnVsbCwgeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgLy8gbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIC8vIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgLy8gICBpZiAoa2V5IGluIHRoaXMuZ3JpZCkge1xuICAgIC8vICAgICBkZWxldGUgdGhpcy5ncmlkW2tleV07XG4gICAgLy8gICB9XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMuZ3JpZFtrZXldID0ge2Nvb3JkOnt4LCB5fSwgdmFsdWU6IHZhbHVlfTtcbiAgICAvLyB9XG4gICAgbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIGxldCBjaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKHgsIHkpO1xuICAgIGxldCBjaHVua0tleSA9IHRoaXMuZ2V0S2V5KGNodW5rQ29vcmQueCwgY2h1bmtDb29yZC55KTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgaWYgKCEoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpKSB7XG4gICAgICAgIHRoaXMuY2h1bmtzW2NodW5rS2V5XSA9IHtjb29yZDogY2h1bmtDb29yZCwgY291bnQ6IDAsIGRhdGE6IHt9fTtcbiAgICAgIH1cbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGlmICghKGtleSBpbiBjaHVuay5kYXRhKSkge1xuICAgICAgICBjaHVuay5jb3VudCsrO1xuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICB9XG4gICAgICBjaHVuay5kYXRhW2tleV0gPSB7Y29vcmQ6e3gsIHl9LCB2YWx1ZTogdmFsdWV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICBpZiAoa2V5IGluIGNodW5rLmRhdGEpIHtcbiAgICAgICAgICBjaHVuay5jb3VudC0tO1xuICAgICAgICAgIHRoaXMuY291bnQtLTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2h1bmsuY291bnQgPiAwKSB7XG4gICAgICAgICAgZGVsZXRlIGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAvLyBpZiAodmFsdWUgPT0gbnVsbClcbiAgfVxuXG4gIG1hcChmOih2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyZWRNYXAobWluOnt4Om51bWJlciwgeTpudW1iZXJ9LCBtYXg6e3g6bnVtYmVyLCB5Om51bWJlcn0sXG4gICAgICAgICAgICAgIGY6KHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4gdm9pZCkge1xuICAgIC8vIFRPRE86IEluZGV4IHRoZSBncmlkIG9yIHNvbWV0aGluZy4gSXQncyBwcmV0dHkgaW5lZmZpY2llbnQuXG4gICAgbGV0IHN0YXJ0Q2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZChtaW4ueCwgbWluLnkpO1xuICAgIGxldCBlbmRDaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKG1heC54LCBtYXgueSk7XG4gICAgZW5kQ2h1bmtDb29yZC54Kys7XG4gICAgZW5kQ2h1bmtDb29yZC55Kys7XG4gICAgZm9yIChsZXQgY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGxldCBjaHVua0Nvb3JkID0gY2h1bmsuY29vcmQ7XG4gICAgICBpZiAoc3RhcnRDaHVua0Nvb3JkLnggPD0gY2h1bmtDb29yZC54ICYmIGNodW5rQ29vcmQueCA8PSBlbmRDaHVua0Nvb3JkLnggJiZcbiAgICAgICAgICBzdGFydENodW5rQ29vcmQueSA8PSBjaHVua0Nvb3JkLnkgJiYgY2h1bmtDb29yZC55IDw9IGVuZENodW5rQ29vcmQueSkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY2h1bmsuZGF0YSkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAgICAgICBpZiAobWluLnggPD0gY29vcmQueCAmJiBjb29yZC54IDwgbWF4LnggJiZcbiAgICAgICAgICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAgICAgICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgLy8gICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAvLyAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgIC8vICAgaWYgKG1pbi54IDw9IGNvb3JkLnggJiYgY29vcmQueCA8IG1heC54ICYmXG4gICAgLy8gICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAvLyAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH1cblxuICBnZXREaXJlY3ROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbZGMoMCwgLTEpLCBkYygwLCAxKV07XG4gICAgaWYgKE1hdGguYWJzKHggJSAyKSA9PT0gTWF0aC5hYnMoeSAlIDIpKSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAwKSk7XG4gICAgfVxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBnZXROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbXG4gICAgICBkYygtMSwgMCksIGRjKC0xLCAtMSksIGRjKDAsIC0xKSxcbiAgICAgIGRjKDEsIC0xKSwgZGMoMSwgMCksIGRjKDEsIDEpLFxuICAgICAgZGMoMCwgMSksIGRjKC0xLCAxKSxcbiAgICAgIGRjKDAsIC0yKSwgZGMoMCwgMilcbiAgICBdO1xuICAgIGlmIChNYXRoLmFicyh4ICUgMikgPT09IE1hdGguYWJzKHkgJSAyKSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIC0yKSk7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAtMikpO1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgMikpO1xuICAgIH1cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcbmltcG9ydCBDb2xvclNlbGVjdENvbXBvbmVudCBmcm9tICcuL2NvbG9yLXNlbGVjdCc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEdyaWRWaWV3TW9kZWwgZnJvbSAnLi9ncmlkLXZpZXctbW9kZWwnO1xuaW1wb3J0IEtleUludGVyYWN0aXZpdHkgZnJvbSAnLi9rZXktaW50ZXJhY3Rpdml0eSc7XG5pbXBvcnQgTW91c2VJbnRlcmFjdGl2aXR5IGZyb20gJy4vbW91c2UtaW50ZXJhY3Rpdml0eSc7XG5cbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkJztcbmltcG9ydCB7IFRvb2xzQ29sbGVjdGlvbiB9IGZyb20gJy4vdG9vbHMnO1xuXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuXG5jbGFzcyBQYXJhbXMge1xuICBwcml2YXRlIHN0YXRpYyBwYXJhbXM6e1trZXk6c3RyaW5nXTogc3RyaW5nfSA9ICgoKSA9PiB7XG4gICAgbGV0IHJhd1BhcmFtcyA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKS5zbGljZSgxKS5qb2luKCc/Jykuc3BsaXQoJyMnKVswXS5zcGxpdCgnJicpO1xuICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICBmb3IgKGxldCBwYXJhbSBvZiByYXdQYXJhbXMpIHtcbiAgICAgIGxldCBzcGxpdCA9IHBhcmFtLnNwbGl0KCc9Jyk7XG4gICAgICBsZXQga2V5ID0gc3BsaXRbMF07XG4gICAgICBsZXQgdmFsdWUgPSBzcGxpdC5zbGljZSgxKS5qb2luKCc9Jyk7XG4gICAgICBwYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcGFyYW1zO1xuICB9KSgpO1xuXG4gIHN0YXRpYyBudW1iZXIoa2V5OnN0cmluZywgZGVmYXVsdFZhbHVlOm51bWJlcik6bnVtYmVyIHtcbiAgICBsZXQgdmFsdWUgPSBOdW1iZXIodGhpcy5wYXJhbXNba2V5XSk7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgaXNOYU4odmFsdWUpIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgc3RyaW5nKGtleTpzdHJpbmcsIGRlZmF1bHRWYWx1ZTpzdHJpbmcpOnN0cmluZyB7XG4gICAgbGV0IHZhbHVlOnN0cmluZ3xudWxsID0gdGhpcy5wYXJhbXNba2V5XTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5cbmxldCB3ZWlnaHRlZFJhbmRvbSA9IGZ1bmN0aW9uPFQ+KGxpc3Q6QXJyYXk8VD4sIHdlaWdodEZuOihUKSA9PiBudW1iZXIpIHtcbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB0aHJvdyAnZXJyb3InO1xuICBsZXQgdG90YWxXZWlnaHQ6bnVtYmVyID0gMDtcbiAgbGV0IHdlaWdodHM6bnVtYmVyW10gPSBbXTtcbiAgZm9yIChsZXQgaXRlbSBvZiBsaXN0KSB7XG4gICAgbGV0IHdlaWdodCA9IE1hdGguYWJzKHdlaWdodEZuKGl0ZW0pKTtcbiAgICB0b3RhbFdlaWdodCArPSB3ZWlnaHQ7XG4gICAgd2VpZ2h0cy5wdXNoKHdlaWdodCk7XG4gIH1cbiAgbGV0IG4gPSBNYXRoLnJhbmRvbSgpICogdG90YWxXZWlnaHQ7XG4gIGxldCBjdW11bGF0aXZlU3VtID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB3ZWlnaHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY3VtdWxhdGl2ZVN1bSArPSB3ZWlnaHRzW2ldO1xuICAgIGlmIChuIDw9IGN1bXVsYXRpdmVTdW0pIHtcbiAgICAgIHJldHVybiBsaXN0W2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xufTtcblxuXG5sZXQgc2V0U3RhdHVzID0gZnVuY3Rpb24oc3RhdHVzKSB7XG4gIGxldCBzdGF0dXNEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdHVzJyk7XG4gIGlmIChzdGF0dXNEaXYgIT0gbnVsbCkge1xuICAgIHN0YXR1c0Rpdi50ZXh0Q29udGVudCA9IHN0YXR1cztcbiAgfVxufTtcblxuXG5sZXQgbG9vcCA9IGZ1bmN0aW9uKGYsIGR0KSB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoZHQpID0+IGxvb3AoZiwgZHQpKTtcbiAgZihkdCk7XG59O1xuXG5cbnR5cGUgQ2VsbFR5cGUgPSBzdHJpbmc7XG5cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG5cbmxldCBjYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xubGV0IGNhbnZhc1dpZHRoOm51bWJlciA9IGNhbnZhcy53aWR0aDtcbmxldCBjYW52YXNIZWlnaHQ6bnVtYmVyID0gY2FudmFzLmhlaWdodDtcblxuXG4vLyogQWRkL3JlbW92ZSBhICcvJyB0by9mcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhpcyBsaW5lIHRvIHN3aXRjaCBtb2Rlc1xuXG5sZXQgY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5sZXQgY2FtZXJhID0gbmV3IENhbWVyYShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbmNhbWVyYS5zZXRab29tKFBhcmFtcy5udW1iZXIoJ3pvb20nLCAxLzk2KSk7XG5cblxudHlwZSBIU0xDZWxsID0ge2g6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIsIGNvbG9yPzpzdHJpbmd9O1xubGV0IGdyaWQ6R3JpZDxIU0xDZWxsPiA9IG5ldyBHcmlkPEhTTENlbGw+KCk7XG5sZXQgcmVuZGVyZXI6R3JpZFZpZXdNb2RlbDxIU0xDZWxsPiA9IG5ldyBHcmlkVmlld01vZGVsPEhTTENlbGw+KGdyaWQpO1xuXG5cbmxldCBkaXJ0eUNhbnZhcyA9IGZhbHNlO1xuXG5cbmxldCByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgZGlydHlDYW52YXMgPSB0cnVlO1xufTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgcmVzaXplKTtcbnJlc2l6ZSgpO1xuXG5sZXQgZ2V0SHNsQ2VsbENvbG9yID0gZnVuY3Rpb24oY2VsbDpIU0xDZWxsKTpzdHJpbmcge1xuICBsZXQgY29sb3IgPSBjZWxsLmNvbG9yO1xuICBpZiAoY29sb3IgPT0gbnVsbCkge1xuICAgIGxldCByZ2IgPSBjb2xvcnMuaHN2VG9SZ2IoY2VsbC5oLCBjZWxsLnMsIGNlbGwubCk7XG4gICAgY29sb3IgPSBjb2xvcnMucmdiVG9IZXgocmdiLnIsIHJnYi5nLCByZ2IuYik7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufTtcblxuLy8gZ3JpZC5zZXQoe2g6IDAsIHM6IDEsIGw6IDF9LCAwLCAwKTtcblxubGV0IG1vZCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtOm51bWJlcik6bnVtYmVyIHtcbiAgbGV0IG1vZGRlZCA9IG4gJSBtO1xuICBpZiAobiA8IDApIG4gKz0gbTtcbiAgcmV0dXJuIG47XG59O1xubGV0IGNsYW1wID0gZnVuY3Rpb24objpudW1iZXIsIG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlciB7XG4gIGlmIChuIDwgbWluKSByZXR1cm4gbWluO1xuICBpZiAobiA+IG1heCkgcmV0dXJuIG1heDtcbiAgcmV0dXJuIG47XG59O1xuXG5cblxuXG5sZXQgYWN0aXZlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFt7eDogMCwgeTogMH1dO1xubGV0IGVkZ2VDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW11cblxuY29uc3QgSU5JVElBTF9MVU0gPSAxO1xuY29uc3QgTUFYX0xVTSA9IDAuNDtcbmNvbnN0IE1JTl9MVU0gPSBQYXJhbXMubnVtYmVyKCdtaW5sdW0nLCAwLjc1KTtcbmNvbnN0IExVTV9ERUxUQSA9IFBhcmFtcy5udW1iZXIoJ2x1bWRlbHRhJywgLTAuMDMpOy0wLjAwMDA1OzAuMDAwNTtcbmxldCBSRVBSX1BST0JBQklMSVRZID0gUGFyYW1zLm51bWJlcigncmVwcicsIDAuMDA1KTswLjE7MC4yMDswLjAwMjQ7XG5jb25zdCBIVUVfQ0hBTkdFID0gTWF0aC5hYnMoUGFyYW1zLm51bWJlcignaHVlY2hhbmdlJywgMC4wMikpO1xuY29uc3QgU0FUX0NIQU5HRSA9IE1hdGguYWJzKFBhcmFtcy5udW1iZXIoJ3NhdGNoYW5nZScsIDAuMDUpKTtcbmNvbnN0IE1JTl9TQVQgPSBQYXJhbXMubnVtYmVyKCdtaW5zYXQnLCAwLjcpO1xuY29uc3QgTUFYX1NBVCA9IFBhcmFtcy5udW1iZXIoJ21heHNhdCcsIDEpO1xuY29uc3QgTUlOX1pPT00gPSBQYXJhbXMubnVtYmVyKCdtaW56b29tJywgMS8zKTtcblxubGV0IGdldE5laWdoYm9ycyA9IGZ1bmN0aW9uKGdyaWQsIHgsIHksIHZpZXdSZWN0KSB7XG4gIGxldCBuZWlnaGJvcnMgPSBncmlkLmdldERpcmVjdE5laWdoYm9ycyh4LCB5KTtcbiAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gZ3JpZC5nZXQodmFsdWUueCwgdmFsdWUueSkgPT0gbnVsbCk7XG4gIGlmICh2aWV3UmVjdCAhPSBudWxsKSB7XG4gICAgbmVpZ2hib3JzID0gbmVpZ2hib3JzLmZpbHRlcihcbiAgICAgICh2YWx1ZTp7eDpudW1iZXIsIHk6bnVtYmVyfSkgPT4gKFxuICAgICAgICAgIHZpZXdSZWN0LmxlZnQgPD0gdmFsdWUueCAmJiB2YWx1ZS54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gICAgICAgICAgdmlld1JlY3QudG9wIDw9IHZhbHVlLnkgJiYgdmFsdWUueSA8PSB2aWV3UmVjdC5ib3R0b20pKTtcbiAgfVxuICByZXR1cm4gbmVpZ2hib3JzO1xufTtcblxuXG5sZXQga2V5SW50ZXJhY3Rpdml0eSA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5cblxubGV0IGludGVyYWN0aXZpdHkgPSBuZXcgTW91c2VJbnRlcmFjdGl2aXR5KGNhbnZhcyk7XG5sZXQgZHJhZ1Bvc2l0aW9uOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xubGV0IGxhc3REcmFnUG9zaXRpb246bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG5cbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignZHJhZy1zdGFydCcsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGlmIChwb3NpdGlvbi54ID09IG51bGwgfHwgcG9zaXRpb24ueSA9PSBudWxsKSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vICAgfSBlbHNlIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSB7eDogcG9zaXRpb24ueCwgeTogcG9zaXRpb24ueX07XG4vLyAgIH1cbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdkcmFnLW1vdmUnLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBpZiAocG9zaXRpb24ueCA9PSBudWxsIHx8IHBvc2l0aW9uLnkgPT0gbnVsbCkge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0ge3g6IHBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnl9O1xuLy8gICB9XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbihbJ2RyYWctZW5kJywgJ2NsaWNrJ10sIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2NsaWNrJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgY29uc29sZS5sb2coZ2V0TmVpZ2hib3JzKGdyaWQsIGhvdmVyZWQueCwgaG92ZXJlZC55LCBudWxsKSk7XG4vLyB9KTtcblxuLy8gbGV0IGhvdmVyZWQgPSB7eDogMCwgeTogMH07XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2hvdmVyJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgbGV0IGdyaWRDb29yZCA9IHJlbmRlcmVyLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSk7XG4vLyAgIGhvdmVyZWQueCA9IE1hdGguZmxvb3IoZ3JpZENvb3JkLngpO1xuLy8gICBob3ZlcmVkLnkgPSBNYXRoLmZsb29yKGdyaWRDb29yZC55KTtcbi8vIH0pO1xuXG5cbmxldCB1cGRhdGVBY3RpdmVDZWxscyA9IGZ1bmN0aW9uKGR0LCB2aWV3UmVjdCk6dm9pZCB7XG4gIGxldCBuZXdBY3RpdmVDZWxsczp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIGZvciAobGV0IGFjdGl2ZUNlbGwgb2YgYWN0aXZlQ2VsbHMpIHtcbiAgICBsZXQga2VlcCA9IHRydWU7XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGxldCBleGlzdGVkID0gZXhpc3RpbmcgIT0gbnVsbDtcbiAgICBpZiAoZXhpc3RpbmcgPT0gbnVsbCkge1xuICAgICAgZXhpc3RpbmcgPSB7aDogTWF0aC5yYW5kb20oKSwgczogTWF0aC5yYW5kb20oKSAqIChNQVhfU0FUIC0gTUlOX1NBVCkgKyBNSU5fU0FULCBsOiBJTklUSUFMX0xVTX07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdMID0gZXhpc3RpbmcubCArPSBMVU1fREVMVEEgKiAoZHQgLyAxMDAwKTtcbiAgICAgIGlmIChMVU1fREVMVEEgPiAwICYmIG5ld0wgPj0gTUFYX0xVTSkge1xuICAgICAgICBuZXdMID0gTUFYX0xVTTtcbiAgICAgIH1cbiAgICAgIGlmIChMVU1fREVMVEEgPCAwICYmIG5ld0wgPD0gTUlOX0xVTSkge1xuICAgICAgICBuZXdMID0gTUlOX0xVTTtcbiAgICAgIH1cbiAgICAgIGV4aXN0aW5nLmwgPSBuZXdMO1xuICAgIH1cbiAgICBpZiAoIWV4aXN0ZWQpIHtcbiAgICAgIGdyaWQuc2V0KGV4aXN0aW5nLCBhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSk7XG4gICAgfVxuICAgIGlmIChrZWVwKSB7XG4gICAgICBsZXQgcG9zaXRpdmVfZGVsdGEgPSBMVU1fREVMVEEgPiAwO1xuICAgICAgaWYgKChwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sID49IE1BWF9MVU0pIHx8XG4gICAgICAgICAgKCFwb3NpdGl2ZV9kZWx0YSAmJiBleGlzdGluZy5sIDw9IE1JTl9MVU0pKSB7XG4gICAgICAgIGV4aXN0aW5nLmNvbG9yID0gZ2V0SHNsQ2VsbENvbG9yKGV4aXN0aW5nKTtcbiAgICAgICAgZWRnZUNlbGxzLnB1c2goYWN0aXZlQ2VsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBY3RpdmVDZWxscy5wdXNoKGFjdGl2ZUNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhY3RpdmVDZWxscyA9IG5ld0FjdGl2ZUNlbGxzO1xufTtcblxubGV0IHJlcHJvZHVjZUNlbGxzID0gZnVuY3Rpb24oZHQsIHZpZXdSZWN0KTpib29sZWFuIHtcbiAgbGV0IHJldHVyblRydWUgPSBmYWxzZTtcbiAgd2hpbGUgKChhY3RpdmVDZWxscy5sZW5ndGggPiAwIHx8IGVkZ2VDZWxscy5sZW5ndGggPiAwKSAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkpIHtcbiAgICAvLyBsZXQgYWN0aXZlQ2VsbCA9IHdlaWdodGVkUmFuZG9tKGFjdGl2ZUNlbGxzLmNvbmNhdChlZGdlQ2VsbHMpLCAoY2VsbCkgPT4ge1xuICAgIC8vICAgbGV0IG5laWdoYm9ycyA9IGdyaWQuZ2V0TmVpZ2hib3JzKGNlbGwueCwgY2VsbC55KVxuICAgIC8vICAgICAgIC5maWx0ZXIoKG4pID0+IGdyaWQuZ2V0KG4ueCwgbi55KSA9PSBudWxsKTtcbiAgICAvLyAgIHJldHVybiBuZWlnaGJvcnMubGVuZ3RoO1xuICAgIC8vIH0pO1xuICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhY3RpdmVDZWxscy5sZW5ndGggKyBlZGdlQ2VsbHMubGVuZ3RoKSk7XG4gICAgbGV0IGFjdGl2ZUNlbGwgPSBpbmRleCA8IGFjdGl2ZUNlbGxzLmxlbmd0aCA/IGFjdGl2ZUNlbGxzW2luZGV4XSA6IGVkZ2VDZWxsc1tpbmRleCAtIGFjdGl2ZUNlbGxzLmxlbmd0aF07XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBsZXQgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCB2aWV3UmVjdCk7XG4gICAgICBsZXQgbmV3TmVpZ2hib3I6bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gbGV0IGZpbHRlcmVkTmVpZ2hib3JzOntuZWlnaGJvcjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9LCB3ZWlnaHQ6bnVtYmVyfVtdID0gbmVpZ2hib3JzLm1hcCgobmVpZ2hib3IpID0+IHtcbiAgICAgICAgLy8gICBsZXQgbmVpZ2hib3JOZWlnaGJvcnMgPSBncmlkLmdldE5laWdoYm9ycyhuZWlnaGJvci54LCBuZWlnaGJvci55KVxuICAgICAgICAvLyAgICAgICAuZmlsdGVyKChuKSA9PiBncmlkLmdldChuLngsIG4ueSkgPT0gbnVsbCk7XG4gICAgICAgIC8vICAgcmV0dXJuIHtcbiAgICAgICAgLy8gICAgIG5laWdoYm9yOiBuZWlnaGJvcixcbiAgICAgICAgLy8gICAgIHdlaWdodDogbmVpZ2hib3JOZWlnaGJvcnMubGVuZ3RoXG4gICAgICAgIC8vICAgfTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGZpbHRlcmVkTmVpZ2hib3JzLnB1c2goe25laWdoYm9yOiBudWxsLCB3ZWlnaHQ6IDEwfSk7XG4gICAgICAgIC8vIGxldCBuID0gd2VpZ2h0ZWRSYW5kb20oZmlsdGVyZWROZWlnaGJvcnMsIChuKSA9PiBNYXRoLnBvdyhuLndlaWdodCwgOCkpLm5laWdoYm9yO1xuICAgICAgICAvLyBpZiAobiA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBsZXQgbiA9IG5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKV07XG4gICAgICAgIGxldCBkZWx0YUh1ZSA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogSFVFX0NIQU5HRTtcbiAgICAgICAgbGV0IGRlbHRhU2F0ID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBTQVRfQ0hBTkdFO1xuICAgICAgICBncmlkLnNldCh7XG4gICAgICAgICAgaDogbW9kKGV4aXN0aW5nLmggKyBkZWx0YUh1ZSwgMSksXG4gICAgICAgICAgczogY2xhbXAoZXhpc3RpbmcucyArIGRlbHRhU2F0LCBNSU5fU0FULCBNQVhfU0FUKSxcbiAgICAgICAgICBsOiBJTklUSUFMX0xVTVxuICAgICAgICB9LCBuLngsIG4ueSk7XG4gICAgICAgIG5ld05laWdoYm9yID0gbjtcbiAgICAgIH1cbiAgICAgIGxldCBuZWlnaGJvckNvbXBlbnNhdGlvbiA9IG5ld05laWdoYm9yID09IG51bGwgPyAwIDogMTtcbiAgICAgIGxldCBmZXJ0aWxlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCBudWxsKTtcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoIC0gbmVpZ2hib3JDb21wZW5zYXRpb24gIT09IGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblRydWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxldCBlZGdlSW5kZXggPSBlZGdlQ2VsbHMuaW5kZXhPZihhY3RpdmVDZWxsKTtcbiAgICAgICAgaWYgKGVkZ2VJbmRleCA+PSAwKSB7XG4gICAgICAgIC8vIGlmIChpbmRleCA+PSBhY3RpdmVDZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBlZGdlQ2VsbHMuc3BsaWNlKGluZGV4IC0gYWN0aXZlQ2VsbHMubGVuZ3RoLCAxKTtcbiAgICAgICAgICBlZGdlQ2VsbHMuc3BsaWNlKGVkZ2VJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdOZWlnaGJvciAhPSBudWxsKSB7XG4gICAgICAgIGFjdGl2ZUNlbGxzLnB1c2gobmV3TmVpZ2hib3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuVHJ1ZTtcbn1cblxuXG5cbi8vIGxldCB2aWV3UmVjdCA9IHJlbmRlcmVyLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuLy8gdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuLy8gdmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbi8vIHZpZXdSZWN0LnJpZ2h0ID0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KSArIDE7XG4vLyB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4vLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xuLy8gdXBkYXRlQWN0aXZlQ2VsbHMoMTAwLCB2aWV3UmVjdClcbi8vIH1cblxubGV0IGxhc3RGcmFtZTpudW1iZXJ8bnVsbCA9IG51bGw7XG5sZXQgbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbmxvb3AoKGR0Om51bWJlcikgPT4ge1xuICBsZXQgdGhpc0ZyYW1lID0gZHQ7XG4gIGlmIChsYXN0RnJhbWUgIT0gbnVsbCkge1xuICAgIGR0ID0gdGhpc0ZyYW1lIC0gbGFzdEZyYW1lO1xuICB9XG4gIGxhc3RGcmFtZSA9IHRoaXNGcmFtZTtcblxuICBpZiAoUkVQUl9QUk9CQUJJTElUWSA8IDAuOTUpIHtcbiAgICBSRVBSX1BST0JBQklMSVRZICs9IGR0IC8gMzAwMDAwO1xuICB9XG4gIGlmIChSRVBSX1BST0JBQklMSVRZID4gMC45NSkge1xuICAgIFJFUFJfUFJPQkFCSUxJVFkgPSAwLjk1O1xuICB9XG5cbiAgbGV0IGNhbWVyYUFsdGVyZWQgPSBmYWxzZTtcbiAgaWYgKGRyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgaWYgKGxhc3REcmFnUG9zaXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKGRyYWdQb3NpdGlvbi54ICE9PSBsYXN0RHJhZ1Bvc2l0aW9uLnggfHxcbiAgICAgICAgICBkcmFnUG9zaXRpb24ueSAhPT0gbGFzdERyYWdQb3NpdGlvbi55KSB7XG4gICAgICAgIGxldCBzdGFydCA9IGNhbWVyYS51bnRyYW5zZm9ybShsYXN0RHJhZ1Bvc2l0aW9uLngsIGxhc3REcmFnUG9zaXRpb24ueSk7XG4gICAgICAgIGxldCBlbmQgPSBjYW1lcmEudW50cmFuc2Zvcm0oZHJhZ1Bvc2l0aW9uLngsIGRyYWdQb3NpdGlvbi55KTtcbiAgICAgICAgY2FtZXJhLm1vdmUoc3RhcnQueCAtIGVuZC54LCBzdGFydC55IC0gZW5kLnkpO1xuICAgICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdERyYWdQb3NpdGlvbiA9IHt4OiBkcmFnUG9zaXRpb24ueCwgeTogZHJhZ1Bvc2l0aW9uLnl9O1xuICB9IGVsc2UgaWYgKGxhc3REcmFnUG9zaXRpb24gIT0gbnVsbCkge1xuICAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuICB9XG4gIGlmIChrZXlJbnRlcmFjdGl2aXR5LmlzRG93bigxODkpKSB7IC8vIG1pbnVzXG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAqIDEuMSk7XG4gICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gIH1cbiAgaWYgKGtleUludGVyYWN0aXZpdHkuaXNEb3duKDE4NykpIHsgLy8gcGx1c1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgLyAxLjEpO1xuICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgbGV0IHZpZXdSZWN0ID0gcmVuZGVyZXIuZ2V0R3JpZFZpZXdSZWN0KGNhbWVyYSk7XG4gIHZpZXdSZWN0LmxlZnQgPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpIC0gMTtcbiAgdmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbiAgdmlld1JlY3QucmlnaHQgPSBNYXRoLmNlaWwodmlld1JlY3QucmlnaHQpICsgMTtcbiAgdmlld1JlY3QuYm90dG9tID0gTWF0aC5jZWlsKHZpZXdSZWN0LmJvdHRvbSkgKyAxO1xuICAvL2ZvciAobGV0IGkgPSAwOyBpIDwgNTAwOyBpKyspIHtcbiAgdXBkYXRlQWN0aXZlQ2VsbHMoZHQsIHZpZXdSZWN0KTtcbiAgLy8gfVxuICBpZiAoZ3JpZC5nZXRDb3VudCgpIC8gKCh2aWV3UmVjdC5ib3R0b20gLSB2aWV3UmVjdC50b3ApICogKHZpZXdSZWN0LnJpZ2h0IC0gdmlld1JlY3QubGVmdCkpID4gMS4wMDEpIHtcbiAgICBsZXQgY3VycmVudFpvb20gPSBjYW1lcmEuZ2V0Wm9vbSgpO1xuICAgIGlmIChjdXJyZW50Wm9vbSA8IE1JTl9aT09NKSB7XG4gICAgICBjYW1lcmEuc2V0Wm9vbShjdXJyZW50Wm9vbSAqIDIpO1xuICAgICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgKGFjdGl2ZUNlbGxzLmxlbmd0aCA9PT0gMCAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkgLyAyKSB7XG4gIC8vICAgbGV0IGV4aXN0aW5nOntba2V5OnN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIC8vICAgZ3JpZC5maWx0ZXJlZE1hcCh7eDogdmlld1JlY3QubGVmdCwgeTogdmlld1JlY3QudG9wfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgIHt4OiB2aWV3UmVjdC5yaWdodCwgeTogdmlld1JlY3QuYm90dG9tfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgICh2YWx1ZSwgeCwgeSkgPT4gKGV4aXN0aW5nW3ggKyAnLycgKyB5XSA9IHRydWUpKTtcbiAgLy8gICBsZXQgbm9uRXhpc3Rpbmc6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IHggPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpOyB4IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCk7IHgrKykge1xuICAvLyAgICAgZm9yIChsZXQgeSA9IE1hdGguZmxvb3Iodmlld1JlY3QudG9wKTsgeSA8PSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKTsgeSsrKSB7XG4gIC8vICAgICAgIGlmICghZXhpc3RpbmdbeCArICcvJyArIHldKSB7XG4gIC8vICAgICAgICAgbm9uRXhpc3RpbmcucHVzaCh7eDogeCwgeTogeX0pO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGFjdGl2ZUNlbGxzLnB1c2gobm9uRXhpc3RpbmdbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm9uRXhpc3RpbmcubGVuZ3RoKV0pO1xuICAvLyB9XG5cbiAgbGV0IG1haW5UcmlhbmdsZVJlbmRlcmVyID0gKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdldEhzbENlbGxDb2xvcihjZWxsKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAvLyBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICAvLyBjb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgLy8gY29udGV4dC5zdHJva2UoKTtcbiAgfTtcblxuICBpZiAoY2FtZXJhQWx0ZXJlZCB8fCBkaXJ0eUNhbnZhcykge1xuICAgIGRpcnR5Q2FudmFzID0gZmFsc2U7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBhY3RpdmVDZWxscywgbWFpblRyaWFuZ2xlUmVuZGVyZXIpO1xuICAgIHJlbmRlcmVyLnJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYSwgZWRnZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH1cbiAgcmVwcm9kdWNlQ2VsbHMoZHQsIHZpZXdSZWN0KTtcblxuXG5cbiAgLy8gcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBbaG92ZXJlZF0sIChjb250ZXh0LCBjZWxsLCB4LCB5KSA9PiB7XG4gIC8vICAgY29udGV4dC5saW5lSm9pbiA9ICdyb3VuZCc7XG4gIC8vICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICcjZmZmJztcbiAgLy8gICBjb250ZXh0LmxpbmVXaWR0aCA9IDM7XG4gIC8vICAgY29udGV4dC5zdHJva2UoKTtcbiAgLy8gICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyMwMDAnO1xuICAvLyAgIGNvbnRleHQubGluZVdpZHRoID0gMTtcbiAgLy8gICBjb250ZXh0LnN0cm9rZSgpO1xuICAvLyB9KTtcblxuICAvLyBsZXQgbm93VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAvLyBsZXQgdGltZVBhc3NlZCA9IG5vd1RpbWUgLSBsYXN0VGltZTtcbiAgLy8gbGFzdFRpbWUgPSBub3dUaW1lO1xuICAvLyBjb250ZXh0LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAvLyBjb250ZXh0LmZvbnQgPSAnMTRweCBBcmlhbCc7XG4gIC8vIGNvbnRleHQuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgLy8gY29udGV4dC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gIC8vIGNvbnRleHQubGluZVdpZHRoID0gMjtcbiAgLy8gbGV0IG9uU2NyZWVuRWRnZSA9IDA7XG4gIC8vIGZvciAobGV0IGVkZ2VDZWxsIG9mIGVkZ2VDZWxscykge1xuICAvLyAgIGlmICh2aWV3UmVjdC5sZWZ0IDw9IGVkZ2VDZWxsLnggJiYgZWRnZUNlbGwueCA8PSB2aWV3UmVjdC5yaWdodCAmJlxuICAvLyAgICAgICB2aWV3UmVjdC50b3AgPD0gZWRnZUNlbGwueSAmJiBlZGdlQ2VsbC55IDw9IHZpZXdSZWN0LmJvdHRvbSkge1xuICAvLyAgICAgb25TY3JlZW5FZGdlKys7XG4gIC8vICAgfVxuICAvLyB9XG4gIC8vIGxldCBmcHNUZXh0ID0gJ0ZQUzogJyArIE1hdGgucm91bmQoMTAwMCAvIHRpbWVQYXNzZWQpIC8vKyAnICBBY3RpdmU6ICcgKyBhY3RpdmVDZWxscy5sZW5ndGggKyAnICBFZGdlOiAnICsgZWRnZUNlbGxzLmxlbmd0aCArICcgIG9uc2NyZWVuICcgKyBvblNjcmVlbkVkZ2U7XG4gIC8vIGNvbnRleHQuc3Ryb2tlVGV4dChmcHNUZXh0LCAxMCwgMTApO1xuICAvLyBjb250ZXh0LmZpbGxUZXh0KGZwc1RleHQsIDEwLCAxMCk7XG59LCAwKTtcblxuXG5yZXR1cm47XG4vKi9cblxuXG5cblxubGV0IHRvb2xTZWxlY3QgPSA8SFRNTFNlbGVjdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2wtc2VsZWN0Jyk7XG5sZXQgdG9vbFNlbGVjdGlvbiA9ICdkcmF3JztcbmxldCBzZXRUb29sID0gZnVuY3Rpb24obmV3VG9vbDpzdHJpbmcpIHtcbiAgLy8gdG9vbFNlbGVjdGlvbiA9IG5ld1Rvb2w7XG4gIC8vIHRvb2xTZWxlY3QudmFsdWUgPSBuZXdUb29sO1xuICB3b3JsZC5zZWxlY3RUb29sKDxrZXlvZiBUb29sc0NvbGxlY3Rpb24+bmV3VG9vbCk7XG59O1xuaWYgKHRvb2xTZWxlY3QgIT0gbnVsbCkge1xuICB0b29sU2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgIHNldFRvb2wodG9vbFNlbGVjdC52YWx1ZSk7XG4gIH0pO1xufVxuXG5cblxubGV0IHdvcmxkOldvcmxkID0gbmV3IFdvcmxkKGNhbnZhcyk7XG5sZXQgY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5jb25zdCBWRUxPQ0lUWTpudW1iZXIgPSAxNTtcblxubGV0IGtleXMgPSBuZXcgS2V5SW50ZXJhY3Rpdml0eSgpO1xua2V5cy5tYXAoJ2xlZnQnLCA2NSk7XG5rZXlzLm1hcCgncmlnaHQnLCA2OCk7XG5rZXlzLm1hcCgndXAnLCA4Nyk7XG5rZXlzLm1hcCgnZG93bicsIDgzKTtcbmtleXMubWFwKCd6b29tLW91dCcsIDgxKTtcbmtleXMubWFwKCd6b29tLWluJywgNjkpO1xubG9vcCgoKSA9PiB7XG4gIC8vIHJlbmRlckZ1bGxUcmlhbmdsZUdyaWQoZ3JpZCwgcmVuZGVyZXIsIGNvbnRleHQpO1xuXG4gIHdvcmxkLnJlbmRlcigpO1xuXG4gIGxldCBjYW1lcmEgPSB3b3JsZC5nZXRDYW1lcmEoKTtcblxuICBpZiAoa2V5cy5pc0Rvd24oJ3pvb20tb3V0JykpIHtcbiAgICBjYW1lcmEuc2V0Wm9vbShjYW1lcmEuZ2V0Wm9vbSgpICogMS4xKTtcbiAgfVxuICBpZiAoa2V5cy5pc0Rvd24oJ3pvb20taW4nKSkge1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgLyAxLjEpO1xuICB9XG5cbiAgbGV0IGR4ID0gMCwgZHkgPSAwO1xuICBpZiAoa2V5cy5pc0Rvd24oJ2xlZnQnKSkge1xuICAgIGR4IC09IFZFTE9DSVRZO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bigncmlnaHQnKSkge1xuICAgIGR4ICs9IFZFTE9DSVRZO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bigndXAnKSkge1xuICAgIGR5IC09IFZFTE9DSVRZO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bignZG93bicpKSB7XG4gICAgZHkgKz0gVkVMT0NJVFk7XG4gIH1cblxuICBkeCAqPSBjYW1lcmEuZ2V0Wm9vbSgpO1xuICBkeSAqPSBjYW1lcmEuZ2V0Wm9vbSgpO1xuICBpZiAoZHggIT09IDAgfHwgZHkgIT09IDApIHtcbiAgICBjYW1lcmEubW92ZShkeCwgZHkpO1xuICB9XG59LCAwKTtcblxuLy8gKi9cbn07XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlJbnRlcmFjdGl2aXR5IHtcbiAgcHJpdmF0ZSBrZXlzOntba2V5OnN0cmluZ106IGJvb2xlYW59O1xuICBwcml2YXRlIGtleU1hcDp7W2tleTpzdHJpbmddOiBzdHJpbmd8bnVtYmVyfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmtleXMgPSB7fTtcbiAgICB0aGlzLmtleU1hcCA9IHt9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XG4gICAgICBsZXQga2V5Y29kZSA9IGUua2V5Q29kZTtcbiAgICAgIHRoaXMua2V5c1trZXljb2RlXSA9IHRydWU7XG4gICAgICBsZXQgbmFtZSA9IHRoaXMua2V5TWFwW2tleWNvZGVdO1xuICAgICAgaWYgKG5hbWUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLmtleXNbbmFtZV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIGxldCBrZXljb2RlID0gZS5rZXlDb2RlO1xuICAgICAgaWYgKGtleWNvZGUgaW4gdGhpcy5rZXlzKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmtleXNba2V5Y29kZV07XG4gICAgICB9XG4gICAgICBpZiAoa2V5Y29kZSBpbiB0aGlzLmtleU1hcCkge1xuICAgICAgICBsZXQgbmFtZSA9IHRoaXMua2V5TWFwW2tleWNvZGVdO1xuICAgICAgICBpZiAobmFtZSAhPSBudWxsICYmIG5hbWUgaW4gdGhpcy5rZXlzKSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMua2V5c1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbWFwKG5hbWU6c3RyaW5nLCBrZXk6c3RyaW5nfG51bWJlcikge1xuICAgIHRoaXMua2V5TWFwW2tleV0gPSBuYW1lO1xuICB9XG5cbiAgaXNEb3duKGtleTpzdHJpbmd8bnVtYmVyKTpib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmtleXNba2V5XTtcbiAgfVxuXG4gIGdldERvd24oKTpzdHJpbmdbXSB7XG4gICAgbGV0IGtleXM6c3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5rZXlzKSB7XG4gICAgICBpZiAodGhpcy5pc0Rvd24oa2V5KSkge1xuICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleXM7XG4gIH1cbn1cbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9ldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3VzZUludGVyYWN0aXZpdHkge1xuICBldmVudHM6RXZlbnRzO1xuXG4gIHByaXZhdGUgZWxlbWVudDpIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBkb3duOmJvb2xlYW47XG4gIHByaXZhdGUgcG9zaXRpb246e3g/Om51bWJlciwgeT86bnVtYmVyfTtcbiAgcHJpdmF0ZSBkcmFnZ2luZzpib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6SFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucG9zaXRpb24gPSB7fTtcbiAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VEb3duKGUpKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VNb3ZlKGUpKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlVXAoZSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZVVwKHtcbiAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZIC0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcH0sIGZhbHNlKSk7XG4gIH1cblxuICBpc0Rvd24oKSB7IHJldHVybiB0aGlzLmRvd247IH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlVXAoZXZlbnQsIGV2ZW50czpib29sZWFuID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmRvd24pIHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IHt4OiBldmVudC5vZmZzZXRYLCB5OiBldmVudC5vZmZzZXRZfTtcbiAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgaWYgKGV2ZW50cykge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctZW5kJywgcG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2NsaWNrJywgcG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnBvc2l0aW9uLnkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5kb3duKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSBldmVudC5vZmZzZXRYO1xuICAgICAgdGhpcy5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyBkb3duIHdoZW4gd2UgcmVjZWl2ZSB0aGUgbW91c2Vkb3duIG9yIG1vdmUgZXZlbnQsIHRoZW5cbiAgICAgIC8vIHdlIGFyZSBkcmFnZ2luZy5cbiAgICAgIGlmICghdGhpcy5kcmFnZ2luZykge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1zdGFydCcsIHRoaXMucG9zaXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1tb3ZlJywgdGhpcy5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2hvdmVyJywge3g6IGV2ZW50Lm9mZnNldFgsIHk6IGV2ZW50Lm9mZnNldFl9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlRG93bihldmVudCkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WTtcbiAgICB0aGlzLmRvd24gPSB0cnVlO1xuICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2Rvd24nLCB0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuIl19
