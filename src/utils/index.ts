export function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}

export function isNumber(v: any): v is number {
  return typeof v === "number";
}

export function isArray(v: any): v is any[] {
  return Array.isArray(v);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function mergeIntervals(intervals: [number, number][]) {
  if (intervals.length < 2) {
    return intervals;
  }

  intervals.sort((a, b) => a[0] - b[0]);

  const uniqueIntervals = [];
  let start = intervals[0][0];
  let end = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    let currStart = intervals[i][0];
    let currEnd = intervals[i][1];

    if (currStart <= end) {
      end = Math.max(end, currEnd);
    } else {
      uniqueIntervals.push([start, end]);
      start = currStart;
      end = currEnd;
    }
  }

  uniqueIntervals.push([start, end]);
  return uniqueIntervals;
}
