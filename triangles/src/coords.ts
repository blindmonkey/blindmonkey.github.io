let coords = function(
    width:number, height:number) {
  return {
      fromIndex: function(index:number): {
        x:number, y:number} {
      let x = index % width;
      let y = (index - x) / width;
      return {x, y};
    },
    toIndex: function(x:number, y:number):number {
        return y * width + x;
    }
  };
};

export default coords;
