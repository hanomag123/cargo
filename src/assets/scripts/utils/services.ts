export function getRandomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function delayCallback(ms: number, callback?: () => void) {
  return new Promise((res) => {
    setTimeout(() => {
      callback && callback();
      res(null);
    }, ms);
  });
}

export function clamp(min: number, max: number, value: number) {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

export function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}
