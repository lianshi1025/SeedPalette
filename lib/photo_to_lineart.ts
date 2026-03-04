function clamp(v: number, min = 0, max = 255) { return Math.max(min, Math.min(max, v)); }

export async function fileToImageData(file: File, maxSize = 1024): Promise<ImageData> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(maxSize / bitmap.width, maxSize / bitmap.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function generateLineArt(source: ImageData, detail = 2, threshold = 80, thickness = 1): string {
  const w = source.width;
  const h = source.height;
  const gray = new Float32Array(w * h);

  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    gray[i] = source.data[idx] * 0.299 + source.data[idx + 1] * 0.587 + source.data[idx + 2] * 0.114;
  }

  const blurPasses = Math.max(1, detail);
  let work = gray;
  for (let p = 0; p < blurPasses; p++) {
    const temp = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        temp[i] = (work[i] * 4 + work[i - 1] + work[i + 1] + work[i - w] + work[i + w]) / 8;
      }
    }
    work = temp;
  }

  const edges = new Uint8ClampedArray(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = -work[i - w - 1] - 2 * work[i - 1] - work[i + w - 1] + work[i - w + 1] + 2 * work[i + 1] + work[i + w + 1];
      const gy = -work[i - w - 1] - 2 * work[i - w] - work[i - w + 1] + work[i + w - 1] + 2 * work[i + w] + work[i + w + 1];
      const mag = Math.sqrt(gx * gx + gy * gy);
      edges[i] = mag > threshold ? 255 : 0;
    }
  }

  for (let t = 0; t < thickness; t++) {
    const grown = new Uint8ClampedArray(edges);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        if (edges[i] > 0 || edges[i - 1] > 0 || edges[i + 1] > 0 || edges[i - w] > 0 || edges[i + w] > 0) grown[i] = 255;
      }
    }
    edges.set(grown);
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (edges[i] && edges[i - 1] + edges[i + 1] + edges[i - w] + edges[i + w] <= 255) edges[i] = 0;
    }
  }

  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d')!;
  const output = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const v = 255 - clamp(edges[i]);
    const idx = i * 4;
    output.data[idx] = v;
    output.data[idx + 1] = v;
    output.data[idx + 2] = v;
    output.data[idx + 3] = 255;
  }
  ctx.putImageData(output, 0, 0);
  return out.toDataURL('image/png');
}
