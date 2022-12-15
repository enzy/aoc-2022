export function isDefined<T>(value: T | undefined): value is T {
  return typeof value !== "undefined";
}

export function isNumber(v: any): v is number {
  return typeof v === "number";
}

export function isArray(v: any): v is any[] {
  return Array.isArray(v);
}
