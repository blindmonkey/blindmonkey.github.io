import ColorSelectComponent from './color-select';
import World from './world';
import colors from './colors';

export abstract class Tool<CONFIG extends {}> {
  private config:CONFIG;

  constructor(initialConfig:CONFIG) {
    this.config = initialConfig;
  }

  get<T extends keyof CONFIG>(key:T) {
    return this.config[key];
  }

  set<T extends keyof CONFIG>(key:T, value) {
    this.config[key] = value;
  }

  getConfig():CONFIG {
    return this.config;
  }

  abstract initialize(element:HTMLElement):void;
  abstract apply(world:World, x:number, y:number):void;
}

export type DrawConfig = {color:string};
export class DrawTool extends Tool<DrawConfig> {
  initialize(element:HTMLElement) {
    let colorSelect = new ColorSelectComponent(element);
    colorSelect.events.listen('change', (rgb) => {
      this.set('color', colors.rgbToHex(rgb.r, rgb.g, rgb.b));
    });
  }
  apply(world:World, x:number, y:number) {
    world.getGrid().set(this.getConfig().color, x, y);
  }
}

export type EraseConfig = {};
export class EraseTool extends Tool<EraseConfig> {
  initialize(element:HTMLElement) {}
  apply(world:World, x:number, y:number) {
    world.getGrid().set(null, x, y);
  }
}

export type PickColorConfig = {};
export class PickColorTool extends Tool<PickColorConfig> {
  initialize(element:HTMLElement) {}
  apply(world:World, x:number, y:number) {
    let color = world.getGrid().get(x, y);
    if (color != null) {
      world.getTool('draw').set('color', color);
      world.selectTool('draw');
    }
  }
}


export type ToolsCollection = {
  draw: Tool<DrawConfig>,
  erase: Tool<EraseConfig>,
  pick: Tool<PickColorConfig>
};
