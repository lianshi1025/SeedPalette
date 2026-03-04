'use client';

import { useEffect, useState } from 'react';
import { Artwork, deleteArtwork, listArtworks } from '@/lib/storage';
import { exportToPdf } from '@/lib/pdf';

export default function GalleryPage() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [selected, setSelected] = useState<Artwork | null>(null);

  const load = () => listArtworks().then(setItems);
  useEffect(() => { load(); }, []);

  return (
    <main className="container" style={{ display: 'grid', gap: 16 }}>
      <h1 className="title">My Gallery</h1>
      <div className="grid">
        {items.map((item) => (
          <button key={item.id} className="card" style={{ border: 'none', cursor: 'pointer' }} onClick={() => setSelected(item)}>
            <img src={item.coloredDataUrl} alt={item.title} style={{ width: '100%', borderRadius: 12 }} />
            <div style={{ fontWeight: 800 }}>{item.title}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,20,40,0.55)', display: 'grid', placeItems: 'center', padding: 16 }} onClick={() => setSelected(null)}>
          <div className="card" style={{ maxWidth: 560, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <img src={selected.coloredDataUrl} alt={selected.title} style={{ width: '100%', borderRadius: 12 }} />
            <h3>{selected.title}</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="tool-btn" onClick={() => exportToPdf(selected.coloredDataUrl, selected.title)}>Export PDF</button>
              <button className="tool-btn" onClick={async () => { await deleteArtwork(selected.id); setSelected(null); load(); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
