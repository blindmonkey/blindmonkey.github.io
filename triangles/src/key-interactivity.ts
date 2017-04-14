export default class KeyInteractivity {
  private keys:{[key:string]: boolean};
  private keyMap:{[key:string]: string|number};

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

  map(name:string, key:string|number) {
    this.keyMap[key] = name;
  }

  isDown(key:string|number):boolean {
    return !!this.keys[key];
  }

  getDown():string[] {
    let keys:string[] = [];
    for (let key in this.keys) {
      if (this.isDown(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
}
