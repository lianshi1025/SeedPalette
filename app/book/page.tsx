'use client';

import Link from 'next/link';
import { coloringPages } from '@/lib/assets';

const categories = ['animals', 'dinosaurs', 'princess', 'ocean', 'vehicles'] as const;

export default function BookPage() {
  return (
    <main className="container" style={{ display: 'grid', gap: 18 }}>
      <h1 className="title">Coloring Library</h1>
      {categories.map((category) => (
        <section key={category}>
          <h2 style={{ textTransform: 'capitalize' }}>{category}</h2>
          <div className="grid">
            {coloringPages.filter((p) => p.category === category).map((p) => (
              <Link
                key={p.id}
                href={`/color?src=${encodeURIComponent(p.src)}&title=${encodeURIComponent(p.title)}`}
                className="card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src={p.src} alt={p.title} style={{ width: '100%', borderRadius: 12, border: '2px solid #e2e8ff', background: '#fff' }} />
                <div style={{ fontWeight: 800, marginTop: 8 }}>{p.title}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
