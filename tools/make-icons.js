// Zero-dependency PNG icon generator for Airplane Mode (uses only node's zlib).
// Draws the app mark (a navy plane, tilted for takeoff, on life-vest amber) at the sizes a phone wants.
// Usage: node tools/make-icons.js   (writes into site/icons/, which the build copies into dist/)
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'site', 'icons');
const AMBER = [255, 182, 39], NAVY = [13, 24, 48];

// ---------- minimal PNG encoder ----------
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = -1; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function encodePNG(w, h, rgba) {
  const stride = w * 4 + 1, raw = Buffer.alloc(stride * h);
  for (let y = 0; y < h; y++) { raw[y * stride] = 0; rgba.copy(raw, y * stride + 1, y * w * 4, (y + 1) * w * 4); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// The plane from the app's wordmark glyph, pointing up, in a 24-unit box.
const PLANE = [[21, 16], [21, 14], [13, 9], [13, 3.5], [12.6, 2.4], [11.5, 2], [10.4, 2.4], [10, 3.5], [10, 9], [2, 14], [2, 16], [10, 13.5],
  [10, 19], [8, 20.5], [8, 22], [11.5, 21], [15, 22], [15, 20.5], [13, 19], [13, 13.5]];
function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function inRounded(x, y, size, r) {
  const cx = Math.min(Math.max(x, r), size - r), cy = Math.min(Math.max(y, r), size - r);
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

// Renders one icon. `bleed` fills the whole square (maskable, Apple); otherwise a rounded tile.
function icon(size, { bleed, planeScale }) {
  const SS = 4, px = Buffer.alloc(size * size * 4);
  const scale = (size * planeScale) / 24, ang = Math.PI / 4, cos = Math.cos(-ang), sin = Math.sin(-ang);
  const pts = PLANE.map(([x, y]) => [x - 11.5, y - 12]); // centred on the plane's own middle
  const radius = size * 0.22;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let tile = 0, plane = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = x + (sx + 0.5) / SS, fy = y + (sy + 0.5) / SS;
          if (!bleed && !inRounded(fx, fy, size, radius)) continue;
          tile++;
          // rotate the sample back into the upright plane's space (the plane leans 45 degrees, up and to the right)
          const dx = (fx - size / 2) / scale, dy = (fy - size / 2) / scale;
          if (inPoly(dx * cos - dy * sin, dx * sin + dy * cos, pts)) plane++;
        }
      }
      const i = (y * size + x) * 4, n = SS * SS;
      const a = tile / n, p = tile ? plane / tile : 0;
      for (let k = 0; k < 3; k++) px[i + k] = Math.round(AMBER[k] * (1 - p) + NAVY[k] * p);
      px[i + 3] = Math.round(a * 255);
    }
  }
  return encodePNG(size, size, px);
}

fs.mkdirSync(OUT, { recursive: true });
const jobs = [
  ['icon-192.png', 192, { bleed: false, planeScale: 0.62 }],
  ['icon-512.png', 512, { bleed: false, planeScale: 0.62 }],
  ['icon-maskable-192.png', 192, { bleed: true, planeScale: 0.5 }],
  ['icon-maskable-512.png', 512, { bleed: true, planeScale: 0.5 }],
  ['apple-touch-icon.png', 180, { bleed: true, planeScale: 0.56 }],
  ['favicon-32.png', 32, { bleed: false, planeScale: 0.7 }]
];
jobs.forEach(([name, size, opts]) => { fs.writeFileSync(path.join(OUT, name), icon(size, opts)); console.log('wrote icons/' + name); });
