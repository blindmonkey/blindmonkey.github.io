const win = (window as {ga?: (action: string, msg: string, page: string) => void});

export function ga(action: string, msg: string, page: string) {
  const rawga = win.ga;
  if (rawga == null) {
    console.error('ga not inititalized before use');
    return;
  }
  rawga(action, msg, page);
}