const map: {[k: string]: number} = {};
export function doevery_seconds(id: string|number, f: () => void, seconds: number) {
  const key = String(id);
  const now = new Date().getTime();
  const then = map[key] || 0;
  if (now - then > seconds * 1000) {
    f();
    map[key] = now;
  }
}