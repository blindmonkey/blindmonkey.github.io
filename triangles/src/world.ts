import Camera from './camera';
import Grid from './grid';
import GridViewModel from './grid-view-model';
import MouseInteractivity from './mouse-interactivity'

import {DrawTool, EraseTool, PickColorTool, ToolsCollection} from './tools';

type CellType = string;

export default class World {
  private canvas:HTMLCanvasElement;
  private context:CanvasRenderingContext2D;
  private camera:Camera;
  private grid:Grid<CellType>;
  private renderer:GridViewModel<CellType>;
  private interactivity:MouseInteractivity;

  private highlighted:{x?:number, y?:number};
  private tools:ToolsCollection;
  private toolDiv:HTMLElement;
  private activeTool:null|keyof ToolsCollection;

  constructor(canvas:HTMLCanvasElement) {
    this.toolDiv = <HTMLElement>document.getElementById('select-color');
    this.canvas = canvas;
    this.context = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    this.grid = new Grid<CellType>();
    this.renderer = new GridViewModel<CellType>(this.grid);
    this.interactivity = new MouseInteractivity(this.canvas);

    let dragHandler = (position) => {
      if (this.activeTool == null) return;
      let p = this.renderer.screenToGridCoord(
          this.camera, position.x, position.y);
      this.tools[this.activeTool].apply(this, Math.floor(p.x), Math.floor(p.y));
      // Tools[toolSelection](grid, Math.floor(p.x), Math.floor(p.y), activeColor);
      // grid.set(activeColor, Math.floor(p.x), Math.floor(p.y));
      this.highlighted.x = Math.floor(p.x);
      this.highlighted.y = Math.floor(p.y);
    };
    this.interactivity.events.listen('hover', (position) => {
      let p = this.renderer.screenToGridCoord(
          this.camera, position.x, position.y);
      this.highlighted.x = Math.floor(p.x);
      this.highlighted.y = Math.floor(p.y);
    });
    this.interactivity.events.listen('click', dragHandler);
    this.interactivity.events.listen('drag-start', dragHandler);
    this.interactivity.events.listen('drag-move', dragHandler);
    this.interactivity.events.listen('drag-end', dragHandler);

    this.highlighted = {};
    this.tools = {
      draw: new DrawTool({color: '#ff0000'}),
      erase: new EraseTool({}),
      pick: new PickColorTool({}),
    };

    this.selectTool('draw');
  }

  selectTool<T extends keyof ToolsCollection>(key:T) {
    this.activeTool = key;
    while (this.toolDiv.children.length > 0) {
      this.toolDiv.removeChild(this.toolDiv.children[0]);
    }
    this.getTool(key).initialize(this.toolDiv);
  }

  getTool<T extends keyof ToolsCollection>(key:T) {
    return this.tools[key];
  }

  getHighlighted() {
    return {x: this.highlighted.x, y: this.highlighted.y};
  }

  setHighlighted(x:number, y:number) {
    this.highlighted.x = x;
    this.highlighted.y = y;
  }

  getCamera() { return this.camera; }

  getGrid() { return this.grid; }

  render() {
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.renderer.renderAllCells(this.context, this.camera, function(
        context:CanvasRenderingContext2D, cell:CellType, x:number, y:number) {
      context.lineJoin = 'round';
      context.fillStyle = cell;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = cell;
      context.stroke();
    });
    let highlighted = this.highlighted;
    if (highlighted.x != null && highlighted.y != null) {
      // console.log('rendering higlighted!');
      let neighbors = this.grid.getDirectNeighbors(highlighted.x, highlighted.y);
      this.renderer.renderCells(this.context, this.camera, neighbors,
                       function(context, cell:CellType, x:number, y:number) {
                         context.lineJoin = 'round';
                         context.strokeStyle = 'gray';
                         context.lineWidth = 1;
                         context.stroke();
      });
      this.renderer.renderCells(this.context, this.camera, [{x: highlighted.x, y: highlighted.y}],
                       (context, cell:CellType, x:number, y:number) => {
                         context.lineJoin = 'round';
                         let lineWidth = this.interactivity.isDown() ? 6 : 3;
                         context.lineWidth = lineWidth + 3;
                         context.strokeStyle = 'white';
                         context.stroke();
                         context.strokeStyle = this.tools.draw.get('color');
                         context.lineWidth = lineWidth;
                         context.stroke();
                       })
    }
  }
}
