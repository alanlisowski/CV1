#!/usr/bin/env node
/**
 * Generates raster icon fallbacks from scratch using zero npm dependencies.
 *
 * Outputs (project root):
 *   icon.png        512×512  — <link rel="icon" sizes="512x512">
 *   apple-icon.png  180×180  — <link rel="apple-touch-icon">
 *   favicon.ico     32×32 + 16×16 embedded PNGs
 *
 * The SVG favicon (icon.svg) is the primary modern favicon.
 * These rasters exist only as fallbacks for older browsers / OS icon caches.
 *
 * Design: primary-blue (#4d7cff) rounded square on transparent background,
 * matching the icon.svg colour palette.
 *
 * Run:
 *   node scripts/build-icons.mjs
 */

import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');

// ── CRC32 ────────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let v = 0xffffffff;
  for (const b of buf) v = crcTable[(v ^ b) & 255] ^ (v >>> 8);
  return (v ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = Buffer.from(data);
  const len = Buffer.allocUnsafe(4); len.writeUInt32BE(d.length);
  const crcInput = Buffer.concat([t, d]);
  const crcBuf = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, t, d, crcBuf]);
}

// ── PNG encoder (RGBA, color type 6) ─────────────────────────────────────────
function makePng(size, drawPixel) {
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.allocUnsafe(1 + size * 4);
    row[0] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = drawPixel(x, y, size);
      const i = 1 + x * 4;
      row[i] = r; row[i + 1] = g; row[i + 2] = b; row[i + 3] = a;
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows);
  const compressed = deflateSync(raw, { level: 9 });

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8]  = 8; // bit depth
  ihdr[9]  = 6; // color type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Draw function: rounded square, primary blue on transparent ───────────────
// Primary: #4d7cff  Dark bg: #1a2035
function drawIcon(x, y, size) {
  const pad = Math.round(size * 0.04);
  const r   = Math.round(size * 0.22); // corner radius
  const x0 = pad, y0 = pad, x1 = size - 1 - pad, y1 = size - 1 - pad;

  function inRoundedRect() {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    // Corner checks
    if (x < x0 + r && y < y0 + r) return hypot(x - (x0 + r), y - (y0 + r)) <= r;
    if (x > x1 - r && y < y0 + r) return hypot(x - (x1 - r), y - (y0 + r)) <= r;
    if (x < x0 + r && y > y1 - r) return hypot(x - (x0 + r), y - (y1 - r)) <= r;
    if (x > x1 - r && y > y1 - r) return hypot(x - (x1 - r), y - (y1 - r)) <= r;
    return true;
  }

  if (inRoundedRect()) return [0x4d, 0x7c, 0xff, 255]; // #4d7cff opaque
  return [0, 0, 0, 0]; // transparent
}
function hypot(a, b) { return Math.sqrt(a * a + b * b); }

// ── ICO encoder ──────────────────────────────────────────────────────────────
function makeIco(images) {
  // images: [{ size, png }]
  const header = Buffer.allocUnsafe(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(images.length, 4);

  const dirs = images.map(() => Buffer.allocUnsafe(16));
  let offset = 6 + images.length * 16;
  for (let i = 0; i < images.length; i++) {
    const { size, png } = images[i];
    const d = dirs[i];
    d[0] = size >= 256 ? 0 : size;
    d[1] = size >= 256 ? 0 : size;
    d[2] = 0; d[3] = 0;
    d.writeUInt16LE(1, 4);
    d.writeUInt16LE(32, 6);
    d.writeUInt32LE(png.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += png.length;
  }
  return Buffer.concat([header, ...dirs, ...images.map(i => i.png)]);
}

// ── Generate & write ─────────────────────────────────────────────────────────
const png512 = makePng(512, drawIcon);
const png180 = makePng(180, drawIcon);
const png32  = makePng(32,  drawIcon);
const png16  = makePng(16,  drawIcon);
const ico    = makeIco([{ size: 32, png: png32 }, { size: 16, png: png16 }]);

writeFileSync(resolve(root, 'icon.png'),       png512);
writeFileSync(resolve(root, 'apple-icon.png'), png180);
writeFileSync(resolve(root, 'favicon.ico'),    ico);

console.log('✓ icon.png (512×512)');
console.log('✓ apple-icon.png (180×180)');
console.log('✓ favicon.ico (32×32 + 16×16)');
