export type HsvColor = {h:number, s:number, v:number};
export type RgbColor = {r:number, g:number, b:number};

let colors = {
  random: function() {
    let randomComponent = function() {
      return Math.floor(Math.random() * 256);
    };
    let randomComponents = function(n) {
      let out:number[] = [];
      for (let i = 0; i < n; i++) {
        out.push(randomComponent());
      }
      return out;
    };
    return 'rgb(' + randomComponents(3).join(',') + ')';
  },
  rgb: function(r:number, g:number, b:number) {
    return 'rgb(' + [r, g, b].join(',') + ')';
  },
  hexToRgb: function(str:string) {
    str = str.slice(1);
    return {
      r: parseInt(str.slice(0, 2), 16),
      g: parseInt(str.slice(2, 4), 16),
      b: parseInt(str.slice(4, 6), 16),
    };
  },
  rgbToHex: function(r:number, g:number, b:number) {
    r = r|0;
    g = g|0;
    b = b|0;

    if (r < 0) r = 0;
    if (r > 255) r = 255;
    if (g < 0) g = 0;
    if (g > 255) g = 255;
    if (b < 0) b = 0;
    if (b > 255) b = 255;

    let rstr = r.toString(16);
    if (rstr.length === 1) rstr = '0' + rstr;
    let gstr = g.toString(16);
    if (gstr.length === 1) gstr = '0' + gstr;
    let bstr = b.toString(16);
    if (bstr.length === 1) bstr = '0' + bstr;
    return ['#', rstr, gstr, bstr].join('');
  },
  rgbToHsv: function(r:number, g:number, b:number) {
    // hsv         out;
    // double      min, max, delta;
    r = r / 255;
    g = g / 255;
    b = b / 255;

    let min = r    < g ? r   : g;
    min     = min  < b ? min : b;

    let max = r    > g ? r   : g;
    max     = max  > b ? max : b;

    let out = {h: 0, s: 0, v: 0};
    let v = max;
    let delta = max - min;
    if (delta < 0.00001)
    {
        out.s = 0;
        out.h = 0; // undefined, maybe nan?
        return out;
    }
    if( max > 0.0 ) { // NOTE: if Max is == 0, this divide would cause a crash
        out.s = (delta / max);
    } else {
        // if max is 0, then r = g = b = 0
        // s = 0, v is undefined
        out.s = 0.0;
        out.h = 0;
        return out;
    }
    if( r >= max )                           // > is bogus, just keeps compilor happy
        out.h = (g - b) / delta;        // between yellow & magenta
    else if( g >= max )
        out.h = 2.0 + ( b - r ) / delta;  // between cyan & yellow
    else
        out.h = 4.0 + ( r - g ) / delta;  // between magenta & cyan

    out.h *= 60.0;                              // degrees

    if( out.h < 0.0 )
        out.h += 360.0;

    return out;
  },
  hsvToRgb: function(h:number, s:number, l:number) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
  }
};

export default colors;
