'use client';

import { useEffect, useRef, useState } from 'react';
import { floodFill } from '@/lib/floodfill';
import { exportToPdf } from '@/lib/pdf';
import { saveArtwork } from '@/lib/storage';
import Toolbar from './Toolbar';
import ColorPalette from './ColorPalette';

type Tool = 'brush' | 'fill' | 'eraser';

function hexToRgba(hex: string): [number, number, number, number] {
  const h = hex.replace('#', '');
  const num = Number.parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

export default function CanvasBoard({ lineArtSrc, title }: { lineArtSrc: string; title: string }) {
  const lineRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#FF7A59');
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const drawing = useRef(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const line = lineRef.current!;
      const draw = drawRef.current!;
      line.width = draw.width = img.width;
      line.height = draw.height = img.height;
      line.getContext('2d')!.drawImage(img, 0, 0);
      setLoading(false);
      snapshot();
    };
    img.src = lineArtSrc;
  }, [lineArtSrc]);

  const snapshot = () => {
    const data = drawRef.current?.toDataURL('image/png');
    if (!data) return;
    setHistory((h) => [...h.slice(-19), data]);
    setFuture([]);
  };

  const restore = (data: string) => {
    const img = new Image();
    img.onload = () => {
      const ctx = drawRef.current!.getContext('2d')!;
      ctx.clearRect(0, 0, drawRef.current!.width, drawRef.current!.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  };

  const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = drawRef.current!.getBoundingClientRect();
    return { x: Math.floor((e.clientX - rect.left) * (drawRef.current!.width / rect.width)), y: Math.floor((e.clientY - rect.top) * (drawRef.current!.height / rect.height)) };
  };

  const begin = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = drawRef.current!.getContext('2d')!;
    const { x, y } = pointer(e);
    if (tool === 'fill') {
      const drawImg = ctx.getImageData(0, 0, drawRef.current!.width, drawRef.current!.height);
      const lineImg = lineRef.current!.getContext('2d')!.getImageData(0, 0, lineRef.current!.width, lineRef.current!.height);
      const filled = floodFill(drawImg, x, y, hexToRgba(color), 20, lineImg);
      ctx.putImageData(filled, 0, 0);
      snapshot();
      return;
    }

    drawing.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = tool === 'eraser' ? 20 : 8;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || tool === 'fill') return;
    const { x, y } = pointer(e);
    const ctx = drawRef.current!.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    snapshot();
  };

  const undo = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    const current = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFuture((f) => [current, ...f]);
    restore(prev);
  };

  const redo = () => {
    if (!future.length) return;
    const [next, ...rest] = future;
    setFuture(rest);
    setHistory((h) => [...h, next].slice(-20));
    restore(next);
  };

  const clear = () => {
    const ctx = drawRef.current!.getContext('2d')!;
    ctx.clearRect(0, 0, drawRef.current!.width, drawRef.current!.height);
    snapshot();
  };

  const composeImage = () => {
    const merged = document.createElement('canvas');
    merged.width = lineRef.current!.width;
    merged.height = lineRef.current!.height;
    const ctx = merged.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, merged.width, merged.height);
    ctx.drawImage(drawRef.current!, 0, 0);
    ctx.drawImage(lineRef.current!, 0, 0);
    return merged.toDataURL('image/png');
  };

  const save = async () => {
    await saveArtwork({
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      lineArtSrc,
      coloredDataUrl: composeImage()
    });
    alert('Saved to Gallery!');
  };

  const exportPdf = () => exportToPdf(composeImage(), title);

  return (
    <div className="card" style={{ display: 'grid', gap: 12 }}>
      <Toolbar tool={tool} setTool={setTool} undo={undo} redo={redo} clear={clear} save={save} exportPdf={exportPdf} />
      <ColorPalette selected={color} onSelect={setColor} />
      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: 300 }}><div className="spinner" /></div>
      ) : (
        <div style={{ position: 'relative', maxWidth: '100%' }}>
          <canvas ref={lineRef} style={{ width: '100%', height: 'auto', borderRadius: 12, border: '2px solid #d8e3ff', background: 'white' }} />
          <canvas
            ref={drawRef}
            style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 'auto', borderRadius: 12, touchAction: 'none' }}
            onPointerDown={begin}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </div>
      )}
    </div>
  );
}
