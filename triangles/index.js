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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbW91c2UtaW50ZXJhY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPRSxZQUFZLGFBQW9CLEVBQUUsY0FBcUI7UUFDckQsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBYztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQ3ZCLElBQUks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LENBQUMsQ0FBQztRQUNSLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBRVIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1lBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxRQUFRLEVBQUUsVUFBUyxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVE7UUFDN0MsbUJBQW1CO1FBQ25CLCtCQUErQjtRQUMvQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNaLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ1osQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFWixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQU0sQ0FBQyxHQUFHLENBQUMsR0FBSyxDQUFDLENBQUM7UUFDN0IsR0FBRyxHQUFPLEdBQUcsR0FBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUU3QixJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQU0sQ0FBQyxHQUFHLENBQUMsR0FBSyxDQUFDLENBQUM7UUFDN0IsR0FBRyxHQUFPLEdBQUcsR0FBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUU3QixJQUFJLEdBQUcsR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQ3BCLENBQUM7WUFDRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0JBQXdCO1lBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUUsR0FBRyxHQUFHLEdBQUksQ0FBQyxDQUFDLENBQUM7WUFDYixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLGtDQUFrQztZQUNsQyx3QkFBd0I7WUFDeEIsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ0QsRUFBRSxDQUFBLENBQUUsQ0FBQyxJQUFJLEdBQUksQ0FBQztZQUNWLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQVEsMkJBQTJCO1FBQy9ELElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBRSxDQUFDLElBQUksR0FBSSxDQUFDO1lBQ2YsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsS0FBSyxDQUFDLENBQUUsd0JBQXdCO1FBQzlELElBQUk7WUFDQSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFFLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxLQUFLLENBQUMsQ0FBRSx5QkFBeUI7UUFFL0QsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBOEIsVUFBVTtRQUV0RCxFQUFFLENBQUEsQ0FBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUksQ0FBQztZQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDO1FBRW5CLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0QsUUFBUSxFQUFFLFVBQVMsQ0FBUSxFQUFFLENBQVEsRUFBRSxDQUFRO1FBQzdDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFWixFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQztZQUNQLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWE7UUFDaEMsQ0FBQztRQUFBLElBQUksQ0FBQSxDQUFDO1lBQ0YsSUFBSSxPQUFPLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDbEMsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqQixFQUFFLENBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pCLEVBQUUsQ0FBQSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxDQUFBO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQixDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBRUQsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUMsQ0FBQztJQUNsRixDQUFDO0NBQ0YsQ0FBQztBQUVGLGtCQUFlLE1BQU0sQ0FBQzs7Ozs7QUNySHRCO0lBR0U7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQTJCLEVBQUUsT0FBZTtRQUNqRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDNUIsQ0FBQztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVksRUFBRSxHQUFHLElBQVU7UUFDOUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7Q0FDRjtBQTNCRCx5QkEyQkM7Ozs7O0FDMUJEO0lBR0UsWUFBWSxJQUFZO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFhLEVBQUUsQ0FBUSxFQUFFLENBQVE7UUFDakQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLGNBQWMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxjQUFjLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFFckYsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUMxQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLElBQUksVUFBVSxHQUFHLEtBQUssR0FBRyxVQUFVLENBQUM7UUFFcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMzQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0MsSUFBSSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLEtBQUssR0FBRyxZQUFZLENBQUM7UUFDckIsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDYixDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFdEIsTUFBTSxDQUFDO1lBQ0wsQ0FBQyxFQUFFLEtBQUs7WUFDUixDQUFDLEVBQUUsS0FBSztTQUNULENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQWE7UUFFM0IsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLEdBQUcsUUFBUSxDQUFDO1FBQy9CLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQixLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDNUMsQ0FBQztJQUNKLENBQUM7SUFFTyxjQUFjLENBQUMsT0FBZ0MsRUFBRSxNQUFhLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFDbkUsWUFBbUY7UUFDeEcsSUFBSSxZQUFZLEdBQUcsVUFDZixFQUFTLEVBQUUsRUFBUyxFQUFFLEVBQVMsRUFBRSxFQUFTLEVBQUUsRUFBUyxFQUFFLEVBQVM7WUFDbEUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7UUFDRixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxjQUFjLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEdBQUcsY0FBYyxHQUFHLGNBQWMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNkLFlBQVksR0FBRyxDQUFDLFlBQVksQ0FBQztRQUNqQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixZQUFZLENBQUUsRUFBRSxHQUFNLFNBQVMsRUFBRSxDQUFDLEVBQUUsR0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLEVBQ3hDLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsRUFBRyxFQUFFLEdBQU8sVUFBVSxFQUN4QyxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEdBQUksVUFBVSxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sWUFBWSxDQUFFLEVBQUUsR0FBTSxTQUFTLEVBQUcsRUFBRSxHQUFPLFVBQVUsRUFDeEMsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxHQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFDeEMsRUFBRSxHQUFHLFNBQVMsRUFBTSxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFhLEVBQUUsS0FBaUMsRUFDekQsWUFBcUQ7UUFDL0QsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3ZFLENBQUM7SUFDSCxDQUFDO0lBRUQsY0FBYyxDQUFDLE9BQWdDLEVBQUUsTUFBYSxFQUMvQyxZQUM4QztRQUMzRCwrQkFBK0I7UUFDL0IsdUVBQXVFO1FBQ3ZFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ2pCLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUNqRSxFQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBQyxFQUMzRSxDQUFDLEtBQU8sRUFBRSxDQUFRLEVBQUUsQ0FBUSxLQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLG1EQUFtRDtRQUNuRCw4REFBOEQ7UUFDOUQsTUFBTTtJQUNSLENBQUM7Q0FDRjtBQS9HRCxnQ0ErR0M7Ozs7O0FDN0dELE1BQU0sV0FBVyxHQUF5QyxFQUFFLENBQUM7QUFHN0QsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBRXRCO0lBUUU7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFFBQVEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFekIsTUFBTSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQy9CLENBQUMsR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUM7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLDBCQUEwQjtRQUMxQixtQkFBbUI7UUFDbkIsa0JBQWtCO1FBQ2xCLHFCQUFxQjtRQUNyQixnQkFBZ0I7UUFDaEIsTUFBTTtRQUNOLElBQUk7UUFDSiwrQ0FBK0M7UUFDL0MsNkJBQTZCO1FBQzdCLHlCQUF5QjtRQUN6QixJQUFJO1FBQ0oscUNBQXFDO0lBQ3ZDLENBQUM7SUFFTyxhQUFhLENBQUMsQ0FBUSxFQUFFLENBQVE7UUFDdEMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztZQUM3QixDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUMsQ0FBQTtJQUN4QyxDQUFDO0lBRUQsR0FBRyxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQ3BCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLDRDQUE0QztRQUM1QywrQkFBK0I7SUFDakMsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFZLEVBQUUsQ0FBUSxFQUFFLENBQVE7UUFDbEMsK0JBQStCO1FBQy9CLHVCQUF1QjtRQUN2Qiw0QkFBNEI7UUFDNUIsNkJBQTZCO1FBQzdCLE1BQU07UUFDTixXQUFXO1FBQ1gsbURBQW1EO1FBQ25ELElBQUk7UUFDSixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUM7WUFDbEUsQ0FBQztZQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2YsQ0FBQztZQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO1FBQ2pELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNmLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFDRCxxQ0FBcUM7UUFDckMscUJBQXFCO0lBQ3ZCLENBQUM7SUFFRCxHQUFHLENBQUMsQ0FBdUM7UUFDekMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQXdCLEVBQUUsR0FBd0IsRUFDbEQsQ0FBdUM7UUFDakQsOERBQThEO1FBQzlELElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbEIsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQztnQkFDcEUsZUFBZSxDQUFDLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM1QixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO29CQUN4QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFDbkMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUNELCtCQUErQjtRQUMvQixnQ0FBZ0M7UUFDaEMsNkJBQTZCO1FBQzdCLCtDQUErQztRQUMvQywrQ0FBK0M7UUFDL0Msd0NBQXdDO1FBQ3hDLE1BQU07UUFDTixJQUFJO0lBRU4sQ0FBQztJQUVELGtCQUFrQixDQUFDLENBQVEsRUFBRSxDQUFRO1FBQ25DLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVEsRUFBRSxDQUFRO1FBQzdCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBUyxFQUFFLEVBQVMsT0FBTSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFBLENBQUEsQ0FBQyxDQUFDO1FBQ25FLElBQUksU0FBUyxHQUFHO1lBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNwQixDQUFDO1FBQ0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lB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LENBQUMsQ0FBQztZQUMvQyxDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7SUFDSCxDQUFDO0lBRU8sZUFBZSxDQUFDLEtBQUs7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUNGO0FBL0RELHFDQStEQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDYW1lcmEge1xuICAvLyBXb3JsZC1zcGFjZSBjYW1lcmEgZm9jdXMgcG9zaXRpb24uXG4gIHByaXZhdGUgeDpudW1iZXI7XG4gIHByaXZhdGUgeTpudW1iZXI7XG4gIHByaXZhdGUgem9vbTpudW1iZXI7XG4gIHByaXZhdGUgdmlld3BvcnQ6e3dpZHRoOm51bWJlciwgaGVpZ2h0Om51bWJlcn07XG5cbiAgY29uc3RydWN0b3Iodmlld3BvcnRXaWR0aDpudW1iZXIsIHZpZXdwb3J0SGVpZ2h0Om51bWJlcikge1xuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcbiAgICB0aGlzLnpvb20gPSAxO1xuICAgIHRoaXMudmlld3BvcnQgPSB7d2lkdGg6IHZpZXdwb3J0V2lkdGgsIGhlaWdodDogdmlld3BvcnRIZWlnaHR9O1xuICB9XG5cbiAgZ2V0Vmlld3BvcnQoKSB7XG4gICAgcmV0dXJuIHt3aWR0aDogdGhpcy52aWV3cG9ydC53aWR0aCwgaGVpZ2h0OiB0aGlzLnZpZXdwb3J0LmhlaWdodH07XG4gIH1cblxuICByZXNpemUod2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyKSB7XG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMudmlld3BvcnQuaGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgZ2V0Wm9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy56b29tO1xuICB9XG5cbiAgc2V0Wm9vbShuZXdab29tOm51bWJlcikge1xuICAgIHRoaXMuem9vbSA9IG5ld1pvb207XG4gIH1cblxuICBtb3ZlKGR4Om51bWJlciwgZHk6bnVtYmVyKSB7XG4gICAgdGhpcy54ICs9IGR4O1xuICAgIHRoaXMueSArPSBkeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgd29ybGQtc3BhY2UgY29vcmRpbmF0ZSB0byBjYW1lcmEtc3BhY2UuXG4gICAqL1xuICB0cmFuc2Zvcm0oeDpudW1iZXIsIHk6bnVtYmVyKTp7eDpudW1iZXIsIHk6bnVtYmVyfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6ICh4IC0gdGhpcy54KSAvIHRoaXMuem9vbSArIHRoaXMudmlld3BvcnQud2lkdGggLyAyLFxuICAgICAgeTogKHkgLSB0aGlzLnkpIC8gdGhpcy56b29tICsgdGhpcy52aWV3cG9ydC5oZWlnaHQgLyAyLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtcyBhIGNvb3JkaW5hdGUgZnJvbSBjYW1lcmEtc3BhY2UgdG8gd29ybGQtc3BhY2UuXG4gICAqL1xuICB1bnRyYW5zZm9ybSh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHggLSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gMikgKiB0aGlzLnpvb20gKyB0aGlzLngsXG4gICAgICB5OiAoeSAtIHRoaXMudmlld3BvcnQuaGVpZ2h0IC8gMikgKiB0aGlzLnpvb20gKyB0aGlzLnksXG4gICAgfTtcbiAgfVxufVxuIiwiZXhwb3J0IHR5cGUgSHN2Q29sb3IgPSB7aDpudW1iZXIsIHM6bnVtYmVyLCB2Om51bWJlcn07XG5leHBvcnQgdHlwZSBSZ2JDb2xvciA9IHtyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyfTtcblxubGV0IGNvbG9ycyA9IHtcbiAgcmFuZG9tOiBmdW5jdGlvbigpIHtcbiAgICBsZXQgcmFuZG9tQ29tcG9uZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KTtcbiAgICB9O1xuICAgIGxldCByYW5kb21Db21wb25lbnRzID0gZnVuY3Rpb24obikge1xuICAgICAgbGV0IG91dDpudW1iZXJbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgb3V0LnB1c2gocmFuZG9tQ29tcG9uZW50KCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuICAgIHJldHVybiAncmdiKCcgKyByYW5kb21Db21wb25lbnRzKDMpLmpvaW4oJywnKSArICcpJztcbiAgfSxcbiAgcmdiOiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgcmV0dXJuICdyZ2IoJyArIFtyLCBnLCBiXS5qb2luKCcsJykgKyAnKSc7XG4gIH0sXG4gIGhleFRvUmdiOiBmdW5jdGlvbihzdHI6c3RyaW5nKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDEpO1xuICAgIHJldHVybiB7XG4gICAgICByOiBwYXJzZUludChzdHIuc2xpY2UoMCwgMiksIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHN0ci5zbGljZSgyLCA0KSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQoc3RyLnNsaWNlKDQsIDYpLCAxNiksXG4gICAgfTtcbiAgfSxcbiAgcmdiVG9IZXg6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICByID0gcnwwO1xuICAgIGcgPSBnfDA7XG4gICAgYiA9IGJ8MDtcblxuICAgIGlmIChyIDwgMCkgciA9IDA7XG4gICAgaWYgKHIgPiAyNTUpIHIgPSAyNTU7XG4gICAgaWYgKGcgPCAwKSBnID0gMDtcbiAgICBpZiAoZyA+IDI1NSkgZyA9IDI1NTtcbiAgICBpZiAoYiA8IDApIGIgPSAwO1xuICAgIGlmIChiID4gMjU1KSBiID0gMjU1O1xuXG4gICAgbGV0IHJzdHIgPSByLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAocnN0ci5sZW5ndGggPT09IDEpIHJzdHIgPSAnMCcgKyByc3RyO1xuICAgIGxldCBnc3RyID0gZy50b1N0cmluZygxNik7XG4gICAgaWYgKGdzdHIubGVuZ3RoID09PSAxKSBnc3RyID0gJzAnICsgZ3N0cjtcbiAgICBsZXQgYnN0ciA9IGIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChic3RyLmxlbmd0aCA9PT0gMSkgYnN0ciA9ICcwJyArIGJzdHI7XG4gICAgcmV0dXJuIFsnIycsIHJzdHIsIGdzdHIsIGJzdHJdLmpvaW4oJycpO1xuICB9LFxuICByZ2JUb0hzdjogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIC8vIGhzdiAgICAgICAgIG91dDtcbiAgICAvLyBkb3VibGUgICAgICBtaW4sIG1heCwgZGVsdGE7XG4gICAgciA9IHIgLyAyNTU7XG4gICAgZyA9IGcgLyAyNTU7XG4gICAgYiA9IGIgLyAyNTU7XG5cbiAgICBsZXQgbWluID0gciAgICA8IGcgPyByICAgOiBnO1xuICAgIG1pbiAgICAgPSBtaW4gIDwgYiA/IG1pbiA6IGI7XG5cbiAgICBsZXQgbWF4ID0gciAgICA+IGcgPyByICAgOiBnO1xuICAgIG1heCAgICAgPSBtYXggID4gYiA/IG1heCA6IGI7XG5cbiAgICBsZXQgb3V0ID0ge2g6IDAsIHM6IDAsIHY6IDB9O1xuICAgIGxldCB2ID0gbWF4O1xuICAgIGxldCBkZWx0YSA9IG1heCAtIG1pbjtcbiAgICBpZiAoZGVsdGEgPCAwLjAwMDAxKVxuICAgIHtcbiAgICAgICAgb3V0LnMgPSAwO1xuICAgICAgICBvdXQuaCA9IDA7IC8vIHVuZGVmaW5lZCwgbWF5YmUgbmFuP1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiggbWF4ID4gMC4wICkgeyAvLyBOT1RFOiBpZiBNYXggaXMgPT0gMCwgdGhpcyBkaXZpZGUgd291bGQgY2F1c2UgYSBjcmFzaFxuICAgICAgICBvdXQucyA9IChkZWx0YSAvIG1heCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgbWF4IGlzIDAsIHRoZW4gciA9IGcgPSBiID0gMFxuICAgICAgICAvLyBzID0gMCwgdiBpcyB1bmRlZmluZWRcbiAgICAgICAgb3V0LnMgPSAwLjA7XG4gICAgICAgIG91dC5oID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgaWYoIHIgPj0gbWF4ICkgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA+IGlzIGJvZ3VzLCBqdXN0IGtlZXBzIGNvbXBpbG9yIGhhcHB5XG4gICAgICAgIG91dC5oID0gKGcgLSBiKSAvIGRlbHRhOyAgICAgICAgLy8gYmV0d2VlbiB5ZWxsb3cgJiBtYWdlbnRhXG4gICAgZWxzZSBpZiggZyA+PSBtYXggKVxuICAgICAgICBvdXQuaCA9IDIuMCArICggYiAtIHIgKSAvIGRlbHRhOyAgLy8gYmV0d2VlbiBjeWFuICYgeWVsbG93XG4gICAgZWxzZVxuICAgICAgICBvdXQuaCA9IDQuMCArICggciAtIGcgKSAvIGRlbHRhOyAgLy8gYmV0d2VlbiBtYWdlbnRhICYgY3lhblxuXG4gICAgb3V0LmggKj0gNjAuMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkZWdyZWVzXG5cbiAgICBpZiggb3V0LmggPCAwLjAgKVxuICAgICAgICBvdXQuaCArPSAzNjAuMDtcblxuICAgIHJldHVybiBvdXQ7XG4gIH0sXG4gIGhzdlRvUmdiOiBmdW5jdGlvbihoOm51bWJlciwgczpudW1iZXIsIGw6bnVtYmVyKSB7XG4gICAgdmFyIHIsIGcsIGI7XG5cbiAgICBpZihzID09IDApe1xuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXG4gICAgfWVsc2V7XG4gICAgICAgIHZhciBodWUycmdiID0gZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KXtcbiAgICAgICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XG4gICAgICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xuICAgICAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcbiAgICAgICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG4gICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtyOiBNYXRoLnJvdW5kKHIgKiAyNTUpLCBnOiBNYXRoLnJvdW5kKGcgKiAyNTUpLCBiOiBNYXRoLnJvdW5kKGIgKiAyNTUpfTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29sb3JzO1xuIiwidHlwZSBIYW5kbGVyID0gKC4uLmFyZ3M6YW55W10pID0+IHZvaWQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50cyB7XG4gIHByaXZhdGUgaGFuZGxlcnM6e1trZXk6c3RyaW5nXTpBcnJheTxIYW5kbGVyPn07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICB9XG5cbiAgbGlzdGVuKGV2ZW50czpzdHJpbmd8QXJyYXk8c3RyaW5nPiwgaGFuZGxlcjpIYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBldmVudHMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBldmVudHMgPSBbZXZlbnRzXTtcbiAgICB9XG4gICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICBpZiAoIShldmVudCBpbiB0aGlzLmhhbmRsZXJzKSkge1xuICAgICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XSA9IFtdO1xuICAgICAgfVxuICAgICAgdGhpcy5oYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICB9XG4gIH1cblxuICBlbWl0KGV2ZW50OnN0cmluZywgLi4uYXJnczphbnlbXSkge1xuICAgIGxldCBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnNbZXZlbnRdO1xuICAgIGlmIChoYW5kbGVycyAhPSBudWxsKSB7XG4gICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcbmltcG9ydCBHcmlkIGZyb20gJy4vZ3JpZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRWaWV3TW9kZWw8VD4ge1xuICBwcml2YXRlIGdyaWQ6R3JpZDxUPjtcblxuICBjb25zdHJ1Y3RvcihncmlkOkdyaWQ8VD4pIHtcbiAgICB0aGlzLmdyaWQgPSBncmlkO1xuICB9XG5cbiAgc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhOkNhbWVyYSwgeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGNlbGxTaXplID0gMTtcbiAgICBsZXQgY2VsbEhlaWdodCA9IGNlbGxTaXplO1xuICAgIGxldCBoYWxmQ2VsbEhlaWdodCA9IGNlbGxIZWlnaHQgLyAyO1xuICAgIGxldCBjZWxsV2lkdGggPSBNYXRoLnNxcnQoY2VsbEhlaWdodCAqIGNlbGxIZWlnaHQgLSBoYWxmQ2VsbEhlaWdodCAqIGhhbGZDZWxsSGVpZ2h0KTtcblxuICAgIGxldCB3b3JsZFNwYWNlID0gY2FtZXJhLnVudHJhbnNmb3JtKHgsIHkpO1xuICAgIHggPSB3b3JsZFNwYWNlLng7XG4gICAgeSA9IHdvcmxkU3BhY2UueTtcblxuICAgIGxldCBncmlkWCA9IHggLyBjZWxsV2lkdGg7XG4gICAgbGV0IGZsb29yR3JpZFggPSBNYXRoLmZsb29yKGdyaWRYKTtcbiAgICBsZXQgcmVtYWluZGVyWCA9IGdyaWRYIC0gZmxvb3JHcmlkWDtcblxuICAgIGxldCBncmlkWSA9IHkgLyBjZWxsSGVpZ2h0ICogMiArIDEgLSBncmlkWDtcbiAgICBsZXQgZmxvb3JlZEdyaWRZID0gTWF0aC5mbG9vcihncmlkWSAvIDIpICogMjtcblxuICAgIGxldCByZW1haW5kZXJZID0gKGdyaWRZIC0gZmxvb3JlZEdyaWRZKSAvIDI7XG4gICAgZ3JpZFkgPSBmbG9vcmVkR3JpZFk7XG4gICAgaWYgKHJlbWFpbmRlclkgPiAxIC0gcmVtYWluZGVyWCkge1xuICAgICAgZ3JpZFkgKz0gMTtcbiAgICB9XG4gICAgaWYgKGZsb29yR3JpZFggJSAyICE9PSAwKSB7XG4gICAgICBncmlkWSArPSAxO1xuICAgIH1cblxuICAgIGxldCBiaUNvbHVtbiA9IE1hdGguZmxvb3IoZmxvb3JHcmlkWCAvIDIpO1xuICAgIGdyaWRZICs9IGJpQ29sdW1uICogMjtcblxuICAgIHJldHVybiB7XG4gICAgICB4OiBncmlkWCxcbiAgICAgIHk6IGdyaWRZLFxuICAgIH07XG4gIH1cblxuICBnZXRHcmlkVmlld1JlY3QoY2FtZXJhOkNhbWVyYSk6e2xlZnQ6bnVtYmVyLCB0b3A6bnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6bnVtYmVyLCBib3R0b206bnVtYmVyfSB7XG4gICAgbGV0IHZpZXdwb3J0ID0gY2FtZXJhLmdldFZpZXdwb3J0KCk7XG4gICAgbGV0IHt3aWR0aCwgaGVpZ2h0fSA9IHZpZXdwb3J0O1xuICAgIGxldCB0b3BMZWZ0ID0gdGhpcy5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIDAsIDApO1xuICAgIGxldCBib3R0b21SaWdodCA9IHRoaXMuc2NyZWVuVG9HcmlkQ29vcmQoY2FtZXJhLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdG9wTGVmdC54LCB0b3A6IHRvcExlZnQueSxcbiAgICAgIHJpZ2h0OiBib3R0b21SaWdodC54LCBib3R0b206IGJvdHRvbVJpZ2h0LnlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJUcmlhbmdsZShjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgY2FtZXJhOkNhbWVyYSwgeDpudW1iZXIsIHk6bnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHQ6VHxudWxsLCB4Om51bWJlciwgeTpudW1iZXIpPT52b2lkKSB7XG4gICAgbGV0IHRyaWFuZ2xlUGF0aCA9IGZ1bmN0aW9uKFxuICAgICAgICB4MTpudW1iZXIsIHkxOm51bWJlciwgeDI6bnVtYmVyLCB5MjpudW1iZXIsIHgzOm51bWJlciwgeTM6bnVtYmVyKSB7XG4gICAgICBsZXQgcDEgPSBjYW1lcmEudHJhbnNmb3JtKHgxLCB5MSk7XG4gICAgICBsZXQgcDIgPSBjYW1lcmEudHJhbnNmb3JtKHgyLCB5Mik7XG4gICAgICBsZXQgcDMgPSBjYW1lcmEudHJhbnNmb3JtKHgzLCB5Myk7XG4gICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgY29udGV4dC5tb3ZlVG8ocDEueCwgcDEueSk7XG4gICAgICBjb250ZXh0LmxpbmVUbyhwMi54LCBwMi55KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHAzLngsIHAzLnkpO1xuICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICB9O1xuICAgIGxldCBjZWxsSGVpZ2h0ID0gMTtcbiAgICBsZXQgaGFsZkNlbGxIZWlnaHQgPSBjZWxsSGVpZ2h0IC8gMjtcbiAgICBsZXQgY2VsbFdpZHRoID0gTWF0aC5zcXJ0KGNlbGxIZWlnaHQgKiBjZWxsSGVpZ2h0IC0gaGFsZkNlbGxIZWlnaHQgKiBoYWxmQ2VsbEhlaWdodCk7XG4gICAgbGV0IHh4ID0geDtcbiAgICBsZXQgeXkgPSB5IC8gMiAtIC41O1xuICAgIGxldCBsZWZ0VHJpYW5nbGUgPSB4ICUgMiAhPT0gMDtcbiAgICBpZiAoeSAlIDIgIT09IDApIHtcbiAgICAgICAgbGVmdFRyaWFuZ2xlID0gIWxlZnRUcmlhbmdsZTtcbiAgICB9XG4gICAgaWYgKGxlZnRUcmlhbmdsZSkge1xuICAgICAgdHJpYW5nbGVQYXRoKCB4eCAgICAqIGNlbGxXaWR0aCwgKHl5Ky41KSAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgKHh4KzEpICogY2VsbFdpZHRoLCAgeXkgICAgICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICh5eSsxKSAgKiBjZWxsSGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJpYW5nbGVQYXRoKCB4eCAgICAqIGNlbGxXaWR0aCwgIHl5ICAgICAqIGNlbGxIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgKHh4KzEpICogY2VsbFdpZHRoLCAoeXkrLjUpICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICB4eCAqIGNlbGxXaWR0aCwgICAgICh5eSsxKSAqIGNlbGxIZWlnaHQpO1xuICAgIH1cbiAgICBsZXQgdmFsdWUgPSB0aGlzLmdyaWQuZ2V0KHgsIHkpO1xuICAgIGRyYXdUcmlhbmdsZShjb250ZXh0LCB2YWx1ZSwgeCwgeSk7XG4gIH1cblxuICByZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmE6Q2FtZXJhLCBjZWxsczpBcnJheTx7eDpudW1iZXIsIHk6bnVtYmVyfT4sXG4gICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dCwgdDpULCB4Om51bWJlciwgeTpudW1iZXIpPT52b2lkKSB7XG4gICAgZm9yIChsZXQgY29vcmQgb2YgY2VsbHMpIHtcbiAgICAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCBjb29yZC54LCBjb29yZC55LCBkcmF3VHJpYW5nbGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFsbENlbGxzKGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjYW1lcmE6Q2FtZXJhLFxuICAgICAgICAgICAgICAgICBkcmF3VHJpYW5nbGU6KGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHQ6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgIC8vIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgbGV0IHZpc2libGVSZWN0ID0gdGhpcy5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbiAgICB0aGlzLmdyaWQuZmlsdGVyZWRNYXAoXG4gICAgICAgIHt4OiBNYXRoLmZsb29yKHZpc2libGVSZWN0LmxlZnQpLCB5OiBNYXRoLmZsb29yKHZpc2libGVSZWN0LnRvcCl9LFxuICAgICAgICB7eDogTWF0aC5jZWlsKHZpc2libGVSZWN0LnJpZ2h0ICsgMSksIHk6IE1hdGguY2VpbCh2aXNpYmxlUmVjdC5ib3R0b20gKyAxKX0sXG4gICAgICAgICh2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRyaWFuZ2xlKGNvbnRleHQsIGNhbWVyYSwgeCwgeSwgZHJhd1RyaWFuZ2xlKSk7XG4gICAgLy8gdGhpcy5ncmlkLm1hcCgodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB7XG4gICAgLy8gICB0aGlzLnJlbmRlclRyaWFuZ2xlKGNvbnRleHQsIGNhbWVyYSwgeCwgeSwgZHJhd1RyaWFuZ2xlKTtcbiAgICAvLyB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL2NhbWVyYSc7XG5cbmltcG9ydCBjb29yZHMgZnJvbSAnLi9jb29yZHMnO1xuXG5cbmNvbnN0IENPT1JEX0lOREVYOntba2V5Om51bWJlcl06e1trZXk6bnVtYmVyXTogc3RyaW5nfX0gPSB7fTtcblxuXG5jb25zdCBDSFVOS19TSVpFID0gNjQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWQ8VD4ge1xuICBwcml2YXRlIGNvdW50Om51bWJlcjtcbiAgcHJpdmF0ZSBncmlkOntba2V5OnN0cmluZ106IHtjb29yZDoge3g6bnVtYmVyLCB5Om51bWJlcn0sIHZhbHVlOiBUfX07XG4gIHByaXZhdGUgY2h1bmtzOntba2V5OnN0cmluZ106IHtcbiAgICBjb29yZDp7eDpudW1iZXIsIHk6bnVtYmVyfSxcbiAgICBjb3VudDpudW1iZXIsXG4gICAgZGF0YTp7W2tleTpzdHJpbmddOiB7Y29vcmQ6IHt4Om51bWJlciwgeTpudW1iZXJ9LCB2YWx1ZTogVH19fX07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5ncmlkID0ge307XG4gICAgdGhpcy5jaHVua3MgPSB7fTtcbiAgfVxuXG4gIGdldENvdW50KCkgeyByZXR1cm4gdGhpcy5jb3VudDsgfVxuXG4gIHByaXZhdGUgZ2V0S2V5KHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIHggPSB4fDA7XG4gICAgeSA9IHl8MDtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoW3gsIHldKTtcbiAgICAvLyBsZXQgYSA9IENPT1JEX0lOREVYW3hdO1xuICAgIC8vIGlmIChhICE9IG51bGwpIHtcbiAgICAvLyAgIGxldCBiID0gYVt5XTtcbiAgICAvLyAgIGlmIChiICE9IG51bGwpIHtcbiAgICAvLyAgICAgcmV0dXJuIGI7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIGxldCByZXN1bHQgPSB4ICsgJy8nICsgeTsvL1t4LCB5XS5qb2luKCcvJyk7XG4gICAgLy8gaWYgKCEoeCBpbiBDT09SRF9JTkRFWCkpIHtcbiAgICAvLyAgIENPT1JEX0lOREVYW3hdID0ge307XG4gICAgLy8gfVxuICAgIC8vIHJldHVybiBDT09SRF9JTkRFWFt4XVt5XSA9IHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2h1bmtDb29yZCh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge3g6IE1hdGguZmxvb3IoeCAvIENIVU5LX1NJWkUpLFxuICAgICAgICAgICAgeTogTWF0aC5mbG9vcih5IC8gQ0hVTktfU0laRSl9XG4gIH1cblxuICBnZXQoeDpudW1iZXIsIHk6bnVtYmVyKTpUfG51bGwge1xuICAgIGxldCBjaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKHgsIHkpO1xuICAgIGxldCBjaHVua0tleSA9IHRoaXMuZ2V0S2V5KGNodW5rQ29vcmQueCwgY2h1bmtDb29yZC55KTtcbiAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgaWYgKGNodW5rID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIGxldCBjZWxsID0gY2h1bmsuZGF0YVt0aGlzLmdldEtleSh4LCB5KV07XG4gICAgcmV0dXJuIGNlbGwgJiYgY2VsbC52YWx1ZTtcbiAgICAvLyBsZXQgdmFsdWUgPSB0aGlzLmdyaWRbdGhpcy5nZXRLZXkoeCwgeSldO1xuICAgIC8vIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS52YWx1ZTtcbiAgfVxuXG4gIHNldCh2YWx1ZTpUfG51bGwsIHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIC8vIGxldCBrZXkgPSB0aGlzLmdldEtleSh4LCB5KTtcbiAgICAvLyBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIC8vICAgaWYgKGtleSBpbiB0aGlzLmdyaWQpIHtcbiAgICAvLyAgICAgZGVsZXRlIHRoaXMuZ3JpZFtrZXldO1xuICAgIC8vICAgfVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICB0aGlzLmdyaWRba2V5XSA9IHtjb29yZDp7eCwgeX0sIHZhbHVlOiB2YWx1ZX07XG4gICAgLy8gfVxuICAgIGxldCBrZXkgPSB0aGlzLmdldEtleSh4LCB5KTtcbiAgICBsZXQgY2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZCh4LCB5KTtcbiAgICBsZXQgY2h1bmtLZXkgPSB0aGlzLmdldEtleShjaHVua0Nvb3JkLngsIGNodW5rQ29vcmQueSk7XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIGlmICghKGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSkge1xuICAgICAgICB0aGlzLmNodW5rc1tjaHVua0tleV0gPSB7Y29vcmQ6IGNodW5rQ29vcmQsIGNvdW50OiAwLCBkYXRhOiB7fX07XG4gICAgICB9XG4gICAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICBpZiAoIShrZXkgaW4gY2h1bmsuZGF0YSkpIHtcbiAgICAgICAgY2h1bmsuY291bnQrKztcbiAgICAgICAgdGhpcy5jb3VudCsrO1xuICAgICAgfVxuICAgICAgY2h1bmsuZGF0YVtrZXldID0ge2Nvb3JkOnt4LCB5fSwgdmFsdWU6IHZhbHVlfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSB7XG4gICAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgICAgaWYgKGtleSBpbiBjaHVuay5kYXRhKSB7XG4gICAgICAgICAgY2h1bmsuY291bnQtLTtcbiAgICAgICAgICB0aGlzLmNvdW50LS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNodW5rLmNvdW50ID4gMCkge1xuICAgICAgICAgIGRlbGV0ZSBjaHVuay5kYXRhW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgLy8gaWYgKHZhbHVlID09IG51bGwpXG4gIH1cblxuICBtYXAoZjoodmFsdWU6VCwgeDpudW1iZXIsIHk6bnVtYmVyKSA9PiB2b2lkKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ3JpZCkge1xuICAgICAgbGV0IHZhbHVlID0gdGhpcy5ncmlkW2tleV07XG4gICAgICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgIH1cbiAgfVxuXG4gIGZpbHRlcmVkTWFwKG1pbjp7eDpudW1iZXIsIHk6bnVtYmVyfSwgbWF4Ont4Om51bWJlciwgeTpudW1iZXJ9LFxuICAgICAgICAgICAgICBmOih2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAvLyBUT0RPOiBJbmRleCB0aGUgZ3JpZCBvciBzb21ldGhpbmcuIEl0J3MgcHJldHR5IGluZWZmaWNpZW50LlxuICAgIGxldCBzdGFydENodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQobWluLngsIG1pbi55KTtcbiAgICBsZXQgZW5kQ2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZChtYXgueCwgbWF4LnkpO1xuICAgIGVuZENodW5rQ29vcmQueCsrO1xuICAgIGVuZENodW5rQ29vcmQueSsrO1xuICAgIGZvciAobGV0IGNodW5rS2V5IGluIHRoaXMuY2h1bmtzKSB7XG4gICAgICBsZXQgY2h1bmsgPSB0aGlzLmNodW5rc1tjaHVua0tleV07XG4gICAgICBsZXQgY2h1bmtDb29yZCA9IGNodW5rLmNvb3JkO1xuICAgICAgaWYgKHN0YXJ0Q2h1bmtDb29yZC54IDw9IGNodW5rQ29vcmQueCAmJiBjaHVua0Nvb3JkLnggPD0gZW5kQ2h1bmtDb29yZC54ICYmXG4gICAgICAgICAgc3RhcnRDaHVua0Nvb3JkLnkgPD0gY2h1bmtDb29yZC55ICYmIGNodW5rQ29vcmQueSA8PSBlbmRDaHVua0Nvb3JkLnkpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNodW5rLmRhdGEpIHtcbiAgICAgICAgICBsZXQgdmFsdWUgPSBjaHVuay5kYXRhW2tleV07XG4gICAgICAgICAgbGV0IGNvb3JkID0gdmFsdWUuY29vcmQ7XG4gICAgICAgICAgaWYgKG1pbi54IDw9IGNvb3JkLnggJiYgY29vcmQueCA8IG1heC54ICYmXG4gICAgICAgICAgICAgIG1pbi55IDw9IGNvb3JkLnkgJiYgY29vcmQueSA8IG1heC55KSB7XG4gICAgICAgICAgICBmKHZhbHVlLnZhbHVlLCBjb29yZC54LCBjb29yZC55KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZm9yIChsZXQga2V5IGluIHRoaXMuZ3JpZCkge1xuICAgIC8vICAgbGV0IHZhbHVlID0gdGhpcy5ncmlkW2tleV07XG4gICAgLy8gICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAvLyAgIGlmIChtaW4ueCA8PSBjb29yZC54ICYmIGNvb3JkLnggPCBtYXgueCAmJlxuICAgIC8vICAgICAgIG1pbi55IDw9IGNvb3JkLnkgJiYgY29vcmQueSA8IG1heC55KSB7XG4gICAgLy8gICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICB9XG5cbiAgZ2V0RGlyZWN0TmVpZ2hib3JzKHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIGxldCBkYyA9IChkeDpudW1iZXIsIGR5Om51bWJlcikgPT4ge3JldHVybiB7eDogeCArIGR4LCB5OiB5ICsgZHl9fTtcbiAgICBsZXQgbmVpZ2hib3JzID0gW2RjKDAsIC0xKSwgZGMoMCwgMSldO1xuICAgIGlmIChNYXRoLmFicyh4ICUgMikgPT09IE1hdGguYWJzKHkgJSAyKSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgMCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG5cbiAgZ2V0TmVpZ2hib3JzKHg6bnVtYmVyLCB5Om51bWJlcikge1xuICAgIGxldCBkYyA9IChkeDpudW1iZXIsIGR5Om51bWJlcikgPT4ge3JldHVybiB7eDogeCArIGR4LCB5OiB5ICsgZHl9fTtcbiAgICBsZXQgbmVpZ2hib3JzID0gW1xuICAgICAgZGMoLTEsIDApLCBkYygtMSwgLTEpLCBkYygwLCAtMSksXG4gICAgICBkYygxLCAtMSksIGRjKDEsIDApLCBkYygxLCAxKSxcbiAgICAgIGRjKDAsIDEpLCBkYygtMSwgMSksXG4gICAgICBkYygwLCAtMiksIGRjKDAsIDIpXG4gICAgXTtcbiAgICBpZiAoTWF0aC5hYnMoeCAlIDIpID09PSBNYXRoLmFicyh5ICUgMikpIHtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKC0xLCAtMikpO1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIDIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgLTIpKTtcbiAgICAgIG5laWdoYm9ycy5wdXNoKGRjKDEsIDIpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5laWdoYm9ycztcbiAgfVxufVxuIiwiaW1wb3J0IENhbWVyYSBmcm9tICcuL2NhbWVyYSc7XG5pbXBvcnQgQ29sb3JTZWxlY3RDb21wb25lbnQgZnJvbSAnLi9jb2xvci1zZWxlY3QnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcbmltcG9ydCBHcmlkVmlld01vZGVsIGZyb20gJy4vZ3JpZC12aWV3LW1vZGVsJztcbmltcG9ydCBLZXlJbnRlcmFjdGl2aXR5IGZyb20gJy4va2V5LWludGVyYWN0aXZpdHknO1xuaW1wb3J0IE1vdXNlSW50ZXJhY3Rpdml0eSBmcm9tICcuL21vdXNlLWludGVyYWN0aXZpdHknO1xuXG5pbXBvcnQgV29ybGQgZnJvbSAnLi93b3JsZCc7XG5pbXBvcnQgeyBUb29sc0NvbGxlY3Rpb24gfSBmcm9tICcuL3Rvb2xzJztcblxuaW1wb3J0IGNvbG9ycyBmcm9tICcuL2NvbG9ycyc7XG5cblxuY2xhc3MgUGFyYW1zIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcGFyYW1zOntba2V5OnN0cmluZ106IHN0cmluZ30gPSAoKCkgPT4ge1xuICAgIGxldCByYXdQYXJhbXMgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCc/Jykuc2xpY2UoMSkuam9pbignPycpLnNwbGl0KCcjJylbMF0uc3BsaXQoJyYnKTtcbiAgICBsZXQgcGFyYW1zID0ge307XG4gICAgZm9yIChsZXQgcGFyYW0gb2YgcmF3UGFyYW1zKSB7XG4gICAgICBsZXQgc3BsaXQgPSBwYXJhbS5zcGxpdCgnPScpO1xuICAgICAgbGV0IGtleSA9IHNwbGl0WzBdO1xuICAgICAgbGV0IHZhbHVlID0gc3BsaXQuc2xpY2UoMSkuam9pbignPScpO1xuICAgICAgcGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcmFtcztcbiAgfSkoKTtcblxuICBzdGF0aWMgbnVtYmVyKGtleTpzdHJpbmcsIGRlZmF1bHRWYWx1ZTpudW1iZXIpOm51bWJlciB7XG4gICAgbGV0IHZhbHVlID0gTnVtYmVyKHRoaXMucGFyYW1zW2tleV0pO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIHN0cmluZyhrZXk6c3RyaW5nLCBkZWZhdWx0VmFsdWU6c3RyaW5nKTpzdHJpbmcge1xuICAgIGxldCB2YWx1ZTpzdHJpbmd8bnVsbCA9IHRoaXMucGFyYW1zW2tleV07XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuXG5sZXQgd2VpZ2h0ZWRSYW5kb20gPSBmdW5jdGlvbjxUPihsaXN0OkFycmF5PFQ+LCB3ZWlnaHRGbjooVCkgPT4gbnVtYmVyKSB7XG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkgdGhyb3cgJ2Vycm9yJztcbiAgbGV0IHRvdGFsV2VpZ2h0Om51bWJlciA9IDA7XG4gIGxldCB3ZWlnaHRzOm51bWJlcltdID0gW107XG4gIGZvciAobGV0IGl0ZW0gb2YgbGlzdCkge1xuICAgIGxldCB3ZWlnaHQgPSBNYXRoLmFicyh3ZWlnaHRGbihpdGVtKSk7XG4gICAgdG90YWxXZWlnaHQgKz0gd2VpZ2h0O1xuICAgIHdlaWdodHMucHVzaCh3ZWlnaHQpO1xuICB9XG4gIGxldCBuID0gTWF0aC5yYW5kb20oKSAqIHRvdGFsV2VpZ2h0O1xuICBsZXQgY3VtdWxhdGl2ZVN1bSA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgd2VpZ2h0cy5sZW5ndGg7IGkrKykge1xuICAgIGN1bXVsYXRpdmVTdW0gKz0gd2VpZ2h0c1tpXTtcbiAgICBpZiAobiA8PSBjdW11bGF0aXZlU3VtKSB7XG4gICAgICByZXR1cm4gbGlzdFtpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbn07XG5cblxubGV0IHNldFN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICBsZXQgc3RhdHVzRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpO1xuICBpZiAoc3RhdHVzRGl2ICE9IG51bGwpIHtcbiAgICBzdGF0dXNEaXYudGV4dENvbnRlbnQgPSBzdGF0dXM7XG4gIH1cbn07XG5cblxubGV0IGxvb3AgPSBmdW5jdGlvbihmLCBkdCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGR0KSA9PiBsb29wKGYsIGR0KSk7XG4gIGYoZHQpO1xufTtcblxuXG50eXBlIENlbGxUeXBlID0gc3RyaW5nO1xuXG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuXG5sZXQgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbmxldCBjYW52YXNXaWR0aDpudW1iZXIgPSBjYW52YXMud2lkdGg7XG5sZXQgY2FudmFzSGVpZ2h0Om51bWJlciA9IGNhbnZhcy5oZWlnaHQ7XG5cblxuLy8qIEFkZC9yZW1vdmUgYSAnLycgdG8vZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgbGluZSB0byBzd2l0Y2ggbW9kZXNcblxubGV0IGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxubGV0IGNhbWVyYSA9IG5ldyBDYW1lcmEoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG5jYW1lcmEuc2V0Wm9vbShQYXJhbXMubnVtYmVyKCd6b29tJywgMS85NikpO1xuXG5cbnR5cGUgSFNMQ2VsbCA9IHtoOm51bWJlciwgczpudW1iZXIsIGw6bnVtYmVyLCBjb2xvcj86c3RyaW5nfTtcbmxldCBncmlkOkdyaWQ8SFNMQ2VsbD4gPSBuZXcgR3JpZDxIU0xDZWxsPigpO1xubGV0IHJlbmRlcmVyOkdyaWRWaWV3TW9kZWw8SFNMQ2VsbD4gPSBuZXcgR3JpZFZpZXdNb2RlbDxIU0xDZWxsPihncmlkKTtcblxuXG5sZXQgZGlydHlDYW52YXMgPSBmYWxzZTtcblxuXG5sZXQgcmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIGNhbnZhcy53aWR0aCA9IGNhbnZhc1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSBjYW52YXNIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS5yZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCk7XG4gIGRpcnR5Q2FudmFzID0gdHJ1ZTtcbn07XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHJlc2l6ZSk7XG5yZXNpemUoKTtcblxubGV0IGdldEhzbENlbGxDb2xvciA9IGZ1bmN0aW9uKGNlbGw6SFNMQ2VsbCk6c3RyaW5nIHtcbiAgbGV0IGNvbG9yID0gY2VsbC5jb2xvcjtcbiAgaWYgKGNvbG9yID09IG51bGwpIHtcbiAgICBsZXQgcmdiID0gY29sb3JzLmhzdlRvUmdiKGNlbGwuaCwgY2VsbC5zLCBjZWxsLmwpO1xuICAgIGNvbG9yID0gY29sb3JzLnJnYlRvSGV4KHJnYi5yLCByZ2IuZywgcmdiLmIpO1xuICB9XG4gIHJldHVybiBjb2xvcjtcbn07XG5cbi8vIGdyaWQuc2V0KHtoOiAwLCBzOiAxLCBsOiAxfSwgMCwgMCk7XG5cbmxldCBtb2QgPSBmdW5jdGlvbihuOm51bWJlciwgbTpudW1iZXIpOm51bWJlciB7XG4gIGxldCBtb2RkZWQgPSBuICUgbTtcbiAgaWYgKG4gPCAwKSBuICs9IG07XG4gIHJldHVybiBuO1xufTtcbmxldCBjbGFtcCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtaW46bnVtYmVyLCBtYXg6bnVtYmVyKTpudW1iZXIge1xuICBpZiAobiA8IG1pbikgcmV0dXJuIG1pbjtcbiAgaWYgKG4gPiBtYXgpIHJldHVybiBtYXg7XG4gIHJldHVybiBuO1xufTtcblxuXG5cblxubGV0IGFjdGl2ZUNlbGxzOnt4Om51bWJlciwgeTpudW1iZXJ9W10gPSBbe3g6IDAsIHk6IDB9XTtcbmxldCBlZGdlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdXG5cbmNvbnN0IElOSVRJQUxfTFVNID0gMTtcbmNvbnN0IE1BWF9MVU0gPSAwLjQ7XG5jb25zdCBNSU5fTFVNID0gUGFyYW1zLm51bWJlcignbWlubHVtJywgMC43NSk7XG5jb25zdCBMVU1fREVMVEEgPSBQYXJhbXMubnVtYmVyKCdsdW1kZWx0YScsIC0wLjAwMDAxKTstMC4wMDAwNTswLjAwMDU7XG5sZXQgUkVQUl9QUk9CQUJJTElUWSA9IFBhcmFtcy5udW1iZXIoJ3JlcHInLCAwLjAwNSk7MC4xOzAuMjA7MC4wMDI0O1xuY29uc3QgSFVFX0NIQU5HRSA9IE1hdGguYWJzKFBhcmFtcy5udW1iZXIoJ2h1ZWNoYW5nZScsIDAuMDIpKTtcbmNvbnN0IFNBVF9DSEFOR0UgPSBNYXRoLmFicyhQYXJhbXMubnVtYmVyKCdzYXRjaGFuZ2UnLCAwLjA1KSk7XG5jb25zdCBNSU5fU0FUID0gUGFyYW1zLm51bWJlcignbWluc2F0JywgMC43KTtcbmNvbnN0IE1BWF9TQVQgPSBQYXJhbXMubnVtYmVyKCdtYXhzYXQnLCAxKTtcbmNvbnN0IE1JTl9aT09NID0gUGFyYW1zLm51bWJlcignbWluem9vbScsIDEvMyk7XG5cbmxldCBnZXROZWlnaGJvcnMgPSBmdW5jdGlvbihncmlkLCB4LCB5LCB2aWV3UmVjdCkge1xuICBsZXQgbmVpZ2hib3JzID0gZ3JpZC5nZXREaXJlY3ROZWlnaGJvcnMoeCwgeSk7XG4gIG5laWdoYm9ycyA9IG5laWdoYm9ycy5maWx0ZXIoXG4gICAgICAodmFsdWU6e3g6bnVtYmVyLCB5Om51bWJlcn0pID0+IGdyaWQuZ2V0KHZhbHVlLngsIHZhbHVlLnkpID09IG51bGwpO1xuICBpZiAodmlld1JlY3QgIT0gbnVsbCkge1xuICAgIG5laWdoYm9ycyA9IG5laWdoYm9ycy5maWx0ZXIoXG4gICAgICAodmFsdWU6e3g6bnVtYmVyLCB5Om51bWJlcn0pID0+IChcbiAgICAgICAgICB2aWV3UmVjdC5sZWZ0IDw9IHZhbHVlLnggJiYgdmFsdWUueCA8PSB2aWV3UmVjdC5yaWdodCAmJlxuICAgICAgICAgIHZpZXdSZWN0LnRvcCA8PSB2YWx1ZS55ICYmIHZhbHVlLnkgPD0gdmlld1JlY3QuYm90dG9tKSk7XG4gIH1cbiAgcmV0dXJuIG5laWdoYm9ycztcbn07XG5cblxubGV0IGtleUludGVyYWN0aXZpdHkgPSBuZXcgS2V5SW50ZXJhY3Rpdml0eSgpO1xuXG5cbmxldCBpbnRlcmFjdGl2aXR5ID0gbmV3IE1vdXNlSW50ZXJhY3Rpdml0eShjYW52YXMpO1xubGV0IGRyYWdQb3NpdGlvbjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9ID0gbnVsbDtcbmxldCBsYXN0RHJhZ1Bvc2l0aW9uOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xuXG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2RyYWctc3RhcnQnLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBpZiAocG9zaXRpb24ueCA9PSBudWxsIHx8IHBvc2l0aW9uLnkgPT0gbnVsbCkge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0ge3g6IHBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnl9O1xuLy8gICB9XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignZHJhZy1tb3ZlJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgaWYgKHBvc2l0aW9uLnggPT0gbnVsbCB8fCBwb3NpdGlvbi55ID09IG51bGwpIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IHt4OiBwb3NpdGlvbi54LCB5OiBwb3NpdGlvbi55fTtcbi8vICAgfVxuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oWydkcmFnLWVuZCcsICdjbGljayddLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBkcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gICBsYXN0RHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdjbGljaycsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGNvbnNvbGUubG9nKGdldE5laWdoYm9ycyhncmlkLCBob3ZlcmVkLngsIGhvdmVyZWQueSwgbnVsbCkpO1xuLy8gfSk7XG5cbi8vIGxldCBob3ZlcmVkID0ge3g6IDAsIHk6IDB9O1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdob3ZlcicsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGxldCBncmlkQ29vcmQgPSByZW5kZXJlci5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuLy8gICBob3ZlcmVkLnggPSBNYXRoLmZsb29yKGdyaWRDb29yZC54KTtcbi8vICAgaG92ZXJlZC55ID0gTWF0aC5mbG9vcihncmlkQ29vcmQueSk7XG4vLyB9KTtcblxuXG5sZXQgdXBkYXRlQWN0aXZlQ2VsbHMgPSBmdW5jdGlvbihkdCwgdmlld1JlY3QpOnZvaWQge1xuICBsZXQgbmV3QWN0aXZlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdO1xuICBmb3IgKGxldCBhY3RpdmVDZWxsIG9mIGFjdGl2ZUNlbGxzKSB7XG4gICAgbGV0IGtlZXAgPSB0cnVlO1xuICAgIGxldCBleGlzdGluZyA9IGdyaWQuZ2V0KGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55KTtcbiAgICBsZXQgZXhpc3RlZCA9IGV4aXN0aW5nICE9IG51bGw7XG4gICAgaWYgKGV4aXN0aW5nID09IG51bGwpIHtcbiAgICAgIGV4aXN0aW5nID0ge2g6IE1hdGgucmFuZG9tKCksIHM6IE1hdGgucmFuZG9tKCkgKiAoTUFYX1NBVCAtIE1JTl9TQVQpICsgTUlOX1NBVCwgbDogSU5JVElBTF9MVU19O1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3TCA9IGV4aXN0aW5nLmwgKz0gTFVNX0RFTFRBICogKGR0IC8gMTAwMCk7XG4gICAgICBpZiAoTFVNX0RFTFRBID4gMCAmJiBuZXdMID49IE1BWF9MVU0pIHtcbiAgICAgICAgbmV3TCA9IE1BWF9MVU07XG4gICAgICB9XG4gICAgICBpZiAoTFVNX0RFTFRBIDwgMCAmJiBuZXdMIDw9IE1JTl9MVU0pIHtcbiAgICAgICAgbmV3TCA9IE1JTl9MVU07XG4gICAgICB9XG4gICAgICBleGlzdGluZy5sID0gbmV3TDtcbiAgICB9XG4gICAgaWYgKCFleGlzdGVkKSB7XG4gICAgICBncmlkLnNldChleGlzdGluZywgYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIH1cbiAgICBpZiAoa2VlcCkge1xuICAgICAgbGV0IHBvc2l0aXZlX2RlbHRhID0gTFVNX0RFTFRBID4gMDtcbiAgICAgIGlmICgocG9zaXRpdmVfZGVsdGEgJiYgZXhpc3RpbmcubCA+PSBNQVhfTFVNKSB8fFxuICAgICAgICAgICghcG9zaXRpdmVfZGVsdGEgJiYgZXhpc3RpbmcubCA8PSBNSU5fTFVNKSkge1xuICAgICAgICBleGlzdGluZy5jb2xvciA9IGdldEhzbENlbGxDb2xvcihleGlzdGluZyk7XG4gICAgICAgIGVkZ2VDZWxscy5wdXNoKGFjdGl2ZUNlbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QWN0aXZlQ2VsbHMucHVzaChhY3RpdmVDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYWN0aXZlQ2VsbHMgPSBuZXdBY3RpdmVDZWxscztcbn07XG5cbmxldCByZXByb2R1Y2VDZWxscyA9IGZ1bmN0aW9uKGR0LCB2aWV3UmVjdCk6Ym9vbGVhbiB7XG4gIGxldCByZXR1cm5UcnVlID0gZmFsc2U7XG4gIHdoaWxlICgoYWN0aXZlQ2VsbHMubGVuZ3RoID4gMCB8fCBlZGdlQ2VsbHMubGVuZ3RoID4gMCkgJiYgTWF0aC5yYW5kb20oKSA8PSBSRVBSX1BST0JBQklMSVRZKSB7XG4gICAgLy8gbGV0IGFjdGl2ZUNlbGwgPSB3ZWlnaHRlZFJhbmRvbShhY3RpdmVDZWxscy5jb25jYXQoZWRnZUNlbGxzKSwgKGNlbGwpID0+IHtcbiAgICAvLyAgIGxldCBuZWlnaGJvcnMgPSBncmlkLmdldE5laWdoYm9ycyhjZWxsLngsIGNlbGwueSlcbiAgICAvLyAgICAgICAuZmlsdGVyKChuKSA9PiBncmlkLmdldChuLngsIG4ueSkgPT0gbnVsbCk7XG4gICAgLy8gICByZXR1cm4gbmVpZ2hib3JzLmxlbmd0aDtcbiAgICAvLyB9KTtcbiAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoYWN0aXZlQ2VsbHMubGVuZ3RoICsgZWRnZUNlbGxzLmxlbmd0aCkpO1xuICAgIGxldCBhY3RpdmVDZWxsID0gaW5kZXggPCBhY3RpdmVDZWxscy5sZW5ndGggPyBhY3RpdmVDZWxsc1tpbmRleF0gOiBlZGdlQ2VsbHNbaW5kZXggLSBhY3RpdmVDZWxscy5sZW5ndGhdO1xuICAgIGxldCBleGlzdGluZyA9IGdyaWQuZ2V0KGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55KTtcbiAgICBpZiAoZXhpc3RpbmcgIT0gbnVsbCkge1xuICAgICAgbGV0IG5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhncmlkLCBhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSwgdmlld1JlY3QpO1xuICAgICAgbGV0IG5ld05laWdoYm9yOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xuICAgICAgaWYgKG5laWdoYm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIGxldCBmaWx0ZXJlZE5laWdoYm9yczp7bmVpZ2hib3I6bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSwgd2VpZ2h0Om51bWJlcn1bXSA9IG5laWdoYm9ycy5tYXAoKG5laWdoYm9yKSA9PiB7XG4gICAgICAgIC8vICAgbGV0IG5laWdoYm9yTmVpZ2hib3JzID0gZ3JpZC5nZXROZWlnaGJvcnMobmVpZ2hib3IueCwgbmVpZ2hib3IueSlcbiAgICAgICAgLy8gICAgICAgLmZpbHRlcigobikgPT4gZ3JpZC5nZXQobi54LCBuLnkpID09IG51bGwpO1xuICAgICAgICAvLyAgIHJldHVybiB7XG4gICAgICAgIC8vICAgICBuZWlnaGJvcjogbmVpZ2hib3IsXG4gICAgICAgIC8vICAgICB3ZWlnaHQ6IG5laWdoYm9yTmVpZ2hib3JzLmxlbmd0aFxuICAgICAgICAvLyAgIH07XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBmaWx0ZXJlZE5laWdoYm9ycy5wdXNoKHtuZWlnaGJvcjogbnVsbCwgd2VpZ2h0OiAxMH0pO1xuICAgICAgICAvLyBsZXQgbiA9IHdlaWdodGVkUmFuZG9tKGZpbHRlcmVkTmVpZ2hib3JzLCAobikgPT4gTWF0aC5wb3cobi53ZWlnaHQsIDgpKS5uZWlnaGJvcjtcbiAgICAgICAgLy8gaWYgKG4gPT0gbnVsbCkgY29udGludWU7XG5cbiAgICAgICAgbGV0IG4gPSBuZWlnaGJvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmVpZ2hib3JzLmxlbmd0aCldO1xuICAgICAgICBsZXQgZGVsdGFIdWUgPSAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIEhVRV9DSEFOR0U7XG4gICAgICAgIGxldCBkZWx0YVNhdCA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogU0FUX0NIQU5HRTtcbiAgICAgICAgZ3JpZC5zZXQoe1xuICAgICAgICAgIGg6IG1vZChleGlzdGluZy5oICsgZGVsdGFIdWUsIDEpLFxuICAgICAgICAgIHM6IGNsYW1wKGV4aXN0aW5nLnMgKyBkZWx0YVNhdCwgTUlOX1NBVCwgTUFYX1NBVCksXG4gICAgICAgICAgbDogSU5JVElBTF9MVU1cbiAgICAgICAgfSwgbi54LCBuLnkpO1xuICAgICAgICBuZXdOZWlnaGJvciA9IG47XG4gICAgICB9XG4gICAgICBsZXQgbmVpZ2hib3JDb21wZW5zYXRpb24gPSBuZXdOZWlnaGJvciA9PSBudWxsID8gMCA6IDE7XG4gICAgICBsZXQgZmVydGlsZU5laWdoYm9ycyA9IGdldE5laWdoYm9ycyhncmlkLCBhY3RpdmVDZWxsLngsIGFjdGl2ZUNlbGwueSwgbnVsbCk7XG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCAtIG5laWdoYm9yQ29tcGVuc2F0aW9uICE9PSBmZXJ0aWxlTmVpZ2hib3JzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm5UcnVlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChmZXJ0aWxlTmVpZ2hib3JzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsZXQgZWRnZUluZGV4ID0gZWRnZUNlbGxzLmluZGV4T2YoYWN0aXZlQ2VsbCk7XG4gICAgICAgIGlmIChlZGdlSW5kZXggPj0gMCkge1xuICAgICAgICAvLyBpZiAoaW5kZXggPj0gYWN0aXZlQ2VsbHMubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gZWRnZUNlbGxzLnNwbGljZShpbmRleCAtIGFjdGl2ZUNlbGxzLmxlbmd0aCwgMSk7XG4gICAgICAgICAgZWRnZUNlbGxzLnNwbGljZShlZGdlSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobmV3TmVpZ2hib3IgIT0gbnVsbCkge1xuICAgICAgICBhY3RpdmVDZWxscy5wdXNoKG5ld05laWdoYm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldHVyblRydWU7XG59XG5cblxuXG4vLyBsZXQgdmlld1JlY3QgPSByZW5kZXJlci5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbi8vIHZpZXdSZWN0LmxlZnQgPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpIC0gMTtcbi8vIHZpZXdSZWN0LnRvcCA9IE1hdGguZmxvb3Iodmlld1JlY3QudG9wKSAtIDE7XG4vLyB2aWV3UmVjdC5yaWdodCA9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCkgKyAxO1xuLy8gdmlld1JlY3QuYm90dG9tID0gTWF0aC5jZWlsKHZpZXdSZWN0LmJvdHRvbSkgKyAxO1xuLy8gZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAwOyBpKyspIHtcbi8vIHVwZGF0ZUFjdGl2ZUNlbGxzKDEwMCwgdmlld1JlY3QpXG4vLyB9XG5cbmxldCBsYXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xubG9vcCgoZHQ6bnVtYmVyKSA9PiB7XG4gIGlmIChSRVBSX1BST0JBQklMSVRZIDwgMC45NSkge1xuICAgIFJFUFJfUFJPQkFCSUxJVFkgKz0gZHQgLyAyMDAwMDAwMDAwO1xuICB9XG4gIGlmIChSRVBSX1BST0JBQklMSVRZID4gMC45NSkge1xuICAgIFJFUFJfUFJPQkFCSUxJVFkgPSAwLjk1O1xuICB9XG5cbiAgbGV0IGNhbWVyYUFsdGVyZWQgPSBmYWxzZTtcbiAgaWYgKGRyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgaWYgKGxhc3REcmFnUG9zaXRpb24gIT0gbnVsbCkge1xuICAgICAgaWYgKGRyYWdQb3NpdGlvbi54ICE9PSBsYXN0RHJhZ1Bvc2l0aW9uLnggfHxcbiAgICAgICAgICBkcmFnUG9zaXRpb24ueSAhPT0gbGFzdERyYWdQb3NpdGlvbi55KSB7XG4gICAgICAgIGxldCBzdGFydCA9IGNhbWVyYS51bnRyYW5zZm9ybShsYXN0RHJhZ1Bvc2l0aW9uLngsIGxhc3REcmFnUG9zaXRpb24ueSk7XG4gICAgICAgIGxldCBlbmQgPSBjYW1lcmEudW50cmFuc2Zvcm0oZHJhZ1Bvc2l0aW9uLngsIGRyYWdQb3NpdGlvbi55KTtcbiAgICAgICAgY2FtZXJhLm1vdmUoc3RhcnQueCAtIGVuZC54LCBzdGFydC55IC0gZW5kLnkpO1xuICAgICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdERyYWdQb3NpdGlvbiA9IHt4OiBkcmFnUG9zaXRpb24ueCwgeTogZHJhZ1Bvc2l0aW9uLnl9O1xuICB9IGVsc2UgaWYgKGxhc3REcmFnUG9zaXRpb24gIT0gbnVsbCkge1xuICAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuICB9XG4gIGlmIChrZXlJbnRlcmFjdGl2aXR5LmlzRG93bigxODkpKSB7IC8vIG1pbnVzXG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAqIDEuMSk7XG4gICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gIH1cbiAgaWYgKGtleUludGVyYWN0aXZpdHkuaXNEb3duKDE4NykpIHsgLy8gcGx1c1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgLyAxLjEpO1xuICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgbGV0IHZpZXdSZWN0ID0gcmVuZGVyZXIuZ2V0R3JpZFZpZXdSZWN0KGNhbWVyYSk7XG4gIHZpZXdSZWN0LmxlZnQgPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpIC0gMTtcbiAgdmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbiAgdmlld1JlY3QucmlnaHQgPSBNYXRoLmNlaWwodmlld1JlY3QucmlnaHQpICsgMTtcbiAgdmlld1JlY3QuYm90dG9tID0gTWF0aC5jZWlsKHZpZXdSZWN0LmJvdHRvbSkgKyAxO1xuICAvL2ZvciAobGV0IGkgPSAwOyBpIDwgNTAwOyBpKyspIHtcbiAgdXBkYXRlQWN0aXZlQ2VsbHMoZHQsIHZpZXdSZWN0KTtcbiAgLy8gfVxuICBpZiAoZ3JpZC5nZXRDb3VudCgpIC8gKCh2aWV3UmVjdC5ib3R0b20gLSB2aWV3UmVjdC50b3ApICogKHZpZXdSZWN0LnJpZ2h0IC0gdmlld1JlY3QubGVmdCkpID4gMS4wMDEpIHtcbiAgICBsZXQgY3VycmVudFpvb20gPSBjYW1lcmEuZ2V0Wm9vbSgpO1xuICAgIGlmIChjdXJyZW50Wm9vbSA8IE1JTl9aT09NKSB7XG4gICAgICBjYW1lcmEuc2V0Wm9vbShjdXJyZW50Wm9vbSAqIDIpO1xuICAgICAgY2FtZXJhQWx0ZXJlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgKGFjdGl2ZUNlbGxzLmxlbmd0aCA9PT0gMCAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkgLyAyKSB7XG4gIC8vICAgbGV0IGV4aXN0aW5nOntba2V5OnN0cmluZ106IGJvb2xlYW59ID0ge307XG4gIC8vICAgZ3JpZC5maWx0ZXJlZE1hcCh7eDogdmlld1JlY3QubGVmdCwgeTogdmlld1JlY3QudG9wfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgIHt4OiB2aWV3UmVjdC5yaWdodCwgeTogdmlld1JlY3QuYm90dG9tfSxcbiAgLy8gICAgICAgICAgICAgICAgICAgICh2YWx1ZSwgeCwgeSkgPT4gKGV4aXN0aW5nW3ggKyAnLycgKyB5XSA9IHRydWUpKTtcbiAgLy8gICBsZXQgbm9uRXhpc3Rpbmc6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdO1xuICAvLyAgIGZvciAobGV0IHggPSBNYXRoLmZsb29yKHZpZXdSZWN0LmxlZnQpOyB4IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCk7IHgrKykge1xuICAvLyAgICAgZm9yIChsZXQgeSA9IE1hdGguZmxvb3Iodmlld1JlY3QudG9wKTsgeSA8PSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKTsgeSsrKSB7XG4gIC8vICAgICAgIGlmICghZXhpc3RpbmdbeCArICcvJyArIHldKSB7XG4gIC8vICAgICAgICAgbm9uRXhpc3RpbmcucHVzaCh7eDogeCwgeTogeX0pO1xuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyAgIGFjdGl2ZUNlbGxzLnB1c2gobm9uRXhpc3RpbmdbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm9uRXhpc3RpbmcubGVuZ3RoKV0pO1xuICAvLyB9XG5cbiAgbGV0IG1haW5UcmlhbmdsZVJlbmRlcmVyID0gKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGdldEhzbENlbGxDb2xvcihjZWxsKTtcbiAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAvLyBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgICAvLyBjb250ZXh0LmxpbmVXaWR0aCA9IDAuNTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29udGV4dC5maWxsU3R5bGU7XG4gICAgLy8gY29udGV4dC5zdHJva2UoKTtcbiAgfTtcblxuICBpZiAoY2FtZXJhQWx0ZXJlZCB8fCBkaXJ0eUNhbnZhcykge1xuICAgIGRpcnR5Q2FudmFzID0gZmFsc2U7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xuICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQWxsQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBhY3RpdmVDZWxscywgbWFpblRyaWFuZ2xlUmVuZGVyZXIpO1xuICAgIHJlbmRlcmVyLnJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYSwgZWRnZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gIH1cbiAgcmVwcm9kdWNlQ2VsbHMoZHQsIHZpZXdSZWN0KTtcblxuICAvLyByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIFtob3ZlcmVkXSwgKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgLy8gICBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgLy8gICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAvLyAgIGNvbnRleHQubGluZVdpZHRoID0gMztcbiAgLy8gICBjb250ZXh0LnN0cm9rZSgpO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gIC8vICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIC8vIH0pO1xuXG4gIC8vIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIC8vIGxldCB0aW1lUGFzc2VkID0gbm93VGltZSAtIGxhc3RUaW1lO1xuICAvLyBsYXN0VGltZSA9IG5vd1RpbWU7XG4gIC8vIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gIC8vIGNvbnRleHQuZm9udCA9ICcxNHB4IEFyaWFsJztcbiAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgLy8gY29udGV4dC5saW5lV2lkdGggPSAyO1xuICAvLyBsZXQgb25TY3JlZW5FZGdlID0gMDtcbiAgLy8gZm9yIChsZXQgZWRnZUNlbGwgb2YgZWRnZUNlbGxzKSB7XG4gIC8vICAgaWYgKHZpZXdSZWN0LmxlZnQgPD0gZWRnZUNlbGwueCAmJiBlZGdlQ2VsbC54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gIC8vICAgICAgIHZpZXdSZWN0LnRvcCA8PSBlZGdlQ2VsbC55ICYmIGVkZ2VDZWxsLnkgPD0gdmlld1JlY3QuYm90dG9tKSB7XG4gIC8vICAgICBvblNjcmVlbkVkZ2UrKztcbiAgLy8gICB9XG4gIC8vIH1cbiAgLy8gbGV0IGZwc1RleHQgPSAnRlBTOiAnICsgTWF0aC5yb3VuZCgxMDAwIC8gdGltZVBhc3NlZCkgLy8rICcgIEFjdGl2ZTogJyArIGFjdGl2ZUNlbGxzLmxlbmd0aCArICcgIEVkZ2U6ICcgKyBlZGdlQ2VsbHMubGVuZ3RoICsgJyAgb25zY3JlZW4gJyArIG9uU2NyZWVuRWRnZTtcbiAgLy8gY29udGV4dC5zdHJva2VUZXh0KGZwc1RleHQsIDEwLCAxMCk7XG4gIC8vIGNvbnRleHQuZmlsbFRleHQoZnBzVGV4dCwgMTAsIDEwKTtcbn0sIDApO1xuXG5cbnJldHVybjtcbi8qL1xuXG5cblxuXG5sZXQgdG9vbFNlbGVjdCA9IDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbC1zZWxlY3QnKTtcbmxldCB0b29sU2VsZWN0aW9uID0gJ2RyYXcnO1xubGV0IHNldFRvb2wgPSBmdW5jdGlvbihuZXdUb29sOnN0cmluZykge1xuICAvLyB0b29sU2VsZWN0aW9uID0gbmV3VG9vbDtcbiAgLy8gdG9vbFNlbGVjdC52YWx1ZSA9IG5ld1Rvb2w7XG4gIHdvcmxkLnNlbGVjdFRvb2woPGtleW9mIFRvb2xzQ29sbGVjdGlvbj5uZXdUb29sKTtcbn07XG5pZiAodG9vbFNlbGVjdCAhPSBudWxsKSB7XG4gIHRvb2xTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgc2V0VG9vbCh0b29sU2VsZWN0LnZhbHVlKTtcbiAgfSk7XG59XG5cblxuXG5sZXQgd29ybGQ6V29ybGQgPSBuZXcgV29ybGQoY2FudmFzKTtcbmxldCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmNvbnN0IFZFTE9DSVRZOm51bWJlciA9IDE1O1xuXG5sZXQga2V5cyA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5rZXlzLm1hcCgnbGVmdCcsIDY1KTtcbmtleXMubWFwKCdyaWdodCcsIDY4KTtcbmtleXMubWFwKCd1cCcsIDg3KTtcbmtleXMubWFwKCdkb3duJywgODMpO1xua2V5cy5tYXAoJ3pvb20tb3V0JywgODEpO1xua2V5cy5tYXAoJ3pvb20taW4nLCA2OSk7XG5sb29wKCgpID0+IHtcbiAgLy8gcmVuZGVyRnVsbFRyaWFuZ2xlR3JpZChncmlkLCByZW5kZXJlciwgY29udGV4dCk7XG5cbiAgd29ybGQucmVuZGVyKCk7XG5cbiAgbGV0IGNhbWVyYSA9IHdvcmxkLmdldENhbWVyYSgpO1xuXG4gIGlmIChrZXlzLmlzRG93bignem9vbS1vdXQnKSkge1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgKiAxLjEpO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bignem9vbS1pbicpKSB7XG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gIH1cblxuICBsZXQgZHggPSAwLCBkeSA9IDA7XG4gIGlmIChrZXlzLmlzRG93bignbGVmdCcpKSB7XG4gICAgZHggLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdyaWdodCcpKSB7XG4gICAgZHggKz0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCd1cCcpKSB7XG4gICAgZHkgLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdkb3duJykpIHtcbiAgICBkeSArPSBWRUxPQ0lUWTtcbiAgfVxuXG4gIGR4ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGR5ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGlmIChkeCAhPT0gMCB8fCBkeSAhPT0gMCkge1xuICAgIGNhbWVyYS5tb3ZlKGR4LCBkeSk7XG4gIH1cbn0sIDApO1xuXG4vLyAqL1xufTtcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEtleUludGVyYWN0aXZpdHkge1xuICBwcml2YXRlIGtleXM6e1trZXk6c3RyaW5nXTogYm9vbGVhbn07XG4gIHByaXZhdGUga2V5TWFwOntba2V5OnN0cmluZ106IHN0cmluZ3xudW1iZXJ9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMua2V5cyA9IHt9O1xuICAgIHRoaXMua2V5TWFwID0ge307XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgIGxldCBrZXljb2RlID0gZS5rZXlDb2RlO1xuICAgICAgdGhpcy5rZXlzW2tleWNvZGVdID0gdHJ1ZTtcbiAgICAgIGxldCBuYW1lID0gdGhpcy5rZXlNYXBba2V5Y29kZV07XG4gICAgICBpZiAobmFtZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMua2V5c1tuYW1lXSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgbGV0IGtleWNvZGUgPSBlLmtleUNvZGU7XG4gICAgICBpZiAoa2V5Y29kZSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMua2V5c1trZXljb2RlXTtcbiAgICAgIH1cbiAgICAgIGlmIChrZXljb2RlIGluIHRoaXMua2V5TWFwKSB7XG4gICAgICAgIGxldCBuYW1lID0gdGhpcy5rZXlNYXBba2V5Y29kZV07XG4gICAgICAgIGlmIChuYW1lICE9IG51bGwgJiYgbmFtZSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5rZXlzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBtYXAobmFtZTpzdHJpbmcsIGtleTpzdHJpbmd8bnVtYmVyKSB7XG4gICAgdGhpcy5rZXlNYXBba2V5XSA9IG5hbWU7XG4gIH1cblxuICBpc0Rvd24oa2V5OnN0cmluZ3xudW1iZXIpOmJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMua2V5c1trZXldO1xuICB9XG5cbiAgZ2V0RG93bigpOnN0cmluZ1tdIHtcbiAgICBsZXQga2V5czpzdHJpbmdbXSA9IFtdO1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmtleXMpIHtcbiAgICAgIGlmICh0aGlzLmlzRG93bihrZXkpKSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbiAgfVxufVxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuL2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vdXNlSW50ZXJhY3Rpdml0eSB7XG4gIGV2ZW50czpFdmVudHM7XG5cbiAgcHJpdmF0ZSBlbGVtZW50OkhUTUxFbGVtZW50O1xuICBwcml2YXRlIGRvd246Ym9vbGVhbjtcbiAgcHJpdmF0ZSBwb3NpdGlvbjp7eD86bnVtYmVyLCB5PzpudW1iZXJ9O1xuICBwcml2YXRlIGRyYWdnaW5nOmJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudDpIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHt9O1xuICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZURvd24oZSkpO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZU1vdmUoZSkpO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VVcChlKSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlVXAoe1xuICAgICAgb2Zmc2V0WDogZS5vZmZzZXRYIC0gdGhpcy5lbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICBvZmZzZXRZOiBlLm9mZnNldFkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wfSwgZmFsc2UpKTtcbiAgfVxuXG4gIGlzRG93bigpIHsgcmV0dXJuIHRoaXMuZG93bjsgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VVcChldmVudCwgZXZlbnRzOmJvb2xlYW4gPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuZG93bikge1xuICAgICAgbGV0IHBvc2l0aW9uID0ge3g6IGV2ZW50Lm9mZnNldFgsIHk6IGV2ZW50Lm9mZnNldFl9O1xuICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICBpZiAoZXZlbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1lbmQnLCBwb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnY2xpY2snLCBwb3NpdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMucG9zaXRpb24ueSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlTW92ZShldmVudCkge1xuICAgIGlmICh0aGlzLmRvd24pIHtcbiAgICAgIHRoaXMucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgICB0aGlzLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZO1xuICAgICAgLy8gSWYgdGhlIG1vdXNlIGlzIGRvd24gd2hlbiB3ZSByZWNlaXZlIHRoZSBtb3VzZWRvd24gb3IgbW92ZSBldmVudCwgdGhlblxuICAgICAgLy8gd2UgYXJlIGRyYWdnaW5nLlxuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLXN0YXJ0JywgdGhpcy5wb3NpdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KCdkcmFnLW1vdmUnLCB0aGlzLnBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ldmVudHMuZW1pdCgnaG92ZXInLCB7eDogZXZlbnQub2Zmc2V0WCwgeTogZXZlbnQub2Zmc2V0WX0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlTW91c2VEb3duKGV2ZW50KSB7XG4gICAgdGhpcy5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WDtcbiAgICB0aGlzLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZO1xuICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgdGhpcy5ldmVudHMuZW1pdCgnZG93bicsIHRoaXMucG9zaXRpb24pO1xuICB9XG59XG4iXX0=
