import Events from './events';

export default class MouseInteractivity {
  events:Events;

  private element:HTMLElement;
  private down:boolean;
  private position:{x?:number, y?:number};
  private dragging:boolean;

  constructor(element:HTMLElement) {
    this.events = new Events();
    this.element = element;
    this.position = {};
    this.down = false;
    this.element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.element.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.element.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp({
      offsetX: e.offsetX - this.element.offsetLeft,
      offsetY: e.offsetY - this.element.offsetTop}, false));
  }

  isDown() { return this.down; }

  private handleMouseUp(event, events:boolean = true) {
    if (this.down) {
      let position = {x: event.offsetX, y: event.offsetY};
      this.down = false;
      if (events) {
        if (this.dragging) {
          this.events.emit('drag-end', position);
        } else {
          this.events.emit('click', position);
        }
      }
      this.dragging = false;
      this.position.x = undefined;
      this.position.y = undefined;
    }
  }

  private handleMouseMove(event) {
    if (this.down) {
      this.position.x = event.offsetX;
      this.position.y = event.offsetY;
      // If the mouse is down when we receive the mousedown or move event, then
      // we are dragging.
      if (!this.dragging) {
        this.dragging = true;
        this.events.emit('drag-start', this.position);
      } else {
        this.events.emit('drag-move', this.position);
      }
    } else {
      this.events.emit('hover', {x: event.offsetX, y: event.offsetY});
    }
  }

  private handleMouseDown(event) {
    this.position.x = event.offsetX;
    this.position.y = event.offsetY;
    this.down = true;
    this.events.emit('down', this.position);
  }
}
