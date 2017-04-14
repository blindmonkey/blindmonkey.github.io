import Camera from './camera';
import Grid from './grid';

export default class GridViewModel<T> {
  private grid:Grid<T>;

  constructor(grid:Grid<T>) {
    this.grid = grid;
  }

  screenToGridCoord(camera:Camera, x:number, y:number) {
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

  getGridViewRect(camera:Camera):{left:number, top:number,
                                          right:number, bottom:number} {
    let viewport = camera.getViewport();
    let {width, height} = viewport;
    let topLeft = this.screenToGridCoord(camera, 0, 0);
    let bottomRight = this.screenToGridCoord(camera, width, height);
    return {
      left: topLeft.x, top: topLeft.y,
      right: bottomRight.x, bottom: bottomRight.y
    };
  }

  private renderTriangle(context:CanvasRenderingContext2D, camera:Camera, x:number, y:number,
                         drawTriangle:(context:CanvasRenderingContext2D, t:T|null, x:number, y:number)=>void) {
    let trianglePath = function(
        x1:number, y1:number, x2:number, y2:number, x3:number, y3:number) {
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
      trianglePath( xx    * cellWidth, (yy+.5) * cellHeight,
                   (xx+1) * cellWidth,  yy     * cellHeight,
                   (xx+1) * cellWidth, (yy+1)  * cellHeight);
    } else {
      trianglePath( xx    * cellWidth,  yy     * cellHeight,
                   (xx+1) * cellWidth, (yy+.5) * cellHeight,
                   xx * cellWidth,     (yy+1) * cellHeight);
    }
    let value = this.grid.get(x, y);
    drawTriangle(context, value, x, y);
  }

  renderCells(context, camera:Camera, cells:Array<{x:number, y:number}>,
              drawTriangle:(context, t:T, x:number, y:number)=>void) {
    for (let coord of cells) {
      this.renderTriangle(context, camera, coord.x, coord.y, drawTriangle);
    }
  }

  renderAllCells(context:CanvasRenderingContext2D, camera:Camera,
                 drawTriangle:(context:CanvasRenderingContext2D,
                               t:T, x:number, y:number) => void) {
    // context.fillStyle = 'black';
    // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    let visibleRect = this.getGridViewRect(camera);
    this.grid.filteredMap(
        {x: Math.floor(visibleRect.left), y: Math.floor(visibleRect.top)},
        {x: Math.ceil(visibleRect.right + 1), y: Math.ceil(visibleRect.bottom + 1)},
        (value:T, x:number, y:number) =>
            this.renderTriangle(context, camera, x, y, drawTriangle));
    // this.grid.map((value:T, x:number, y:number) => {
    //   this.renderTriangle(context, camera, x, y, drawTriangle);
    // });
  }
}
