(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.triangles = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        if (max > 0.0) { // NOTE: if Max is == 0, this divide would cause a crash
            out.s = (delta / max);
        }
        else {
            // if max is 0, then r = g = b = 0
            // s = 0, v is undefined
            out.s = 0.0;
            out.h = 0;
            return out;
        }
        if (r >= max) // > is bogus, just keeps compilor happy
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
const params_1 = require("./params");
const maths_1 = require("./maths");
const log_1 = require("./log");
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
const TriangleOptions = window['TriangleOptions'] = {
    interactivity: true
};
const onload = function (canvas) {
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    //* Add/remove a '/' to/from the beginning of this line to switch modes
    let context = canvas.getContext('2d');
    let camera = new camera_1.default(canvasWidth, canvasHeight);
    camera.setZoom(params_1.Params.number('zoom', 1 / 96));
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
    let activeCells = [{ x: 0, y: 0 }];
    let edgeCells = [];
    const INITIAL_LUM = 1;
    const MAX_LUM = 0.7;
    const MIN_LUM = params_1.Params.number('minlum', 0.75);
    const LUM_DELTA = params_1.Params.number('lumdelta', -0.03);
    -0.00005;
    0.0005;
    let REPR_PROBABILITY = params_1.Params.number('repr', 0.005);
    0.1;
    0.20;
    0.0024;
    const HUE_CHANGE = Math.abs(params_1.Params.number('huechange', 0.02));
    const SAT_CHANGE = Math.abs(params_1.Params.number('satchange', 0.05));
    const MIN_SAT = params_1.Params.number('minsat', 0.7);
    const MAX_SAT = params_1.Params.number('maxsat', 1);
    const MIN_ZOOM = params_1.Params.number('minzoom', 1 / 3);
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
        log_1.doevery_seconds('reproduceCells', () => { console.log('Active cells:', activeCells.length); }, 5);
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
                        h: maths_1.mod(existing.h + deltaHue, 1),
                        s: maths_1.clamp(existing.s + deltaSat, MIN_SAT, MAX_SAT),
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
        if (TriangleOptions.interactivity) {
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
            if (keyInteractivity.isDown(189)) { // minus
                camera.setZoom(camera.getZoom() * 1.1);
                cameraAltered = true;
            }
            if (keyInteractivity.isDown(187)) { // plus
                camera.setZoom(camera.getZoom() / 1.1);
                cameraAltered = true;
            }
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
window.onload = function () {
    const tryLoad = function () {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            onload(canvas);
        }
        else {
            setTimeout(tryLoad, 500);
        }
    };
    tryLoad();
};

},{"./camera":1,"./colors":2,"./grid":5,"./grid-view-model":4,"./key-interactivity":7,"./log":8,"./maths":9,"./mouse-interactivity":10,"./params":11}],7:[function(require,module,exports){
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
const map = {};
function doevery_seconds(id, f, seconds) {
    const key = String(id);
    const now = new Date().getTime();
    const then = map[key] || 0;
    if (now - then > seconds * 1000) {
        f();
        map[key] = now;
    }
}
exports.doevery_seconds = doevery_seconds;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = function (n, m) {
    let modded = n % m;
    if (n < 0)
        n += m;
    return n;
};
exports.clamp = function (n, min, max) {
    if (n < min)
        return min;
    if (n > max)
        return max;
    return n;
};

},{}],10:[function(require,module,exports){
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

},{"./events":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Params = Params;

},{}]},{},[6])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhLnRzIiwic3JjL2NvbG9ycy50cyIsInNyYy9ldmVudHMudHMiLCJzcmMvZ3JpZC12aWV3LW1vZGVsLnRzIiwic3JjL2dyaWQudHMiLCJzcmMvaW5kZXgudHMiLCJzcmMva2V5LWludGVyYWN0aXZpdHkudHMiLCJzcmMvbG9nLnRzIiwic3JjL21hdGhzLnRzIiwic3JjL21vdXNlLWludGVyYWN0aXZpdHkudHMiLCJzcmMvcGFyYW1zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtJQU9FLFlBQVksYUFBb0IsRUFBRSxjQUFxQjtRQUNyRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFdBQVc7UUFDVCxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWE7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQWM7UUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElB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QUcsQ0FBQyxDQUFDO0lBQ3JGLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixLQUFLLElBQUksS0FBSyxJQUFJLFNBQVMsRUFBRTtRQUMzQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3JCO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQVhQLHdCQTRCQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbWVyYSB7XG4gIC8vIFdvcmxkLXNwYWNlIGNhbWVyYSBmb2N1cyBwb3NpdGlvbi5cbiAgcHJpdmF0ZSB4Om51bWJlcjtcbiAgcHJpdmF0ZSB5Om51bWJlcjtcbiAgcHJpdmF0ZSB6b29tOm51bWJlcjtcbiAgcHJpdmF0ZSB2aWV3cG9ydDp7d2lkdGg6bnVtYmVyLCBoZWlnaHQ6bnVtYmVyfTtcblxuICBjb25zdHJ1Y3Rvcih2aWV3cG9ydFdpZHRoOm51bWJlciwgdmlld3BvcnRIZWlnaHQ6bnVtYmVyKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHRoaXMuem9vbSA9IDE7XG4gICAgdGhpcy52aWV3cG9ydCA9IHt3aWR0aDogdmlld3BvcnRXaWR0aCwgaGVpZ2h0OiB2aWV3cG9ydEhlaWdodH07XG4gIH1cblxuICBnZXRWaWV3cG9ydCgpIHtcbiAgICByZXR1cm4ge3dpZHRoOiB0aGlzLnZpZXdwb3J0LndpZHRoLCBoZWlnaHQ6IHRoaXMudmlld3BvcnQuaGVpZ2h0fTtcbiAgfVxuXG4gIHJlc2l6ZSh3aWR0aDpudW1iZXIsIGhlaWdodDpudW1iZXIpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICBnZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLnpvb207XG4gIH1cblxuICBzZXRab29tKG5ld1pvb206bnVtYmVyKSB7XG4gICAgdGhpcy56b29tID0gbmV3Wm9vbTtcbiAgfVxuXG4gIG1vdmUoZHg6bnVtYmVyLCBkeTpudW1iZXIpIHtcbiAgICB0aGlzLnggKz0gZHg7XG4gICAgdGhpcy55ICs9IGR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zZm9ybXMgYSB3b3JsZC1zcGFjZSBjb29yZGluYXRlIHRvIGNhbWVyYS1zcGFjZS5cbiAgICovXG4gIHRyYW5zZm9ybSh4Om51bWJlciwgeTpudW1iZXIpOnt4Om51bWJlciwgeTpudW1iZXJ9IHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHggLSB0aGlzLngpIC8gdGhpcy56b29tICsgdGhpcy52aWV3cG9ydC53aWR0aCAvIDIsXG4gICAgICB5OiAoeSAtIHRoaXMueSkgLyB0aGlzLnpvb20gKyB0aGlzLnZpZXdwb3J0LmhlaWdodCAvIDIsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc2Zvcm1zIGEgY29vcmRpbmF0ZSBmcm9tIGNhbWVyYS1zcGFjZSB0byB3b3JsZC1zcGFjZS5cbiAgICovXG4gIHVudHJhbnNmb3JtKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAoeCAtIHRoaXMudmlld3BvcnQud2lkdGggLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueCxcbiAgICAgIHk6ICh5IC0gdGhpcy52aWV3cG9ydC5oZWlnaHQgLyAyKSAqIHRoaXMuem9vbSArIHRoaXMueSxcbiAgICB9O1xuICB9XG59XG4iLCJleHBvcnQgdHlwZSBIc3ZDb2xvciA9IHtoOm51bWJlciwgczpudW1iZXIsIHY6bnVtYmVyfTtcbmV4cG9ydCB0eXBlIFJnYkNvbG9yID0ge3I6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXJ9O1xuXG5sZXQgY29sb3JzID0ge1xuICByYW5kb206IGZ1bmN0aW9uKCkge1xuICAgIGxldCByYW5kb21Db21wb25lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xuICAgIH07XG4gICAgbGV0IHJhbmRvbUNvbXBvbmVudHMgPSBmdW5jdGlvbihuKSB7XG4gICAgICBsZXQgb3V0Om51bWJlcltdID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICBvdXQucHVzaChyYW5kb21Db21wb25lbnQoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG4gICAgcmV0dXJuICdyZ2IoJyArIHJhbmRvbUNvbXBvbmVudHMoMykuam9pbignLCcpICsgJyknO1xuICB9LFxuICByZ2I6IGZ1bmN0aW9uKHI6bnVtYmVyLCBnOm51bWJlciwgYjpudW1iZXIpIHtcbiAgICByZXR1cm4gJ3JnYignICsgW3IsIGcsIGJdLmpvaW4oJywnKSArICcpJztcbiAgfSxcbiAgaGV4VG9SZ2I6IGZ1bmN0aW9uKHN0cjpzdHJpbmcpIHtcbiAgICBzdHIgPSBzdHIuc2xpY2UoMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHI6IHBhcnNlSW50KHN0ci5zbGljZSgwLCAyKSwgMTYpLFxuICAgICAgZzogcGFyc2VJbnQoc3RyLnNsaWNlKDIsIDQpLCAxNiksXG4gICAgICBiOiBwYXJzZUludChzdHIuc2xpY2UoNCwgNiksIDE2KSxcbiAgICB9O1xuICB9LFxuICByZ2JUb0hleDogZnVuY3Rpb24ocjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcikge1xuICAgIHIgPSByfDA7XG4gICAgZyA9IGd8MDtcbiAgICBiID0gYnwwO1xuXG4gICAgaWYgKHIgPCAwKSByID0gMDtcbiAgICBpZiAociA+IDI1NSkgciA9IDI1NTtcbiAgICBpZiAoZyA8IDApIGcgPSAwO1xuICAgIGlmIChnID4gMjU1KSBnID0gMjU1O1xuICAgIGlmIChiIDwgMCkgYiA9IDA7XG4gICAgaWYgKGIgPiAyNTUpIGIgPSAyNTU7XG5cbiAgICBsZXQgcnN0ciA9IHIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChyc3RyLmxlbmd0aCA9PT0gMSkgcnN0ciA9ICcwJyArIHJzdHI7XG4gICAgbGV0IGdzdHIgPSBnLnRvU3RyaW5nKDE2KTtcbiAgICBpZiAoZ3N0ci5sZW5ndGggPT09IDEpIGdzdHIgPSAnMCcgKyBnc3RyO1xuICAgIGxldCBic3RyID0gYi50b1N0cmluZygxNik7XG4gICAgaWYgKGJzdHIubGVuZ3RoID09PSAxKSBic3RyID0gJzAnICsgYnN0cjtcbiAgICByZXR1cm4gWycjJywgcnN0ciwgZ3N0ciwgYnN0cl0uam9pbignJyk7XG4gIH0sXG4gIHJnYlRvSHN2OiBmdW5jdGlvbihyOm51bWJlciwgZzpudW1iZXIsIGI6bnVtYmVyKSB7XG4gICAgLy8gaHN2ICAgICAgICAgb3V0O1xuICAgIC8vIGRvdWJsZSAgICAgIG1pbiwgbWF4LCBkZWx0YTtcbiAgICByID0gciAvIDI1NTtcbiAgICBnID0gZyAvIDI1NTtcbiAgICBiID0gYiAvIDI1NTtcblxuICAgIGxldCBtaW4gPSByICAgIDwgZyA/IHIgICA6IGc7XG4gICAgbWluICAgICA9IG1pbiAgPCBiID8gbWluIDogYjtcblxuICAgIGxldCBtYXggPSByICAgID4gZyA/IHIgICA6IGc7XG4gICAgbWF4ICAgICA9IG1heCAgPiBiID8gbWF4IDogYjtcblxuICAgIGxldCBvdXQgPSB7aDogMCwgczogMCwgdjogMH07XG4gICAgbGV0IHYgPSBtYXg7XG4gICAgbGV0IGRlbHRhID0gbWF4IC0gbWluO1xuICAgIGlmIChkZWx0YSA8IDAuMDAwMDEpXG4gICAge1xuICAgICAgICBvdXQucyA9IDA7XG4gICAgICAgIG91dC5oID0gMDsgLy8gdW5kZWZpbmVkLCBtYXliZSBuYW4/XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGlmKCBtYXggPiAwLjAgKSB7IC8vIE5PVEU6IGlmIE1heCBpcyA9PSAwLCB0aGlzIGRpdmlkZSB3b3VsZCBjYXVzZSBhIGNyYXNoXG4gICAgICAgIG91dC5zID0gKGRlbHRhIC8gbWF4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBtYXggaXMgMCwgdGhlbiByID0gZyA9IGIgPSAwXG4gICAgICAgIC8vIHMgPSAwLCB2IGlzIHVuZGVmaW5lZFxuICAgICAgICBvdXQucyA9IDAuMDtcbiAgICAgICAgb3V0LmggPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpZiggciA+PSBtYXggKSAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vID4gaXMgYm9ndXMsIGp1c3Qga2VlcHMgY29tcGlsb3IgaGFwcHlcbiAgICAgICAgb3V0LmggPSAoZyAtIGIpIC8gZGVsdGE7ICAgICAgICAvLyBiZXR3ZWVuIHllbGxvdyAmIG1hZ2VudGFcbiAgICBlbHNlIGlmKCBnID49IG1heCApXG4gICAgICAgIG91dC5oID0gMi4wICsgKCBiIC0gciApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIGN5YW4gJiB5ZWxsb3dcbiAgICBlbHNlXG4gICAgICAgIG91dC5oID0gNC4wICsgKCByIC0gZyApIC8gZGVsdGE7ICAvLyBiZXR3ZWVuIG1hZ2VudGEgJiBjeWFuXG5cbiAgICBvdXQuaCAqPSA2MC4wOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlZ3JlZXNcblxuICAgIGlmKCBvdXQuaCA8IDAuMCApXG4gICAgICAgIG91dC5oICs9IDM2MC4wO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfSxcbiAgaHN2VG9SZ2I6IGZ1bmN0aW9uKGg6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIpIHtcbiAgICB2YXIgciwgZywgYjtcblxuICAgIGlmKHMgPT0gMCl7XG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcbiAgICB9ZWxzZXtcbiAgICAgICAgdmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpe1xuICAgICAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcbiAgICAgICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG4gICAgICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge3I6IE1hdGgucm91bmQociAqIDI1NSksIGc6IE1hdGgucm91bmQoZyAqIDI1NSksIGI6IE1hdGgucm91bmQoYiAqIDI1NSl9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb2xvcnM7XG4iLCJ0eXBlIEhhbmRsZXIgPSAoLi4uYXJnczphbnlbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRzIHtcbiAgcHJpdmF0ZSBoYW5kbGVyczp7W2tleTpzdHJpbmddOkFycmF5PEhhbmRsZXI+fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gIH1cblxuICBsaXN0ZW4oZXZlbnRzOnN0cmluZ3xBcnJheTxzdHJpbmc+LCBoYW5kbGVyOkhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGV2ZW50cyA9IFtldmVudHNdO1xuICAgIH1cbiAgICBmb3IgKGxldCBldmVudCBvZiBldmVudHMpIHtcbiAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuaGFuZGxlcnMpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlcnNbZXZlbnRdID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOmFueVtdKSB7XG4gICAgbGV0IGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF07XG4gICAgaWYgKGhhbmRsZXJzICE9IG51bGwpIHtcbiAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgaGFuZGxlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBDYW1lcmEgZnJvbSAnLi9jYW1lcmEnO1xuaW1wb3J0IEdyaWQgZnJvbSAnLi9ncmlkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZFZpZXdNb2RlbDxUPiB7XG4gIHByaXZhdGUgZ3JpZDpHcmlkPFQ+O1xuXG4gIGNvbnN0cnVjdG9yKGdyaWQ6R3JpZDxUPikge1xuICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gIH1cblxuICBzY3JlZW5Ub0dyaWRDb29yZChjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIpIHtcbiAgICBsZXQgY2VsbFNpemUgPSAxO1xuICAgIGxldCBjZWxsSGVpZ2h0ID0gY2VsbFNpemU7XG4gICAgbGV0IGhhbGZDZWxsSGVpZ2h0ID0gY2VsbEhlaWdodCAvIDI7XG4gICAgbGV0IGNlbGxXaWR0aCA9IE1hdGguc3FydChjZWxsSGVpZ2h0ICogY2VsbEhlaWdodCAtIGhhbGZDZWxsSGVpZ2h0ICogaGFsZkNlbGxIZWlnaHQpO1xuXG4gICAgbGV0IHdvcmxkU3BhY2UgPSBjYW1lcmEudW50cmFuc2Zvcm0oeCwgeSk7XG4gICAgeCA9IHdvcmxkU3BhY2UueDtcbiAgICB5ID0gd29ybGRTcGFjZS55O1xuXG4gICAgbGV0IGdyaWRYID0geCAvIGNlbGxXaWR0aDtcbiAgICBsZXQgZmxvb3JHcmlkWCA9IE1hdGguZmxvb3IoZ3JpZFgpO1xuICAgIGxldCByZW1haW5kZXJYID0gZ3JpZFggLSBmbG9vckdyaWRYO1xuXG4gICAgbGV0IGdyaWRZID0geSAvIGNlbGxIZWlnaHQgKiAyICsgMSAtIGdyaWRYO1xuICAgIGxldCBmbG9vcmVkR3JpZFkgPSBNYXRoLmZsb29yKGdyaWRZIC8gMikgKiAyO1xuXG4gICAgbGV0IHJlbWFpbmRlclkgPSAoZ3JpZFkgLSBmbG9vcmVkR3JpZFkpIC8gMjtcbiAgICBncmlkWSA9IGZsb29yZWRHcmlkWTtcbiAgICBpZiAocmVtYWluZGVyWSA+IDEgLSByZW1haW5kZXJYKSB7XG4gICAgICBncmlkWSArPSAxO1xuICAgIH1cbiAgICBpZiAoZmxvb3JHcmlkWCAlIDIgIT09IDApIHtcbiAgICAgIGdyaWRZICs9IDE7XG4gICAgfVxuXG4gICAgbGV0IGJpQ29sdW1uID0gTWF0aC5mbG9vcihmbG9vckdyaWRYIC8gMik7XG4gICAgZ3JpZFkgKz0gYmlDb2x1bW4gKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGdyaWRYLFxuICAgICAgeTogZ3JpZFksXG4gICAgfTtcbiAgfVxuXG4gIGdldEdyaWRWaWV3UmVjdChjYW1lcmE6Q2FtZXJhKTp7bGVmdDpudW1iZXIsIHRvcDpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDpudW1iZXIsIGJvdHRvbTpudW1iZXJ9IHtcbiAgICBsZXQgdmlld3BvcnQgPSBjYW1lcmEuZ2V0Vmlld3BvcnQoKTtcbiAgICBsZXQge3dpZHRoLCBoZWlnaHR9ID0gdmlld3BvcnQ7XG4gICAgbGV0IHRvcExlZnQgPSB0aGlzLnNjcmVlblRvR3JpZENvb3JkKGNhbWVyYSwgMCwgMCk7XG4gICAgbGV0IGJvdHRvbVJpZ2h0ID0gdGhpcy5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIHdpZHRoLCBoZWlnaHQpO1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0b3BMZWZ0LngsIHRvcDogdG9wTGVmdC55LFxuICAgICAgcmlnaHQ6IGJvdHRvbVJpZ2h0LngsIGJvdHRvbTogYm90dG9tUmlnaHQueVxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclRyaWFuZ2xlKGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjYW1lcmE6Q2FtZXJhLCB4Om51bWJlciwgeTpudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgdDpUfG51bGwsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBsZXQgdHJpYW5nbGVQYXRoID0gZnVuY3Rpb24oXG4gICAgICAgIHgxOm51bWJlciwgeTE6bnVtYmVyLCB4MjpudW1iZXIsIHkyOm51bWJlciwgeDM6bnVtYmVyLCB5MzpudW1iZXIpIHtcbiAgICAgIGxldCBwMSA9IGNhbWVyYS50cmFuc2Zvcm0oeDEsIHkxKTtcbiAgICAgIGxldCBwMiA9IGNhbWVyYS50cmFuc2Zvcm0oeDIsIHkyKTtcbiAgICAgIGxldCBwMyA9IGNhbWVyYS50cmFuc2Zvcm0oeDMsIHkzKTtcbiAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICBjb250ZXh0Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICAgIGNvbnRleHQubGluZVRvKHAyLngsIHAyLnkpO1xuICAgICAgY29udGV4dC5saW5lVG8ocDMueCwgcDMueSk7XG4gICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH07XG4gICAgbGV0IGNlbGxIZWlnaHQgPSAxO1xuICAgIGxldCBoYWxmQ2VsbEhlaWdodCA9IGNlbGxIZWlnaHQgLyAyO1xuICAgIGxldCBjZWxsV2lkdGggPSBNYXRoLnNxcnQoY2VsbEhlaWdodCAqIGNlbGxIZWlnaHQgLSBoYWxmQ2VsbEhlaWdodCAqIGhhbGZDZWxsSGVpZ2h0KTtcbiAgICBsZXQgeHggPSB4O1xuICAgIGxldCB5eSA9IHkgLyAyIC0gLjU7XG4gICAgbGV0IGxlZnRUcmlhbmdsZSA9IHggJSAyICE9PSAwO1xuICAgIGlmICh5ICUgMiAhPT0gMCkge1xuICAgICAgICBsZWZ0VHJpYW5nbGUgPSAhbGVmdFRyaWFuZ2xlO1xuICAgIH1cbiAgICBpZiAobGVmdFRyaWFuZ2xlKSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAoeXkrLjUpICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICB5eSAgICAgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICh4eCsxKSAqIGNlbGxXaWR0aCwgKHl5KzEpICAqIGNlbGxIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlhbmdsZVBhdGgoIHh4ICAgICogY2VsbFdpZHRoLCAgeXkgICAgICogY2VsbEhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAoeHgrMSkgKiBjZWxsV2lkdGgsICh5eSsuNSkgKiBjZWxsSGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgIHh4ICogY2VsbFdpZHRoLCAgICAgKHl5KzEpICogY2VsbEhlaWdodCk7XG4gICAgfVxuICAgIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZC5nZXQoeCwgeSk7XG4gICAgZHJhd1RyaWFuZ2xlKGNvbnRleHQsIHZhbHVlLCB4LCB5KTtcbiAgfVxuXG4gIHJlbmRlckNlbGxzKGNvbnRleHQsIGNhbWVyYTpDYW1lcmEsIGNlbGxzOkFycmF5PHt4Om51bWJlciwgeTpudW1iZXJ9PixcbiAgICAgICAgICAgICAgZHJhd1RyaWFuZ2xlOihjb250ZXh0LCB0OlQsIHg6bnVtYmVyLCB5Om51bWJlcik9PnZvaWQpIHtcbiAgICBmb3IgKGxldCBjb29yZCBvZiBjZWxscykge1xuICAgICAgdGhpcy5yZW5kZXJUcmlhbmdsZShjb250ZXh0LCBjYW1lcmEsIGNvb3JkLngsIGNvb3JkLnksIGRyYXdUcmlhbmdsZSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQWxsQ2VsbHMoY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGNhbWVyYTpDYW1lcmEsXG4gICAgICAgICAgICAgICAgIGRyYXdUcmlhbmdsZTooY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdDpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgLy8gY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICBsZXQgdmlzaWJsZVJlY3QgPSB0aGlzLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuICAgIHRoaXMuZ3JpZC5maWx0ZXJlZE1hcChcbiAgICAgICAge3g6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QubGVmdCksIHk6IE1hdGguZmxvb3IodmlzaWJsZVJlY3QudG9wKX0sXG4gICAgICAgIHt4OiBNYXRoLmNlaWwodmlzaWJsZVJlY3QucmlnaHQgKyAxKSwgeTogTWF0aC5jZWlsKHZpc2libGVSZWN0LmJvdHRvbSArIDEpfSxcbiAgICAgICAgKHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpKTtcbiAgICAvLyB0aGlzLmdyaWQubWFwKCh2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHtcbiAgICAvLyAgIHRoaXMucmVuZGVyVHJpYW5nbGUoY29udGV4dCwgY2FtZXJhLCB4LCB5LCBkcmF3VHJpYW5nbGUpO1xuICAgIC8vIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcblxuaW1wb3J0IGNvb3JkcyBmcm9tICcuL2Nvb3Jkcyc7XG5cblxuY29uc3QgQ09PUkRfSU5ERVg6e1trZXk6bnVtYmVyXTp7W2tleTpudW1iZXJdOiBzdHJpbmd9fSA9IHt9O1xuXG5cbmNvbnN0IENIVU5LX1NJWkUgPSA2NDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZDxUPiB7XG4gIHByaXZhdGUgY291bnQ6bnVtYmVyO1xuICBwcml2YXRlIGdyaWQ6e1trZXk6c3RyaW5nXToge2Nvb3JkOiB7eDpudW1iZXIsIHk6bnVtYmVyfSwgdmFsdWU6IFR9fTtcbiAgcHJpdmF0ZSBjaHVua3M6e1trZXk6c3RyaW5nXToge1xuICAgIGNvb3JkOnt4Om51bWJlciwgeTpudW1iZXJ9LFxuICAgIGNvdW50Om51bWJlcixcbiAgICBkYXRhOntba2V5OnN0cmluZ106IHtjb29yZDoge3g6bnVtYmVyLCB5Om51bWJlcn0sIHZhbHVlOiBUfX19fTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmdyaWQgPSB7fTtcbiAgICB0aGlzLmNodW5rcyA9IHt9O1xuICB9XG5cbiAgZ2V0Q291bnQoKSB7IHJldHVybiB0aGlzLmNvdW50OyB9XG5cbiAgcHJpdmF0ZSBnZXRLZXkoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgeCA9IHh8MDtcbiAgICB5ID0geXwwO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbeCwgeV0pO1xuICAgIC8vIGxldCBhID0gQ09PUkRfSU5ERVhbeF07XG4gICAgLy8gaWYgKGEgIT0gbnVsbCkge1xuICAgIC8vICAgbGV0IGIgPSBhW3ldO1xuICAgIC8vICAgaWYgKGIgIT0gbnVsbCkge1xuICAgIC8vICAgICByZXR1cm4gYjtcbiAgICAvLyAgIH1cbiAgICAvLyB9XG4gICAgLy8gbGV0IHJlc3VsdCA9IHggKyAnLycgKyB5Oy8vW3gsIHldLmpvaW4oJy8nKTtcbiAgICAvLyBpZiAoISh4IGluIENPT1JEX0lOREVYKSkge1xuICAgIC8vICAgQ09PUkRfSU5ERVhbeF0gPSB7fTtcbiAgICAvLyB9XG4gICAgLy8gcmV0dXJuIENPT1JEX0lOREVYW3hdW3ldID0gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDaHVua0Nvb3JkKHg6bnVtYmVyLCB5Om51bWJlcik6e3g6bnVtYmVyLCB5Om51bWJlcn0ge1xuICAgIHJldHVybiB7eDogTWF0aC5mbG9vcih4IC8gQ0hVTktfU0laRSksXG4gICAgICAgICAgICB5OiBNYXRoLmZsb29yKHkgLyBDSFVOS19TSVpFKX1cbiAgfVxuXG4gIGdldCh4Om51bWJlciwgeTpudW1iZXIpOlR8bnVsbCB7XG4gICAgbGV0IGNodW5rQ29vcmQgPSB0aGlzLmdldENodW5rQ29vcmQoeCwgeSk7XG4gICAgbGV0IGNodW5rS2V5ID0gdGhpcy5nZXRLZXkoY2h1bmtDb29yZC54LCBjaHVua0Nvb3JkLnkpO1xuICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICBpZiAoY2h1bmsgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgbGV0IGNlbGwgPSBjaHVuay5kYXRhW3RoaXMuZ2V0S2V5KHgsIHkpXTtcbiAgICByZXR1cm4gY2VsbCAmJiBjZWxsLnZhbHVlO1xuICAgIC8vIGxldCB2YWx1ZSA9IHRoaXMuZ3JpZFt0aGlzLmdldEtleSh4LCB5KV07XG4gICAgLy8gcmV0dXJuIHZhbHVlICYmIHZhbHVlLnZhbHVlO1xuICB9XG5cbiAgc2V0KHZhbHVlOlR8bnVsbCwgeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgLy8gbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIC8vIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgLy8gICBpZiAoa2V5IGluIHRoaXMuZ3JpZCkge1xuICAgIC8vICAgICBkZWxldGUgdGhpcy5ncmlkW2tleV07XG4gICAgLy8gICB9XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMuZ3JpZFtrZXldID0ge2Nvb3JkOnt4LCB5fSwgdmFsdWU6IHZhbHVlfTtcbiAgICAvLyB9XG4gICAgbGV0IGtleSA9IHRoaXMuZ2V0S2V5KHgsIHkpO1xuICAgIGxldCBjaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKHgsIHkpO1xuICAgIGxldCBjaHVua0tleSA9IHRoaXMuZ2V0S2V5KGNodW5rQ29vcmQueCwgY2h1bmtDb29yZC55KTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgaWYgKCEoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpKSB7XG4gICAgICAgIHRoaXMuY2h1bmtzW2NodW5rS2V5XSA9IHtjb29yZDogY2h1bmtDb29yZCwgY291bnQ6IDAsIGRhdGE6IHt9fTtcbiAgICAgIH1cbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGlmICghKGtleSBpbiBjaHVuay5kYXRhKSkge1xuICAgICAgICBjaHVuay5jb3VudCsrO1xuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICB9XG4gICAgICBjaHVuay5kYXRhW2tleV0gPSB7Y29vcmQ6e3gsIHl9LCB2YWx1ZTogdmFsdWV9O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgICAgbGV0IGNodW5rID0gdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICBpZiAoa2V5IGluIGNodW5rLmRhdGEpIHtcbiAgICAgICAgICBjaHVuay5jb3VudC0tO1xuICAgICAgICAgIHRoaXMuY291bnQtLTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2h1bmsuY291bnQgPiAwKSB7XG4gICAgICAgICAgZGVsZXRlIGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5jaHVua3NbY2h1bmtLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAvLyBpZiAodmFsdWUgPT0gbnVsbClcbiAgfVxuXG4gIG1hcChmOih2YWx1ZTpULCB4Om51bWJlciwgeTpudW1iZXIpID0+IHZvaWQpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyZWRNYXAobWluOnt4Om51bWJlciwgeTpudW1iZXJ9LCBtYXg6e3g6bnVtYmVyLCB5Om51bWJlcn0sXG4gICAgICAgICAgICAgIGY6KHZhbHVlOlQsIHg6bnVtYmVyLCB5Om51bWJlcikgPT4gdm9pZCkge1xuICAgIC8vIFRPRE86IEluZGV4IHRoZSBncmlkIG9yIHNvbWV0aGluZy4gSXQncyBwcmV0dHkgaW5lZmZpY2llbnQuXG4gICAgbGV0IHN0YXJ0Q2h1bmtDb29yZCA9IHRoaXMuZ2V0Q2h1bmtDb29yZChtaW4ueCwgbWluLnkpO1xuICAgIGxldCBlbmRDaHVua0Nvb3JkID0gdGhpcy5nZXRDaHVua0Nvb3JkKG1heC54LCBtYXgueSk7XG4gICAgZW5kQ2h1bmtDb29yZC54Kys7XG4gICAgZW5kQ2h1bmtDb29yZC55Kys7XG4gICAgZm9yIChsZXQgY2h1bmtLZXkgaW4gdGhpcy5jaHVua3MpIHtcbiAgICAgIGxldCBjaHVuayA9IHRoaXMuY2h1bmtzW2NodW5rS2V5XTtcbiAgICAgIGxldCBjaHVua0Nvb3JkID0gY2h1bmsuY29vcmQ7XG4gICAgICBpZiAoc3RhcnRDaHVua0Nvb3JkLnggPD0gY2h1bmtDb29yZC54ICYmIGNodW5rQ29vcmQueCA8PSBlbmRDaHVua0Nvb3JkLnggJiZcbiAgICAgICAgICBzdGFydENodW5rQ29vcmQueSA8PSBjaHVua0Nvb3JkLnkgJiYgY2h1bmtDb29yZC55IDw9IGVuZENodW5rQ29vcmQueSkge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gY2h1bmsuZGF0YSkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IGNodW5rLmRhdGFba2V5XTtcbiAgICAgICAgICBsZXQgY29vcmQgPSB2YWx1ZS5jb29yZDtcbiAgICAgICAgICBpZiAobWluLnggPD0gY29vcmQueCAmJiBjb29yZC54IDwgbWF4LnggJiZcbiAgICAgICAgICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAgICAgICAgIGYodmFsdWUudmFsdWUsIGNvb3JkLngsIGNvb3JkLnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBmb3IgKGxldCBrZXkgaW4gdGhpcy5ncmlkKSB7XG4gICAgLy8gICBsZXQgdmFsdWUgPSB0aGlzLmdyaWRba2V5XTtcbiAgICAvLyAgIGxldCBjb29yZCA9IHZhbHVlLmNvb3JkO1xuICAgIC8vICAgaWYgKG1pbi54IDw9IGNvb3JkLnggJiYgY29vcmQueCA8IG1heC54ICYmXG4gICAgLy8gICAgICAgbWluLnkgPD0gY29vcmQueSAmJiBjb29yZC55IDwgbWF4LnkpIHtcbiAgICAvLyAgICAgZih2YWx1ZS52YWx1ZSwgY29vcmQueCwgY29vcmQueSk7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gIH1cblxuICBnZXREaXJlY3ROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbZGMoMCwgLTEpLCBkYygwLCAxKV07XG4gICAgaWYgKE1hdGguYWJzKHggJSAyKSA9PT0gTWF0aC5hYnMoeSAlIDIpKSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAwKSk7XG4gICAgfVxuICAgIHJldHVybiBuZWlnaGJvcnM7XG4gIH1cblxuICBnZXROZWlnaGJvcnMoeDpudW1iZXIsIHk6bnVtYmVyKSB7XG4gICAgbGV0IGRjID0gKGR4Om51bWJlciwgZHk6bnVtYmVyKSA9PiB7cmV0dXJuIHt4OiB4ICsgZHgsIHk6IHkgKyBkeX19O1xuICAgIGxldCBuZWlnaGJvcnMgPSBbXG4gICAgICBkYygtMSwgMCksIGRjKC0xLCAtMSksIGRjKDAsIC0xKSxcbiAgICAgIGRjKDEsIC0xKSwgZGMoMSwgMCksIGRjKDEsIDEpLFxuICAgICAgZGMoMCwgMSksIGRjKC0xLCAxKSxcbiAgICAgIGRjKDAsIC0yKSwgZGMoMCwgMilcbiAgICBdO1xuICAgIGlmIChNYXRoLmFicyh4ICUgMikgPT09IE1hdGguYWJzKHkgJSAyKSkge1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoLTEsIC0yKSk7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygtMSwgMikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZWlnaGJvcnMucHVzaChkYygxLCAtMikpO1xuICAgICAgbmVpZ2hib3JzLnB1c2goZGMoMSwgMikpO1xuICAgIH1cbiAgICByZXR1cm4gbmVpZ2hib3JzO1xuICB9XG59XG4iLCJpbXBvcnQgQ2FtZXJhIGZyb20gJy4vY2FtZXJhJztcbmltcG9ydCBDb2xvclNlbGVjdENvbXBvbmVudCBmcm9tICcuL2NvbG9yLXNlbGVjdCc7XG5pbXBvcnQgR3JpZCBmcm9tICcuL2dyaWQnO1xuaW1wb3J0IEdyaWRWaWV3TW9kZWwgZnJvbSAnLi9ncmlkLXZpZXctbW9kZWwnO1xuaW1wb3J0IEtleUludGVyYWN0aXZpdHkgZnJvbSAnLi9rZXktaW50ZXJhY3Rpdml0eSc7XG5pbXBvcnQgTW91c2VJbnRlcmFjdGl2aXR5IGZyb20gJy4vbW91c2UtaW50ZXJhY3Rpdml0eSc7XG5cbmltcG9ydCBXb3JsZCBmcm9tICcuL3dvcmxkJztcbmltcG9ydCB7IFRvb2xzQ29sbGVjdGlvbiB9IGZyb20gJy4vdG9vbHMnO1xuXG5pbXBvcnQgY29sb3JzIGZyb20gJy4vY29sb3JzJztcblxuaW1wb3J0IHsgUGFyYW1zIH0gZnJvbSAnLi9wYXJhbXMnO1xuXG5pbXBvcnQgeyB3ZWlnaHRlZFJhbmRvbSB9IGZyb20gJy4vcmFuZG9tcyc7XG5pbXBvcnQgeyBtb2QsIGNsYW1wIH0gZnJvbSAnLi9tYXRocyc7XG5pbXBvcnQgeyBkb2V2ZXJ5X3NlY29uZHMgfSBmcm9tJy4vbG9nJztcblxubGV0IHNldFN0YXR1cyA9IGZ1bmN0aW9uKHN0YXR1cykge1xuICBsZXQgc3RhdHVzRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpO1xuICBpZiAoc3RhdHVzRGl2ICE9IG51bGwpIHtcbiAgICBzdGF0dXNEaXYudGV4dENvbnRlbnQgPSBzdGF0dXM7XG4gIH1cbn07XG5cblxubGV0IGxvb3AgPSBmdW5jdGlvbihmLCBkdCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKGR0KSA9PiBsb29wKGYsIGR0KSk7XG4gIGYoZHQpO1xufTtcblxuXG50eXBlIENlbGxUeXBlID0gc3RyaW5nO1xuXG5jb25zdCBUcmlhbmdsZU9wdGlvbnMgPSB3aW5kb3dbJ1RyaWFuZ2xlT3B0aW9ucyddID0ge1xuICBpbnRlcmFjdGl2aXR5OiB0cnVlXG59O1xuXG5jb25zdCBvbmxvYWQgPSBmdW5jdGlvbihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG5cblxubGV0IGNhbnZhc1dpZHRoOm51bWJlciA9IGNhbnZhcy53aWR0aDtcbmxldCBjYW52YXNIZWlnaHQ6bnVtYmVyID0gY2FudmFzLmhlaWdodDtcblxuXG4vLyogQWRkL3JlbW92ZSBhICcvJyB0by9mcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhpcyBsaW5lIHRvIHN3aXRjaCBtb2Rlc1xuXG5sZXQgY29udGV4dDpDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5sZXQgY2FtZXJhID0gbmV3IENhbWVyYShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbmNhbWVyYS5zZXRab29tKFBhcmFtcy5udW1iZXIoJ3pvb20nLCAxLzk2KSk7XG5cblxudHlwZSBIU0xDZWxsID0ge2g6bnVtYmVyLCBzOm51bWJlciwgbDpudW1iZXIsIGNvbG9yPzpzdHJpbmd9O1xubGV0IGdyaWQ6R3JpZDxIU0xDZWxsPiA9IG5ldyBHcmlkPEhTTENlbGw+KCk7XG5sZXQgcmVuZGVyZXI6R3JpZFZpZXdNb2RlbDxIU0xDZWxsPiA9IG5ldyBHcmlkVmlld01vZGVsPEhTTENlbGw+KGdyaWQpO1xuXG5cbmxldCBkaXJ0eUNhbnZhcyA9IGZhbHNlO1xuXG5cbmxldCByZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgY2FudmFzLndpZHRoID0gY2FudmFzV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY2FudmFzLmhlaWdodCA9IGNhbnZhc0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KTtcbiAgZGlydHlDYW52YXMgPSB0cnVlO1xufTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgcmVzaXplKTtcbnJlc2l6ZSgpO1xuXG5sZXQgZ2V0SHNsQ2VsbENvbG9yID0gZnVuY3Rpb24oY2VsbDpIU0xDZWxsKTpzdHJpbmcge1xuICBsZXQgY29sb3IgPSBjZWxsLmNvbG9yO1xuICBpZiAoY29sb3IgPT0gbnVsbCkge1xuICAgIGxldCByZ2IgPSBjb2xvcnMuaHN2VG9SZ2IoY2VsbC5oLCBjZWxsLnMsIGNlbGwubCk7XG4gICAgY29sb3IgPSBjb2xvcnMucmdiVG9IZXgocmdiLnIsIHJnYi5nLCByZ2IuYik7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufTtcblxubGV0IGFjdGl2ZUNlbGxzOnt4Om51bWJlciwgeTpudW1iZXJ9W10gPSBbe3g6IDAsIHk6IDB9XTtcbmxldCBlZGdlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdXG5cbmNvbnN0IElOSVRJQUxfTFVNID0gMTtcbmNvbnN0IE1BWF9MVU0gPSAwLjc7XG5jb25zdCBNSU5fTFVNID0gUGFyYW1zLm51bWJlcignbWlubHVtJywgMC43NSk7XG5jb25zdCBMVU1fREVMVEEgPSBQYXJhbXMubnVtYmVyKCdsdW1kZWx0YScsIC0wLjAzKTstMC4wMDAwNTswLjAwMDU7XG5sZXQgUkVQUl9QUk9CQUJJTElUWSA9IFBhcmFtcy5udW1iZXIoJ3JlcHInLCAwLjAwNSk7MC4xOzAuMjA7MC4wMDI0O1xuY29uc3QgSFVFX0NIQU5HRSA9IE1hdGguYWJzKFBhcmFtcy5udW1iZXIoJ2h1ZWNoYW5nZScsIDAuMDIpKTtcbmNvbnN0IFNBVF9DSEFOR0UgPSBNYXRoLmFicyhQYXJhbXMubnVtYmVyKCdzYXRjaGFuZ2UnLCAwLjA1KSk7XG5jb25zdCBNSU5fU0FUID0gUGFyYW1zLm51bWJlcignbWluc2F0JywgMC43KTtcbmNvbnN0IE1BWF9TQVQgPSBQYXJhbXMubnVtYmVyKCdtYXhzYXQnLCAxKTtcbmNvbnN0IE1JTl9aT09NID0gUGFyYW1zLm51bWJlcignbWluem9vbScsIDEvMyk7XG5cbmxldCBnZXROZWlnaGJvcnMgPSBmdW5jdGlvbihncmlkLCB4LCB5LCB2aWV3UmVjdCkge1xuICBsZXQgbmVpZ2hib3JzID0gZ3JpZC5nZXREaXJlY3ROZWlnaGJvcnMoeCwgeSk7XG4gIG5laWdoYm9ycyA9IG5laWdoYm9ycy5maWx0ZXIoXG4gICAgICAodmFsdWU6e3g6bnVtYmVyLCB5Om51bWJlcn0pID0+IGdyaWQuZ2V0KHZhbHVlLngsIHZhbHVlLnkpID09IG51bGwpO1xuICBpZiAodmlld1JlY3QgIT0gbnVsbCkge1xuICAgIG5laWdoYm9ycyA9IG5laWdoYm9ycy5maWx0ZXIoXG4gICAgICAodmFsdWU6e3g6bnVtYmVyLCB5Om51bWJlcn0pID0+IChcbiAgICAgICAgICB2aWV3UmVjdC5sZWZ0IDw9IHZhbHVlLnggJiYgdmFsdWUueCA8PSB2aWV3UmVjdC5yaWdodCAmJlxuICAgICAgICAgIHZpZXdSZWN0LnRvcCA8PSB2YWx1ZS55ICYmIHZhbHVlLnkgPD0gdmlld1JlY3QuYm90dG9tKSk7XG4gIH1cbiAgcmV0dXJuIG5laWdoYm9ycztcbn07XG5cblxubGV0IGtleUludGVyYWN0aXZpdHkgPSBuZXcgS2V5SW50ZXJhY3Rpdml0eSgpO1xuXG5cbmxldCBpbnRlcmFjdGl2aXR5ID0gbmV3IE1vdXNlSW50ZXJhY3Rpdml0eShjYW52YXMpO1xubGV0IGRyYWdQb3NpdGlvbjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9ID0gbnVsbDtcbmxldCBsYXN0RHJhZ1Bvc2l0aW9uOm51bGx8e3g6bnVtYmVyLCB5Om51bWJlcn0gPSBudWxsO1xuXG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oJ2RyYWctc3RhcnQnLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBpZiAocG9zaXRpb24ueCA9PSBudWxsIHx8IHBvc2l0aW9uLnkgPT0gbnVsbCkge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IG51bGw7XG4vLyAgIH0gZWxzZSB7XG4vLyAgICAgZHJhZ1Bvc2l0aW9uID0ge3g6IHBvc2l0aW9uLngsIHk6IHBvc2l0aW9uLnl9O1xuLy8gICB9XG4vLyB9KTtcbi8vIGludGVyYWN0aXZpdHkuZXZlbnRzLmxpc3RlbignZHJhZy1tb3ZlJywgZnVuY3Rpb24ocG9zaXRpb24pIHtcbi8vICAgaWYgKHBvc2l0aW9uLnggPT0gbnVsbCB8fCBwb3NpdGlvbi55ID09IG51bGwpIHtcbi8vICAgICBkcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIGRyYWdQb3NpdGlvbiA9IHt4OiBwb3NpdGlvbi54LCB5OiBwb3NpdGlvbi55fTtcbi8vICAgfVxuLy8gfSk7XG4vLyBpbnRlcmFjdGl2aXR5LmV2ZW50cy5saXN0ZW4oWydkcmFnLWVuZCcsICdjbGljayddLCBmdW5jdGlvbihwb3NpdGlvbikge1xuLy8gICBkcmFnUG9zaXRpb24gPSBudWxsO1xuLy8gICBsYXN0RHJhZ1Bvc2l0aW9uID0gbnVsbDtcbi8vIH0pO1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdjbGljaycsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGNvbnNvbGUubG9nKGdldE5laWdoYm9ycyhncmlkLCBob3ZlcmVkLngsIGhvdmVyZWQueSwgbnVsbCkpO1xuLy8gfSk7XG5cbi8vIGxldCBob3ZlcmVkID0ge3g6IDAsIHk6IDB9O1xuLy8gaW50ZXJhY3Rpdml0eS5ldmVudHMubGlzdGVuKCdob3ZlcicsIGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4vLyAgIGxldCBncmlkQ29vcmQgPSByZW5kZXJlci5zY3JlZW5Ub0dyaWRDb29yZChjYW1lcmEsIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuLy8gICBob3ZlcmVkLnggPSBNYXRoLmZsb29yKGdyaWRDb29yZC54KTtcbi8vICAgaG92ZXJlZC55ID0gTWF0aC5mbG9vcihncmlkQ29vcmQueSk7XG4vLyB9KTtcblxuXG5sZXQgdXBkYXRlQWN0aXZlQ2VsbHMgPSBmdW5jdGlvbihkdCwgdmlld1JlY3QpOnZvaWQge1xuICBsZXQgbmV3QWN0aXZlQ2VsbHM6e3g6bnVtYmVyLCB5Om51bWJlcn1bXSA9IFtdO1xuICBmb3IgKGxldCBhY3RpdmVDZWxsIG9mIGFjdGl2ZUNlbGxzKSB7XG4gICAgbGV0IGtlZXAgPSB0cnVlO1xuICAgIGxldCBleGlzdGluZyA9IGdyaWQuZ2V0KGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55KTtcbiAgICBsZXQgZXhpc3RlZCA9IGV4aXN0aW5nICE9IG51bGw7XG4gICAgaWYgKGV4aXN0aW5nID09IG51bGwpIHtcbiAgICAgIGV4aXN0aW5nID0ge2g6IE1hdGgucmFuZG9tKCksIHM6IE1hdGgucmFuZG9tKCkgKiAoTUFYX1NBVCAtIE1JTl9TQVQpICsgTUlOX1NBVCwgbDogSU5JVElBTF9MVU19O1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3TCA9IGV4aXN0aW5nLmwgKz0gTFVNX0RFTFRBICogKGR0IC8gMTAwMCk7XG4gICAgICBpZiAoTFVNX0RFTFRBID4gMCAmJiBuZXdMID49IE1BWF9MVU0pIHtcbiAgICAgICAgbmV3TCA9IE1BWF9MVU07XG4gICAgICB9XG4gICAgICBpZiAoTFVNX0RFTFRBIDwgMCAmJiBuZXdMIDw9IE1JTl9MVU0pIHtcbiAgICAgICAgbmV3TCA9IE1JTl9MVU07XG4gICAgICB9XG4gICAgICBleGlzdGluZy5sID0gbmV3TDtcbiAgICB9XG4gICAgaWYgKCFleGlzdGVkKSB7XG4gICAgICBncmlkLnNldChleGlzdGluZywgYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIH1cbiAgICBpZiAoa2VlcCkge1xuICAgICAgbGV0IHBvc2l0aXZlX2RlbHRhID0gTFVNX0RFTFRBID4gMDtcbiAgICAgIGlmICgocG9zaXRpdmVfZGVsdGEgJiYgZXhpc3RpbmcubCA+PSBNQVhfTFVNKSB8fFxuICAgICAgICAgICghcG9zaXRpdmVfZGVsdGEgJiYgZXhpc3RpbmcubCA8PSBNSU5fTFVNKSkge1xuICAgICAgICBleGlzdGluZy5jb2xvciA9IGdldEhzbENlbGxDb2xvcihleGlzdGluZyk7XG4gICAgICAgIGVkZ2VDZWxscy5wdXNoKGFjdGl2ZUNlbGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3QWN0aXZlQ2VsbHMucHVzaChhY3RpdmVDZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYWN0aXZlQ2VsbHMgPSBuZXdBY3RpdmVDZWxscztcbn07XG5cbmxldCByZXByb2R1Y2VDZWxscyA9IGZ1bmN0aW9uKGR0LCB2aWV3UmVjdCk6Ym9vbGVhbiB7XG4gIGRvZXZlcnlfc2Vjb25kcygncmVwcm9kdWNlQ2VsbHMnLCAoKSA9PiB7IGNvbnNvbGUubG9nKCdBY3RpdmUgY2VsbHM6JywgYWN0aXZlQ2VsbHMubGVuZ3RoKSB9LCA1KTtcbiAgbGV0IHJldHVyblRydWUgPSBmYWxzZTtcbiAgd2hpbGUgKChhY3RpdmVDZWxscy5sZW5ndGggPiAwIHx8IGVkZ2VDZWxscy5sZW5ndGggPiAwKSAmJiBNYXRoLnJhbmRvbSgpIDw9IFJFUFJfUFJPQkFCSUxJVFkpIHtcbiAgICAvLyBsZXQgYWN0aXZlQ2VsbCA9IHdlaWdodGVkUmFuZG9tKGFjdGl2ZUNlbGxzLmNvbmNhdChlZGdlQ2VsbHMpLCAoY2VsbCkgPT4ge1xuICAgIC8vICAgbGV0IG5laWdoYm9ycyA9IGdyaWQuZ2V0TmVpZ2hib3JzKGNlbGwueCwgY2VsbC55KVxuICAgIC8vICAgICAgIC5maWx0ZXIoKG4pID0+IGdyaWQuZ2V0KG4ueCwgbi55KSA9PSBudWxsKTtcbiAgICAvLyAgIHJldHVybiBuZWlnaGJvcnMubGVuZ3RoO1xuICAgIC8vIH0pO1xuICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhY3RpdmVDZWxscy5sZW5ndGggKyBlZGdlQ2VsbHMubGVuZ3RoKSk7XG4gICAgbGV0IGFjdGl2ZUNlbGwgPSBpbmRleCA8IGFjdGl2ZUNlbGxzLmxlbmd0aCA/IGFjdGl2ZUNlbGxzW2luZGV4XSA6IGVkZ2VDZWxsc1tpbmRleCAtIGFjdGl2ZUNlbGxzLmxlbmd0aF07XG4gICAgbGV0IGV4aXN0aW5nID0gZ3JpZC5nZXQoYWN0aXZlQ2VsbC54LCBhY3RpdmVDZWxsLnkpO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBsZXQgbmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCB2aWV3UmVjdCk7XG4gICAgICBsZXQgbmV3TmVpZ2hib3I6bnVsbHx7eDpudW1iZXIsIHk6bnVtYmVyfSA9IG51bGw7XG4gICAgICBpZiAobmVpZ2hib3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gbGV0IGZpbHRlcmVkTmVpZ2hib3JzOntuZWlnaGJvcjpudWxsfHt4Om51bWJlciwgeTpudW1iZXJ9LCB3ZWlnaHQ6bnVtYmVyfVtdID0gbmVpZ2hib3JzLm1hcCgobmVpZ2hib3IpID0+IHtcbiAgICAgICAgLy8gICBsZXQgbmVpZ2hib3JOZWlnaGJvcnMgPSBncmlkLmdldE5laWdoYm9ycyhuZWlnaGJvci54LCBuZWlnaGJvci55KVxuICAgICAgICAvLyAgICAgICAuZmlsdGVyKChuKSA9PiBncmlkLmdldChuLngsIG4ueSkgPT0gbnVsbCk7XG4gICAgICAgIC8vICAgcmV0dXJuIHtcbiAgICAgICAgLy8gICAgIG5laWdoYm9yOiBuZWlnaGJvcixcbiAgICAgICAgLy8gICAgIHdlaWdodDogbmVpZ2hib3JOZWlnaGJvcnMubGVuZ3RoXG4gICAgICAgIC8vICAgfTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGZpbHRlcmVkTmVpZ2hib3JzLnB1c2goe25laWdoYm9yOiBudWxsLCB3ZWlnaHQ6IDEwfSk7XG4gICAgICAgIC8vIGxldCBuID0gd2VpZ2h0ZWRSYW5kb20oZmlsdGVyZWROZWlnaGJvcnMsIChuKSA9PiBNYXRoLnBvdyhuLndlaWdodCwgOCkpLm5laWdoYm9yO1xuICAgICAgICAvLyBpZiAobiA9PSBudWxsKSBjb250aW51ZTtcblxuICAgICAgICBsZXQgbiA9IG5laWdoYm9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZWlnaGJvcnMubGVuZ3RoKV07XG4gICAgICAgIGxldCBkZWx0YUh1ZSA9IChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogSFVFX0NIQU5HRTtcbiAgICAgICAgbGV0IGRlbHRhU2F0ID0gKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiBTQVRfQ0hBTkdFO1xuICAgICAgICBncmlkLnNldCh7XG4gICAgICAgICAgaDogbW9kKGV4aXN0aW5nLmggKyBkZWx0YUh1ZSwgMSksXG4gICAgICAgICAgczogY2xhbXAoZXhpc3RpbmcucyArIGRlbHRhU2F0LCBNSU5fU0FULCBNQVhfU0FUKSxcbiAgICAgICAgICBsOiBJTklUSUFMX0xVTVxuICAgICAgICB9LCBuLngsIG4ueSk7XG4gICAgICAgIG5ld05laWdoYm9yID0gbjtcbiAgICAgIH1cbiAgICAgIGxldCBuZWlnaGJvckNvbXBlbnNhdGlvbiA9IG5ld05laWdoYm9yID09IG51bGwgPyAwIDogMTtcbiAgICAgIGxldCBmZXJ0aWxlTmVpZ2hib3JzID0gZ2V0TmVpZ2hib3JzKGdyaWQsIGFjdGl2ZUNlbGwueCwgYWN0aXZlQ2VsbC55LCBudWxsKTtcbiAgICAgIGlmIChuZWlnaGJvcnMubGVuZ3RoIC0gbmVpZ2hib3JDb21wZW5zYXRpb24gIT09IGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVyblRydWUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKGZlcnRpbGVOZWlnaGJvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxldCBlZGdlSW5kZXggPSBlZGdlQ2VsbHMuaW5kZXhPZihhY3RpdmVDZWxsKTtcbiAgICAgICAgaWYgKGVkZ2VJbmRleCA+PSAwKSB7XG4gICAgICAgIC8vIGlmIChpbmRleCA+PSBhY3RpdmVDZWxscy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBlZGdlQ2VsbHMuc3BsaWNlKGluZGV4IC0gYWN0aXZlQ2VsbHMubGVuZ3RoLCAxKTtcbiAgICAgICAgICBlZGdlQ2VsbHMuc3BsaWNlKGVkZ2VJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdOZWlnaGJvciAhPSBudWxsKSB7XG4gICAgICAgIGFjdGl2ZUNlbGxzLnB1c2gobmV3TmVpZ2hib3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0dXJuVHJ1ZTtcbn1cblxuXG5cbi8vIGxldCB2aWV3UmVjdCA9IHJlbmRlcmVyLmdldEdyaWRWaWV3UmVjdChjYW1lcmEpO1xuLy8gdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuLy8gdmlld1JlY3QudG9wID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApIC0gMTtcbi8vIHZpZXdSZWN0LnJpZ2h0ID0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KSArIDE7XG4vLyB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4vLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xuLy8gdXBkYXRlQWN0aXZlQ2VsbHMoMTAwLCB2aWV3UmVjdClcbi8vIH1cblxubGV0IGxhc3RGcmFtZTpudW1iZXJ8bnVsbCA9IG51bGw7XG5sZXQgbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbmxvb3AoKGR0Om51bWJlcikgPT4ge1xuICBsZXQgdGhpc0ZyYW1lID0gZHQ7XG4gIGlmIChsYXN0RnJhbWUgIT0gbnVsbCkge1xuICAgIGR0ID0gdGhpc0ZyYW1lIC0gbGFzdEZyYW1lO1xuICB9XG4gIGxhc3RGcmFtZSA9IHRoaXNGcmFtZTtcblxuICBpZiAoUkVQUl9QUk9CQUJJTElUWSA8IDAuOTUpIHtcbiAgICBSRVBSX1BST0JBQklMSVRZICs9IGR0IC8gMzAwMDAwO1xuICB9XG4gIGlmIChSRVBSX1BST0JBQklMSVRZID4gMC45NSkge1xuICAgIFJFUFJfUFJPQkFCSUxJVFkgPSAwLjk1O1xuICB9XG5cbiAgbGV0IGNhbWVyYUFsdGVyZWQgPSBmYWxzZTtcbiAgaWYgKFRyaWFuZ2xlT3B0aW9ucy5pbnRlcmFjdGl2aXR5KSB7XG4gICAgaWYgKGRyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgICBpZiAobGFzdERyYWdQb3NpdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIGlmIChkcmFnUG9zaXRpb24ueCAhPT0gbGFzdERyYWdQb3NpdGlvbi54IHx8XG4gICAgICAgICAgICBkcmFnUG9zaXRpb24ueSAhPT0gbGFzdERyYWdQb3NpdGlvbi55KSB7XG4gICAgICAgICAgbGV0IHN0YXJ0ID0gY2FtZXJhLnVudHJhbnNmb3JtKGxhc3REcmFnUG9zaXRpb24ueCwgbGFzdERyYWdQb3NpdGlvbi55KTtcbiAgICAgICAgICBsZXQgZW5kID0gY2FtZXJhLnVudHJhbnNmb3JtKGRyYWdQb3NpdGlvbi54LCBkcmFnUG9zaXRpb24ueSk7XG4gICAgICAgICAgY2FtZXJhLm1vdmUoc3RhcnQueCAtIGVuZC54LCBzdGFydC55IC0gZW5kLnkpO1xuICAgICAgICAgIGNhbWVyYUFsdGVyZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXN0RHJhZ1Bvc2l0aW9uID0ge3g6IGRyYWdQb3NpdGlvbi54LCB5OiBkcmFnUG9zaXRpb24ueX07XG4gICAgfSBlbHNlIGlmIChsYXN0RHJhZ1Bvc2l0aW9uICE9IG51bGwpIHtcbiAgICAgIGxhc3REcmFnUG9zaXRpb24gPSBudWxsO1xuICAgIH1cbiAgICBpZiAoa2V5SW50ZXJhY3Rpdml0eS5pc0Rvd24oMTg5KSkgeyAvLyBtaW51c1xuICAgICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAqIDEuMSk7XG4gICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGtleUludGVyYWN0aXZpdHkuaXNEb3duKDE4NykpIHsgLy8gcGx1c1xuICAgICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBsZXQgdmlld1JlY3QgPSByZW5kZXJlci5nZXRHcmlkVmlld1JlY3QoY2FtZXJhKTtcbiAgdmlld1JlY3QubGVmdCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCkgLSAxO1xuICB2aWV3UmVjdC50b3AgPSBNYXRoLmZsb29yKHZpZXdSZWN0LnRvcCkgLSAxO1xuICB2aWV3UmVjdC5yaWdodCA9IE1hdGguY2VpbCh2aWV3UmVjdC5yaWdodCkgKyAxO1xuICB2aWV3UmVjdC5ib3R0b20gPSBNYXRoLmNlaWwodmlld1JlY3QuYm90dG9tKSArIDE7XG4gIC8vZm9yIChsZXQgaSA9IDA7IGkgPCA1MDA7IGkrKykge1xuICB1cGRhdGVBY3RpdmVDZWxscyhkdCwgdmlld1JlY3QpO1xuICAvLyB9XG4gIGlmIChncmlkLmdldENvdW50KCkgLyAoKHZpZXdSZWN0LmJvdHRvbSAtIHZpZXdSZWN0LnRvcCkgKiAodmlld1JlY3QucmlnaHQgLSB2aWV3UmVjdC5sZWZ0KSkgPiAxLjAwMSkge1xuICAgIGxldCBjdXJyZW50Wm9vbSA9IGNhbWVyYS5nZXRab29tKCk7XG4gICAgaWYgKGN1cnJlbnRab29tIDwgTUlOX1pPT00pIHtcbiAgICAgIGNhbWVyYS5zZXRab29tKGN1cnJlbnRab29tICogMik7XG4gICAgICBjYW1lcmFBbHRlcmVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiAoYWN0aXZlQ2VsbHMubGVuZ3RoID09PSAwICYmIE1hdGgucmFuZG9tKCkgPD0gUkVQUl9QUk9CQUJJTElUWSAvIDIpIHtcbiAgLy8gICBsZXQgZXhpc3Rpbmc6e1trZXk6c3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcbiAgLy8gICBncmlkLmZpbHRlcmVkTWFwKHt4OiB2aWV3UmVjdC5sZWZ0LCB5OiB2aWV3UmVjdC50b3B9LFxuICAvLyAgICAgICAgICAgICAgICAgICAge3g6IHZpZXdSZWN0LnJpZ2h0LCB5OiB2aWV3UmVjdC5ib3R0b219LFxuICAvLyAgICAgICAgICAgICAgICAgICAgKHZhbHVlLCB4LCB5KSA9PiAoZXhpc3RpbmdbeCArICcvJyArIHldID0gdHJ1ZSkpO1xuICAvLyAgIGxldCBub25FeGlzdGluZzp7eDpudW1iZXIsIHk6bnVtYmVyfVtdID0gW107XG4gIC8vICAgZm9yIChsZXQgeCA9IE1hdGguZmxvb3Iodmlld1JlY3QubGVmdCk7IHggPD0gTWF0aC5jZWlsKHZpZXdSZWN0LnJpZ2h0KTsgeCsrKSB7XG4gIC8vICAgICBmb3IgKGxldCB5ID0gTWF0aC5mbG9vcih2aWV3UmVjdC50b3ApOyB5IDw9IE1hdGguY2VpbCh2aWV3UmVjdC5ib3R0b20pOyB5KyspIHtcbiAgLy8gICAgICAgaWYgKCFleGlzdGluZ1t4ICsgJy8nICsgeV0pIHtcbiAgLy8gICAgICAgICBub25FeGlzdGluZy5wdXNoKHt4OiB4LCB5OiB5fSk7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vICAgYWN0aXZlQ2VsbHMucHVzaChub25FeGlzdGluZ1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBub25FeGlzdGluZy5sZW5ndGgpXSk7XG4gIC8vIH1cblxuICBsZXQgbWFpblRyaWFuZ2xlUmVuZGVyZXIgPSAoY29udGV4dCwgY2VsbCwgeCwgeSkgPT4ge1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gZ2V0SHNsQ2VsbENvbG9yKGNlbGwpO1xuICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIC8vIGNvbnRleHQubGluZUpvaW4gPSAncm91bmQnO1xuICAgIC8vIGNvbnRleHQubGluZVdpZHRoID0gMC41O1xuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb250ZXh0LmZpbGxTdHlsZTtcbiAgICAvLyBjb250ZXh0LnN0cm9rZSgpO1xuICB9O1xuXG4gIGlmIChjYW1lcmFBbHRlcmVkIHx8IGRpcnR5Q2FudmFzKSB7XG4gICAgZGlydHlDYW52YXMgPSBmYWxzZTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgICByZW5kZXJlci5yZW5kZXJBbGxDZWxscyhjb250ZXh0LCBjYW1lcmEsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfSBlbHNlIHtcbiAgICByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIGFjdGl2ZUNlbGxzLCBtYWluVHJpYW5nbGVSZW5kZXJlcik7XG4gICAgcmVuZGVyZXIucmVuZGVyQ2VsbHMoY29udGV4dCwgY2FtZXJhLCBlZGdlQ2VsbHMsIG1haW5UcmlhbmdsZVJlbmRlcmVyKTtcbiAgfVxuICByZXByb2R1Y2VDZWxscyhkdCwgdmlld1JlY3QpO1xuXG5cblxuICAvLyByZW5kZXJlci5yZW5kZXJDZWxscyhjb250ZXh0LCBjYW1lcmEsIFtob3ZlcmVkXSwgKGNvbnRleHQsIGNlbGwsIHgsIHkpID0+IHtcbiAgLy8gICBjb250ZXh0LmxpbmVKb2luID0gJ3JvdW5kJztcbiAgLy8gICBjb250ZXh0LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuICAvLyAgIGNvbnRleHQubGluZVdpZHRoID0gMztcbiAgLy8gICBjb250ZXh0LnN0cm9rZSgpO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzAwMCc7XG4gIC8vICAgY29udGV4dC5saW5lV2lkdGggPSAxO1xuICAvLyAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gIC8vIH0pO1xuXG4gIC8vIGxldCBub3dUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIC8vIGxldCB0aW1lUGFzc2VkID0gbm93VGltZSAtIGxhc3RUaW1lO1xuICAvLyBsYXN0VGltZSA9IG5vd1RpbWU7XG4gIC8vIGNvbnRleHQudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gIC8vIGNvbnRleHQuZm9udCA9ICcxNHB4IEFyaWFsJztcbiAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgLy8gY29udGV4dC5saW5lV2lkdGggPSAyO1xuICAvLyBsZXQgb25TY3JlZW5FZGdlID0gMDtcbiAgLy8gZm9yIChsZXQgZWRnZUNlbGwgb2YgZWRnZUNlbGxzKSB7XG4gIC8vICAgaWYgKHZpZXdSZWN0LmxlZnQgPD0gZWRnZUNlbGwueCAmJiBlZGdlQ2VsbC54IDw9IHZpZXdSZWN0LnJpZ2h0ICYmXG4gIC8vICAgICAgIHZpZXdSZWN0LnRvcCA8PSBlZGdlQ2VsbC55ICYmIGVkZ2VDZWxsLnkgPD0gdmlld1JlY3QuYm90dG9tKSB7XG4gIC8vICAgICBvblNjcmVlbkVkZ2UrKztcbiAgLy8gICB9XG4gIC8vIH1cbiAgLy8gbGV0IGZwc1RleHQgPSAnRlBTOiAnICsgTWF0aC5yb3VuZCgxMDAwIC8gdGltZVBhc3NlZCkgLy8rICcgIEFjdGl2ZTogJyArIGFjdGl2ZUNlbGxzLmxlbmd0aCArICcgIEVkZ2U6ICcgKyBlZGdlQ2VsbHMubGVuZ3RoICsgJyAgb25zY3JlZW4gJyArIG9uU2NyZWVuRWRnZTtcbiAgLy8gY29udGV4dC5zdHJva2VUZXh0KGZwc1RleHQsIDEwLCAxMCk7XG4gIC8vIGNvbnRleHQuZmlsbFRleHQoZnBzVGV4dCwgMTAsIDEwKTtcbn0sIDApO1xuXG5cbnJldHVybjtcbi8qL1xuXG5cblxuXG5sZXQgdG9vbFNlbGVjdCA9IDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbC1zZWxlY3QnKTtcbmxldCB0b29sU2VsZWN0aW9uID0gJ2RyYXcnO1xubGV0IHNldFRvb2wgPSBmdW5jdGlvbihuZXdUb29sOnN0cmluZykge1xuICAvLyB0b29sU2VsZWN0aW9uID0gbmV3VG9vbDtcbiAgLy8gdG9vbFNlbGVjdC52YWx1ZSA9IG5ld1Rvb2w7XG4gIHdvcmxkLnNlbGVjdFRvb2woPGtleW9mIFRvb2xzQ29sbGVjdGlvbj5uZXdUb29sKTtcbn07XG5pZiAodG9vbFNlbGVjdCAhPSBudWxsKSB7XG4gIHRvb2xTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgc2V0VG9vbCh0b29sU2VsZWN0LnZhbHVlKTtcbiAgfSk7XG59XG5cblxuXG5sZXQgd29ybGQ6V29ybGQgPSBuZXcgV29ybGQoY2FudmFzKTtcbmxldCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+Y2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbmNvbnN0IFZFTE9DSVRZOm51bWJlciA9IDE1O1xuXG5sZXQga2V5cyA9IG5ldyBLZXlJbnRlcmFjdGl2aXR5KCk7XG5rZXlzLm1hcCgnbGVmdCcsIDY1KTtcbmtleXMubWFwKCdyaWdodCcsIDY4KTtcbmtleXMubWFwKCd1cCcsIDg3KTtcbmtleXMubWFwKCdkb3duJywgODMpO1xua2V5cy5tYXAoJ3pvb20tb3V0JywgODEpO1xua2V5cy5tYXAoJ3pvb20taW4nLCA2OSk7XG5sb29wKCgpID0+IHtcbiAgLy8gcmVuZGVyRnVsbFRyaWFuZ2xlR3JpZChncmlkLCByZW5kZXJlciwgY29udGV4dCk7XG5cbiAgd29ybGQucmVuZGVyKCk7XG5cbiAgbGV0IGNhbWVyYSA9IHdvcmxkLmdldENhbWVyYSgpO1xuXG4gIGlmIChrZXlzLmlzRG93bignem9vbS1vdXQnKSkge1xuICAgIGNhbWVyYS5zZXRab29tKGNhbWVyYS5nZXRab29tKCkgKiAxLjEpO1xuICB9XG4gIGlmIChrZXlzLmlzRG93bignem9vbS1pbicpKSB7XG4gICAgY2FtZXJhLnNldFpvb20oY2FtZXJhLmdldFpvb20oKSAvIDEuMSk7XG4gIH1cblxuICBsZXQgZHggPSAwLCBkeSA9IDA7XG4gIGlmIChrZXlzLmlzRG93bignbGVmdCcpKSB7XG4gICAgZHggLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdyaWdodCcpKSB7XG4gICAgZHggKz0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCd1cCcpKSB7XG4gICAgZHkgLT0gVkVMT0NJVFk7XG4gIH1cbiAgaWYgKGtleXMuaXNEb3duKCdkb3duJykpIHtcbiAgICBkeSArPSBWRUxPQ0lUWTtcbiAgfVxuXG4gIGR4ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGR5ICo9IGNhbWVyYS5nZXRab29tKCk7XG4gIGlmIChkeCAhPT0gMCB8fCBkeSAhPT0gMCkge1xuICAgIGNhbWVyYS5tb3ZlKGR4LCBkeSk7XG4gIH1cbn0sIDApO1xuXG4vLyAqL1xufTtcblxuXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IHRyeUxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjYW52YXMgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xuICAgIGlmIChjYW52YXMpIHtcbiAgICAgIG9ubG9hZChjYW52YXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KHRyeUxvYWQsIDUwMCk7XG4gICAgfVxuICB9XG4gIHRyeUxvYWQoKTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgS2V5SW50ZXJhY3Rpdml0eSB7XG4gIHByaXZhdGUga2V5czp7W2tleTpzdHJpbmddOiBib29sZWFufTtcbiAgcHJpdmF0ZSBrZXlNYXA6e1trZXk6c3RyaW5nXTogc3RyaW5nfG51bWJlcn07XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5rZXlzID0ge307XG4gICAgdGhpcy5rZXlNYXAgPSB7fTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgbGV0IGtleWNvZGUgPSBlLmtleUNvZGU7XG4gICAgICB0aGlzLmtleXNba2V5Y29kZV0gPSB0cnVlO1xuICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgIGlmIChuYW1lICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5rZXlzW25hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBsZXQga2V5Y29kZSA9IGUua2V5Q29kZTtcbiAgICAgIGlmIChrZXljb2RlIGluIHRoaXMua2V5cykge1xuICAgICAgICBkZWxldGUgdGhpcy5rZXlzW2tleWNvZGVdO1xuICAgICAgfVxuICAgICAgaWYgKGtleWNvZGUgaW4gdGhpcy5rZXlNYXApIHtcbiAgICAgICAgbGV0IG5hbWUgPSB0aGlzLmtleU1hcFtrZXljb2RlXTtcbiAgICAgICAgaWYgKG5hbWUgIT0gbnVsbCAmJiBuYW1lIGluIHRoaXMua2V5cykge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmtleXNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG1hcChuYW1lOnN0cmluZywga2V5OnN0cmluZ3xudW1iZXIpIHtcbiAgICB0aGlzLmtleU1hcFtrZXldID0gbmFtZTtcbiAgfVxuXG4gIGlzRG93bihrZXk6c3RyaW5nfG51bWJlcik6Ym9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5rZXlzW2tleV07XG4gIH1cblxuICBnZXREb3duKCk6c3RyaW5nW10ge1xuICAgIGxldCBrZXlzOnN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMua2V5cykge1xuICAgICAgaWYgKHRoaXMuaXNEb3duKGtleSkpIHtcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xuICB9XG59XG4iLCJjb25zdCBtYXA6IHtbazogc3RyaW5nXTogbnVtYmVyfSA9IHt9O1xuZXhwb3J0IGZ1bmN0aW9uIGRvZXZlcnlfc2Vjb25kcyhpZDogc3RyaW5nfG51bWJlciwgZjogKCkgPT4gdm9pZCwgc2Vjb25kczogbnVtYmVyKSB7XG4gIGNvbnN0IGtleSA9IFN0cmluZyhpZCk7XG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBjb25zdCB0aGVuID0gbWFwW2tleV0gfHwgMDtcbiAgaWYgKG5vdyAtIHRoZW4gPiBzZWNvbmRzICogMTAwMCkge1xuICAgIGYoKTtcbiAgICBtYXBba2V5XSA9IG5vdztcbiAgfVxufSIsIlxuZXhwb3J0IGNvbnN0IG1vZCA9IGZ1bmN0aW9uKG46bnVtYmVyLCBtOm51bWJlcik6bnVtYmVyIHtcbiAgbGV0IG1vZGRlZCA9IG4gJSBtO1xuICBpZiAobiA8IDApIG4gKz0gbTtcbiAgcmV0dXJuIG47XG59O1xuZXhwb3J0IGNvbnN0IGNsYW1wID0gZnVuY3Rpb24objpudW1iZXIsIG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlciB7XG4gIGlmIChuIDwgbWluKSByZXR1cm4gbWluO1xuICBpZiAobiA+IG1heCkgcmV0dXJuIG1heDtcbiAgcmV0dXJuIG47XG59OyIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9ldmVudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb3VzZUludGVyYWN0aXZpdHkge1xuICBldmVudHM6RXZlbnRzO1xuXG4gIHByaXZhdGUgZWxlbWVudDpIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBkb3duOmJvb2xlYW47XG4gIHByaXZhdGUgcG9zaXRpb246e3g/Om51bWJlciwgeT86bnVtYmVyfTtcbiAgcHJpdmF0ZSBkcmFnZ2luZzpib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQ6SFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHMoKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMucG9zaXRpb24gPSB7fTtcbiAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VEb3duKGUpKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHRoaXMuaGFuZGxlTW91c2VNb3ZlKGUpKTtcbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIChlKSA9PiB0aGlzLmhhbmRsZU1vdXNlVXAoZSkpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZSkgPT4gdGhpcy5oYW5kbGVNb3VzZVVwKHtcbiAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZIC0gdGhpcy5lbGVtZW50Lm9mZnNldFRvcH0sIGZhbHNlKSk7XG4gIH1cblxuICBpc0Rvd24oKSB7IHJldHVybiB0aGlzLmRvd247IH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlVXAoZXZlbnQsIGV2ZW50czpib29sZWFuID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmRvd24pIHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IHt4OiBldmVudC5vZmZzZXRYLCB5OiBldmVudC5vZmZzZXRZfTtcbiAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgaWYgKGV2ZW50cykge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2RyYWctZW5kJywgcG9zaXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2NsaWNrJywgcG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnBvc2l0aW9uLnkgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNb3VzZU1vdmUoZXZlbnQpIHtcbiAgICBpZiAodGhpcy5kb3duKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uLnggPSBldmVudC5vZmZzZXRYO1xuICAgICAgdGhpcy5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgIC8vIElmIHRoZSBtb3VzZSBpcyBkb3duIHdoZW4gd2UgcmVjZWl2ZSB0aGUgbW91c2Vkb3duIG9yIG1vdmUgZXZlbnQsIHRoZW5cbiAgICAgIC8vIHdlIGFyZSBkcmFnZ2luZy5cbiAgICAgIGlmICghdGhpcy5kcmFnZ2luZykge1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1zdGFydCcsIHRoaXMucG9zaXRpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCgnZHJhZy1tb3ZlJywgdGhpcy5wb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2hvdmVyJywge3g6IGV2ZW50Lm9mZnNldFgsIHk6IGV2ZW50Lm9mZnNldFl9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vdXNlRG93bihldmVudCkge1xuICAgIHRoaXMucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgdGhpcy5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WTtcbiAgICB0aGlzLmRvd24gPSB0cnVlO1xuICAgIHRoaXMuZXZlbnRzLmVtaXQoJ2Rvd24nLCB0aGlzLnBvc2l0aW9uKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmFtcyB7XG4gIHByaXZhdGUgc3RhdGljIHBhcmFtczp7W2tleTpzdHJpbmddOiBzdHJpbmd9ID0gKCgpID0+IHtcbiAgICBsZXQgcmF3UGFyYW1zID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnPycpLnNsaWNlKDEpLmpvaW4oJz8nKS5zcGxpdCgnIycpWzBdLnNwbGl0KCcmJyk7XG4gICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgIGZvciAobGV0IHBhcmFtIG9mIHJhd1BhcmFtcykge1xuICAgICAgbGV0IHNwbGl0ID0gcGFyYW0uc3BsaXQoJz0nKTtcbiAgICAgIGxldCBrZXkgPSBzcGxpdFswXTtcbiAgICAgIGxldCB2YWx1ZSA9IHNwbGl0LnNsaWNlKDEpLmpvaW4oJz0nKTtcbiAgICAgIHBhcmFtc1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH0pKCk7XG5cbiAgc3RhdGljIG51bWJlcihrZXk6c3RyaW5nLCBkZWZhdWx0VmFsdWU6bnVtYmVyKTpudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IE51bWJlcih0aGlzLnBhcmFtc1trZXldKTtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCBpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgdmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHN0YXRpYyBzdHJpbmcoa2V5OnN0cmluZywgZGVmYXVsdFZhbHVlOnN0cmluZyk6c3RyaW5nIHtcbiAgICBsZXQgdmFsdWU6c3RyaW5nfG51bGwgPSB0aGlzLnBhcmFtc1trZXldO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB2YWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59Il19
