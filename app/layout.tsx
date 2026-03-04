import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeedPalette',
  description: 'Where kids’ creativity begins and colors grow.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
