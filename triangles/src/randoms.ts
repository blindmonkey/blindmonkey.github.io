
export const weightedRandom = function<T>(list:Array<T>, weightFn:(T) => number) {
  if (list.length === 0) throw 'error';
  let totalWeight:number = 0;
  let weights:number[] = [];
  for (let item of list) {
    let weight = Math.abs(weightFn(item));
    totalWeight += weight;
    weights.push(weight);
  }
  let n = Math.random() * totalWeight;
  let cumulativeSum = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulativeSum += weights[i];
    if (n <= cumulativeSum) {
      return list[i];
    }
  }
  return list[list.length - 1];
};