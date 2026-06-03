#!/usr/bin/env node
/**
 * Generates og-image.png (1200×630) — OG / Twitter card image.
 *
 * Approach: pure Node.js built-ins, zero npm dependencies.
 * Outputs a dark-gradient background matching the site palette.
 *
 * To add the "Alan Lisowski / Front-end Developer" text overlay:
 *   Option A — Figma / Canva (recommended for a one-off):
 *     1. Open og-preview.html in a browser (same folder as this script).
 *     2. Screenshot the 1200×630 area, save as og-image.png in the project root.
 *
 *   Option B — canvas npm package:
 *     npm install canvas
 *     node scripts/build-og-canvas.mjs   (see that file for the canvas version)
 *
 * Run:
 *   node scripts/build-og.mjs
 */

import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const W = 1200;
const H = 630;
const __dir = dirname(fileURLToPath(import.meta.url));

// ── CRC32 ───────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const dataBuf = Buffer.from(data);
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(dataBuf.length);
  const crcInput = Buffer.concat([typeBytes, dataBuf]);
  const crcBytes = Buffer.allocUnsafe(4);
  crcBytes.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, dataBuf, crcBytes]);
}

// ── Pixel data ───────────────────────────────────────────────────────────────
// Gradient: top-left #252d45 (--light dark) → bottom-right #0f1520 (--footer-bg)
// with a faint blue accent strip on the left edge using --primary #4d7cff
const rows = [];
for (let y = 0; y < H; y++) {
  const ty = y / (H - 1);
  const row = Buffer.allocUnsafe(1 + W * 3);
  row[0] = 0; // PNG filter: None
  for (let x = 0; x < W; x++) {
    const tx = x / (W - 1);
    // Base gradient
    const r = Math.round(0x25 + (0x0f - 0x25) * ty + (0x1a - 0x25) * tx);
    const g = Math.round(0x2d + (0x15 - 0x2d) * ty + (0x20 - 0x2d) * tx);
    const b = Math.round(0x45 + (0x20 - 0x45) * ty + (0x35 - 0x45) * tx);
    // Blue accent strip on left (x < 8px): blend with --primary #4d7cff
    const accentStrength = x < 8 ? (1 - x / 8) * 0.9 : 0;
    const i = 1 + x * 3;
    row[i]     = Math.round(r * (1 - accentStrength) + 0x4d * accentStrength);
    row[i + 1] = Math.round(g * (1 - accentStrength) + 0x7c * accentStrength);
    row[i + 2] = Math.round(b * (1 - accentStrength) + 0xff * accentStrength);
  }
  rows.push(row);
}

const rawData = Buffer.concat(rows);
const compressed = deflateSync(rawData, { level: 9 });

// ── IHDR ─────────────────────────────────────────────────────────────────────
const ihdr = Buffer.allocUnsafe(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8]  = 8; // bit depth
ihdr[9]  = 2; // color type: RGB
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
]);

const outPath = resolve(__dir, '..', 'og-image.png');
writeFileSync(outPath, png);
console.log(`✓ og-image.png written (${W}×${H})`);
