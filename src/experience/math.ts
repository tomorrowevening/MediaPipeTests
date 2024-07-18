export const DEGREES = 180 / Math.PI
export const RADIANS = Math.PI / 180

export function between(min: number, max: number, value: number) {
  return value >= min && value <= max
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value))
}

export function distance(x: number, y: number): number {
  const d = x - y;
  return Math.sqrt(d * d);
}

export function distance2(x1: number, y1: number, x2: number, y2: number): number {
  const xd = (x1 - x2) * (x1 - x2);
  const yd = (y1 - y2) * (y1 - y2);
  return Math.sqrt(xd + yd);
}

export function distance3(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  const xd = (x1 - x2) * (x1 - x2);
  const yd = (y1 - y2) * (y1 - y2);
  const zd = (z1 - z2) * (z1 - z2);
  return Math.sqrt(xd + yd + zd);
}

export function map(min1: number, max1: number, min2: number, max2: number, value: number) {
  return mix(min2, max2, normalize(min1, max1, value))
}

export function mix(min: number, max: number, value: number) {
  return min * (1 - value) + max * value
}

export function normalize(min: number, max: number, value: number) {
  return (value - min) / (max - min)
}

export function getAngle(x0: number, y0: number, x1: number, y1: number): number {
  return Math.atan2(y1 - y0, x1 - x0)
}

export function toRad(degrees: number): number {
  return degrees * RADIANS
}

export function toDeg(radians: number): number {
  return radians * DEGREES
}
