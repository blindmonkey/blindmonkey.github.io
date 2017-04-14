type Handler = (...args:any[]) => void;

export default class Events {
  private handlers:{[key:string]:Array<Handler>};

  constructor() {
    this.handlers = {};
  }

  listen(events:string|Array<string>, handler:Handler) {
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

  emit(event:string, ...args:any[]) {
    let handlers = this.handlers[event];
    if (handlers != null) {
      for (let handler of handlers) {
        handler.apply(null, args);
      }
    }
  }
}
