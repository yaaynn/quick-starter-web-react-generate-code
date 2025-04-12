export function getStyleValue(value?: number | string, unit = "px") {
  if (typeof value === "number") {
    return `${value}${unit}`;
  }
  return value;
}
