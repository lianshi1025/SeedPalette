'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRandomColoringPage } from '@/lib/assets';

const buttons = [
  { href: '/book', label: 'Start Coloring', color: '#FF7A59' },
  { href: '/photo', label: 'Photo to Coloring', color: '#5ED3F3' },
  { href: '/gallery', label: 'My Gallery', color: '#6BCB77' },
  { href: '#', label: 'Generate Page (coming soon)', color: '#FFD93D' }
];

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="container" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: 'min(540px, 100%)', textAlign: 'center', display: 'grid', gap: 16 }}>
        <h1 className="title">🎨 SeedPalette</h1>
        <p className="tagline">Where kids’ creativity begins and colors grow.</p>
        {buttons.map((b) => (
          b.href === '#' ?
            <button key={b.label} className="kid-button" style={{ background: b.color, opacity: 0.8 }}>{b.label}</button> :
            <Link key={b.href} href={b.href}><button className="kid-button" style={{ background: b.color }}>{b.label}</button></Link>
        ))}
        <button
          className="kid-button"
          style={{ background: '#9B8AFB' }}
          onClick={() => {
            const p = getRandomColoringPage();
            router.push(`/color?src=${encodeURIComponent(p.src)}&title=${encodeURIComponent(p.title)}`);
          }}
        >
          Surprise Me 🎲
        </button>
      </div>
    </main>
  );
}
