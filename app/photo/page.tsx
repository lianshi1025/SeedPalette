'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { fileToImageData, generateLineArt } from '@/lib/photo_to_lineart';
import { saveTempAsset } from '@/lib/storage';

export default function PhotoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [detail, setDetail] = useState(2);
  const [threshold, setThreshold] = useState(80);
  const [thickness, setThickness] = useState(1);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const generate = async () => {
    if (!file) return;
    setBusy(true);
    const imageData = await fileToImageData(file);
    const dataUrl = generateLineArt(imageData, detail, threshold, thickness);
    const tempId = await saveTempAsset(dataUrl);
    setBusy(false);
    router.push(`/color?tempId=${tempId}&title=${encodeURIComponent(file.name.replace(/\.[^.]+$/, ''))}`);
  };

  return (
    <main className="container" style={{ display: 'grid', gap: 16 }}>
      <h1 className="title">Photo → Coloring Page</h1>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <label>Detail level: {detail}<input type="range" min={1} max={4} value={detail} onChange={(e) => setDetail(Number(e.target.value))} /></label>
        <label>Edge threshold: {threshold}<input type="range" min={20} max={180} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} /></label>
        <label>Line thickness: {thickness}<input type="range" min={1} max={4} value={thickness} onChange={(e) => setThickness(Number(e.target.value))} /></label>
        <button className="kid-button" style={{ background: '#5ED3F3' }} disabled={!file || busy} onClick={generate}>
          {busy ? 'Generating...' : 'Generate Coloring Page'}
        </button>
      </div>
    </main>
  );
}
