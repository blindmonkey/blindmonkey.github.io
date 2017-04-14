import Events from './events';
import MouseInteractivity from './mouse-interactivity';

import colors from './colors';
import {RgbColor} from './colors';

let clamp = function(n:number, min:number, max:number) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

export default class ColorSelectComponent {
  events:Events;

  private element:HTMLElement;
  private activeColorCanvas:HTMLCanvasElement;
  private redSelectCanvas:HTMLCanvasElement;
  private greenSelectCanvas:HTMLCanvasElement;
  private blueSelectCanvas:HTMLCanvasElement;

  private redInteractivity:MouseInteractivity;
  private greenInteractivity:MouseInteractivity;
  private blueInteractivity:MouseInteractivity;

  private redValue:number;
  private greenValue:number;
  private blueValue:number;

  constructor(element:HTMLElement) {
    this.element = element;
    this.events = new Events();

    this.redValue = 255;
    this.greenValue = 0;
    this.blueValue = 0;

    this.activeColorCanvas = this.initializeCanvas(60, 60);
    this.redSelectCanvas = this.initializeCanvas(740, 20);
    this.greenSelectCanvas = this.initializeCanvas(740, 20);
    this.blueSelectCanvas = this.initializeCanvas(740, 20);
    let activeColorSpan = document.createElement('div');
    let colorSelectSpan = document.createElement('div');
    activeColorSpan.style.display = 'inline-block';
    colorSelectSpan.style.display = 'inline-block';
    colorSelectSpan.style.width = '740px';
    this.element.appendChild(activeColorSpan);
    this.element.appendChild(colorSelectSpan);
    activeColorSpan.appendChild(this.activeColorCanvas);
    colorSelectSpan.appendChild(this.redSelectCanvas);
    colorSelectSpan.appendChild(this.greenSelectCanvas);
    colorSelectSpan.appendChild(this.blueSelectCanvas);

    this.redInteractivity = new MouseInteractivity(this.redSelectCanvas);
    this.greenInteractivity = new MouseInteractivity(this.greenSelectCanvas);
    this.blueInteractivity = new MouseInteractivity(this.blueSelectCanvas);
    let handleRedChange = (position) => this.setRedValue(position.x / this.redSelectCanvas.width * 255);
    let handleGreenChange = (position) => this.setGreenValue(position.x / this.greenSelectCanvas.width * 255);
    let handleBlueChange = (position) => this.setBlueValue(position.x / this.blueSelectCanvas.width * 255);
    this.redInteractivity.events.listen(['down', 'click', 'drag-start', 'drag-move', 'drag-end'], handleRedChange)
    this.greenInteractivity.events.listen(['down', 'click', 'drag-start', 'drag-move', 'drag-end'], handleGreenChange)
    this.blueInteractivity.events.listen(['down', 'click', 'drag-start', 'drag-move', 'drag-end'], handleBlueChange)
    this.renderSelectors();
  }

  getRgb() {
    return {r: this.redValue, g: this.greenValue, b: this.blueValue};
  }

  setColor(r:number, g:number, b:number) {
    this.redValue = r;
    this.greenValue = g;
    this.blueValue = b;
    this.renderSelectors();
  }

  private setRedValue(newRedValue:number) {
    this.redValue = clamp(newRedValue, 0, 255);
    this.renderSelectors();
    this.events.emit('change', this.getRgb());
  }

  private setGreenValue(newGreenValue:number) {
    this.greenValue = clamp(newGreenValue, 0, 255);
    this.renderSelectors();
    this.events.emit('change', this.getRgb());
  }

  private setBlueValue(newBlueValue:number) {
    this.blueValue = clamp(newBlueValue, 0, 255);
    this.renderSelectors();
    this.events.emit('change', this.getRgb());
  }

  private initializeCanvas(width:number, height:number) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private renderRedSelect() {
    this.renderColorSelect(this.redSelectCanvas, this.redValue,
      (redValue:number  ) => ({r: redValue, g: this.greenValue, b: this.blueValue}));
  }

  private renderGreenSelect() {
    this.renderColorSelect(this.greenSelectCanvas, this.greenValue,
      (greenValue:number) => ({r: this.redValue, g: greenValue, b: this.blueValue}));
  }

  private renderBlueSelect() {
    this.renderColorSelect(this.blueSelectCanvas, this.blueValue,
      (blueValue:number ) => ({r: this.redValue, g: this.greenValue, b: blueValue}));
  }

  private renderSelectors() {
    this.renderRedSelect();
    this.renderGreenSelect();
    this.renderBlueSelect();
    this.updateActiveColor();
  }

  private updateActiveColor() {
    let context = <CanvasRenderingContext2D>this.activeColorCanvas.getContext('2d');
    context.fillStyle = colors.rgbToHex(this.redValue, this.greenValue, this.blueValue);
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  private renderColorSelect(
      canvas:HTMLCanvasElement, value:number, makeColor:(value:number) => RgbColor) {
    let RESOLUTION = 3;
    let step = 1 / RESOLUTION;

    let context:CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext('2d');
    let gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    let hue = 0;
    for (hue = 0; hue <= 1; hue += step) {
      let color = makeColor(clamp(Math.floor(hue * 256), 0, 255));
      let {r, g, b} = color;
      gradient.addColorStop(hue, colors.rgbToHex(r, g, b));
    }
    if (hue < 1) {
      let color = makeColor(255);
      let {r, g, b} = color;
      gradient.addColorStop(1, colors.rgbToHex(r, g, b));
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    let positionX = Math.floor(value / 255 * canvas.width);
    context.beginPath();
    context.arc(positionX, canvas.height / 2, canvas.height / 4, 0, Math.PI * 2);
    context.lineWidth = 3;
    context.strokeStyle = 'white';
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
  }

  private render


}
