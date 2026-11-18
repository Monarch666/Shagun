/**
 * Vintage 90s Disposable Film Filter
 * Applied client-side onto an HTML5 Canvas before compression and upload.
 */

export interface FilterOptions {
  vignette?: boolean;
  grain?: boolean;
  dateStamp?: boolean;
  dateText?: string;
  warmth?: number; // 0 to 1
}

/**
 * Applies vintage film look to a canvas with image data
 */
export function applyVintageFilmFilter(
  canvas: HTMLCanvasElement,
  options: FilterOptions = {}
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Color grading: Boost warm tones (golden/amber), soften blacks, lift midtones
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Warmth adjustment: add red/amber tint, slightly mute blues
    r = Math.min(255, r * 1.1 + 10);
    g = Math.min(255, g * 1.04 + 5);
    b = Math.max(0, b * 0.92 - 8);

    // Mild contrast curve (S-curve)
    r = r < 128 ? (r * r) / 128 : 255 - ((255 - r) * (255 - r)) / 128;
    g = g < 128 ? (g * g) / 128 : 255 - ((255 - g) * (255 - g)) / 128;
    b = b < 128 ? (b * b) / 128 : 255 - ((255 - b) * (255 - b)) / 128;

    // Add subtle analog film grain if requested
    if (options.grain !== false) {
      const grain = (Math.random() - 0.5) * 22;
      r = Math.max(0, Math.min(255, r + grain));
      g = Math.max(0, Math.min(255, g + grain));
      b = Math.max(0, Math.min(255, b + grain));
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(imgData, 0, 0);

  // 2. Soft Vignette Overlay
  if (options.vignette !== false) {
    const radius = Math.max(width, height) * 0.7;
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.35,
      width / 2,
      height / 2,
      radius
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.15)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.45)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. 90s Orange/Amber LCD Digital Date Stamp (e.g. "'26 11 17")
  if (options.dateStamp !== false) {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = options.dateText || `'${yy} ${mm} ${dd}`;

    const fontSize = Math.max(16, Math.round(width * 0.035));
    ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    const posX = width - Math.round(width * 0.04);
    const posY = height - Math.round(height * 0.04);

    // Subtle glow/blur behind date stamp
    ctx.shadowColor = 'rgba(255, 100, 0, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#FF9900'; // Classic 90s camera LED orange
    ctx.fillText(dateStr, posX, posY);

    // Reset shadow
    ctx.shadowBlur = 0;
  }

  return canvas;
}

