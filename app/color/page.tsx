'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CanvasBoard from '@/components/CanvasBoard';
import { getTempAsset } from '@/lib/storage';

export default function ColorPage() {
  const search = useSearchParams();
  const [src, setSrc] = useState<string | null>(search.get('src'));
  const title = search.get('title') || 'Artwork';

  useEffect(() => {
    const tempId = search.get('tempId');
    if (!tempId) return;
    getTempAsset(tempId).then((value) => value && setSrc(value));
  }, [search]);

  return (
    <main className="container" style={{ display: 'grid', gap: 12 }}>
      <h1 className="title">Color Page</h1>
      {src ? <CanvasBoard lineArtSrc={src} title={title} /> : <p>No page selected. Pick one in the library.</p>}
    </main>
  );
}
