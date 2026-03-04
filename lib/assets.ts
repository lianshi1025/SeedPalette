export type ColoringPage = {
  id: string;
  title: string;
  category: 'animals' | 'dinosaurs' | 'princess' | 'ocean' | 'vehicles';
  src: string;
};

const categories: ColoringPage['category'][] = ['animals', 'dinosaurs', 'princess', 'ocean', 'vehicles'];

const motifs: Record<ColoringPage['category'], string[]> = {
  animals: ['Cat', 'Dog', 'Panda', 'Lion', 'Elephant', 'Rabbit', 'Fox', 'Koala', 'Giraffe', 'Turtle'],
  dinosaurs: ['TRex', 'Stego', 'Bronto', 'Raptor', 'Triceratops', 'Ankylosaurus', 'Ptero', 'DinoEgg', 'BabyDino', 'DinoFamily'],
  princess: ['Castle', 'Crown', 'MagicWand', 'Dress', 'Unicorn', 'Garden', 'Ballroom', 'Carriage', 'Tiara', 'FairyFriend'],
  ocean: ['Fish', 'Whale', 'Dolphin', 'Octopus', 'Seahorse', 'Coral', 'Submarine', 'Shell', 'Starfish', 'Crab'],
  vehicles: ['Car', 'Truck', 'Bus', 'Bike', 'Train', 'Plane', 'Boat', 'Rocket', 'Scooter', 'FireTruck']
};

function svgForPage(title: string, seed: number): string {
  const cX = 100 + (seed % 5) * 20;
  const cY = 90 + (seed % 4) * 18;
  const r = 30 + (seed % 3) * 8;
  const bodyW = 120 + (seed % 4) * 14;
  const bodyH = 90 + (seed % 5) * 10;
  const lines = Array.from({ length: 6 }).map((_, i) =>
    `<circle cx="${60 + i * 48}" cy="250" r="16" fill="none" stroke="#000" stroke-width="6" />`
  ).join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
  <rect x="0" y="0" width="360" height="360" fill="white" />
  <rect x="20" y="20" width="320" height="320" rx="24" ry="24" fill="white" stroke="black" stroke-width="6" />
  <ellipse cx="180" cy="220" rx="${bodyW / 2}" ry="${bodyH / 2}" fill="white" stroke="black" stroke-width="8" />
  <circle cx="${cX}" cy="${cY}" r="${r}" fill="white" stroke="black" stroke-width="8" />
  <circle cx="${260 - (seed % 5) * 12}" cy="${110 + (seed % 3) * 12}" r="24" fill="white" stroke="black" stroke-width="8" />
  <path d="M70 170 Q180 ${120 + seed % 40} 290 170" fill="none" stroke="black" stroke-width="8" />
  <path d="M95 220 Q180 ${280 + seed % 20} 265 220" fill="none" stroke="black" stroke-width="8" />
  ${lines}
  <text x="180" y="330" text-anchor="middle" font-size="24" font-family="Verdana" fill="black">${title}</text>
</svg>`.trim();
}

function asDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const coloringPages: ColoringPage[] = categories.flatMap((category, cIdx) =>
  motifs[category].map((motif, idx) => {
    const title = `${motif}`;
    const id = `${category}-${idx + 1}`;
    return {
      id,
      title,
      category,
      src: asDataUrl(svgForPage(title, cIdx * 10 + idx + 1))
    };
  })
);

export function getRandomColoringPage(): ColoringPage {
  return coloringPages[Math.floor(Math.random() * coloringPages.length)];
}
