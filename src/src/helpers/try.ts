export const tryUntil = (f: () => boolean, everySeconds: number) => {
  const tryF = () => {
    if (!f()) {
      setTimeout(tryF, everySeconds * 1000);
    }
  };
  tryF();
};
