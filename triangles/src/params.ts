export class Params {
  private static params:{[key:string]: string} = (() => {
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

  static number(key:string, defaultValue:number):number {
    let value = Number(this.params[key]);
    if (value == null || isNaN(value) || !isFinite(value)) {
      value = defaultValue;
    }
    return value;
  }

  static string(key:string, defaultValue:string):string {
    let value:string|null = this.params[key];
    if (value == null) {
      value = defaultValue;
    }
    return value;
  }
}