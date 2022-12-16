/**
 * Return difference between two numbers
 */
export function d(a: number, b: number) {
  return Math.abs(a - b);
}

/**
 * Manhattan distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} dx + dy
 */
export const manhattan = function (dx: number, dy: number): number {
  return dx + dy;
};

/**
 * Euclidean distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} sqrt(dx * dx + dy * dy)
 */
export const euclidean = function (dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Octile distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} sqrt(dx * dx + dy * dy) for grids
 */
export const octile = function (dx: number, dy: number): number {
  var F = Math.SQRT2 - 1;
  return dx < dy ? F * dx + dy : F * dy + dx;
};

/**
 * Chebyshev distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} max(dx, dy)
 */
export const chebyshev = function (dx: number, dy: number): number {
  return Math.max(dx, dy);
};
