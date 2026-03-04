const colorMatch = (arr: Uint8ClampedArray, idx: number, target: number[], tolerance: number) => {
  return Math.abs(arr[idx] - target[0]) <= tolerance &&
    Math.abs(arr[idx + 1] - target[1]) <= tolerance &&
    Math.abs(arr[idx + 2] - target[2]) <= tolerance &&
    arr[idx + 3] > 0;
};

const isBoundary = (lineData: Uint8ClampedArray | null, idx: number) => {
  if (!lineData) return false;
  const r = lineData[idx];
  const g = lineData[idx + 1];
  const b = lineData[idx + 2];
  return r < 60 && g < 60 && b < 60;
};

export function floodFill(
  imageData: ImageData,
  x: number,
  y: number,
  fillColor: [number, number, number, number],
  tolerance = 20,
  lineArtData?: ImageData
): ImageData {
  const { width, height, data } = imageData;
  if (x < 0 || y < 0 || x >= width || y >= height) return imageData;
  const start = (Math.floor(y) * width + Math.floor(x)) * 4;
  const target = [data[start], data[start + 1], data[start + 2], data[start + 3]];
  if (target[0] === fillColor[0] && target[1] === fillColor[1] && target[2] === fillColor[2] && target[3] === fillColor[3]) return imageData;

  const lineData = lineArtData?.data ?? null;
  const stack: [number, number][] = [[Math.floor(x), Math.floor(y)]];
  const visited = new Uint8Array(width * height);

  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    const pos = cy * width + cx;
    if (visited[pos]) continue;
    visited[pos] = 1;
    const idx = pos * 4;
    if (isBoundary(lineData, idx)) continue;
    if (!colorMatch(data, idx, target, tolerance)) continue;

    data[idx] = fillColor[0];
    data[idx + 1] = fillColor[1];
    data[idx + 2] = fillColor[2];
    data[idx + 3] = fillColor[3];

    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }

  return imageData;
}
