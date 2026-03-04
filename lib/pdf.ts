import { jsPDF } from 'jspdf';

export async function exportToPdf(imageDataUrl: string, title: string) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm', orientation: 'portrait' });
  const margin = 10;
  const pageW = 210;
  const pageH = 297;
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = imageDataUrl;
  });

  const ratio = Math.min(maxW / img.width, maxH / img.height);
  const drawW = img.width * ratio;
  const drawH = img.height * ratio;
  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  doc.addImage(imageDataUrl, 'PNG', x, y, drawW, drawH);
  const safeTitle = title.replace(/\s+/g, '_');
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`SeedPalette_${safeTitle}_${date}.pdf`);
}
