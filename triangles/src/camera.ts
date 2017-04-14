export default class Camera {
  // World-space camera focus position.
  private x:number;
  private y:number;
  private zoom:number;
  private viewport:{width:number, height:number};

  constructor(viewportWidth:number, viewportHeight:number) {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    this.viewport = {width: viewportWidth, height: viewportHeight};
  }

  getViewport() {
    return {width: this.viewport.width, height: this.viewport.height};
  }

  resize(width:number, height:number) {
    this.viewport.width = width;
    this.viewport.height = height;
  }

  getZoom() {
    return this.zoom;
  }

  setZoom(newZoom:number) {
    this.zoom = newZoom;
  }

  move(dx:number, dy:number) {
    this.x += dx;
    this.y += dy;
  }

  /**
   * Transforms a world-space coordinate to camera-space.
   */
  transform(x:number, y:number):{x:number, y:number} {
    return {
      x: (x - this.x) / this.zoom + this.viewport.width / 2,
      y: (y - this.y) / this.zoom + this.viewport.height / 2,
    };
  }

  /**
   * Transforms a coordinate from camera-space to world-space.
   */
  untransform(x:number, y:number):{x:number, y:number} {
    return {
      x: (x - this.viewport.width / 2) * this.zoom + this.x,
      y: (y - this.viewport.height / 2) * this.zoom + this.y,
    };
  }
}
