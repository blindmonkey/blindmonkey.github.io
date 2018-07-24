
export const mod = function(n:number, m:number):number {
  let modded = n % m;
  if (n < 0) n += m;
  return n;
};
export const clamp = function(n:number, min:number, max:number):number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};