// Process the selected images from _raw/ into _raw/processed/<slug>/ (gitignored)
// for review. After approval, `--publish` copies them into src/assets/projects/<slug>/.
// Usage: node scripts/images/process.mjs [--publish]
import sharp from 'sharp';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { images } from './manifest.mjs';

const RAW = '_raw';
const OUT = `${RAW}/processed`;
const MAX_W = 2000;
const publish = process.argv.includes('--publish');

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

async function applyPixelOps(input, ops) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const idx = (x, y) => (y * width + x) * 3;
  const set = (x, y, from) => {
    const i = idx(x, y);
    data[i] = data[from];
    data[i + 1] = data[from + 1];
    data[i + 2] = data[from + 2];
  };
  const blurs = [];
  for (const o of ops) {
    if (o.op === 'bgRows') {
      for (let y = o.y0; y <= Math.min(o.y1, height - 1); y++)
        for (let x = o.x0; x <= o.x1; x++) set(x, y, idx(o.refX, y));
    } else if (o.op === 'copyRow') {
      for (let y = o.y0; y <= o.y1; y++) for (let x = o.x0; x <= o.x1; x++) set(x, y, idx(x, o.srcY));
    } else if (o.op === 'copyCol') {
      for (let y = o.y0; y <= Math.min(o.y1, height - 1); y++)
        for (let x = o.x0; x <= o.x1; x++) set(x, y, idx(o.srcX, y));
    } else if (o.op === 'fill') {
      const [r, g, b] = hexToRgb(o.color);
      for (let y = o.y; y < o.y + o.h; y++)
        for (let x = o.x; x < o.x + o.w; x++) {
          const i = idx(x, y);
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
    } else if (o.op === 'blur') {
      blurs.push(o);
    }
  }
  let img = sharp(data, { raw: { width, height, channels: 3 } });
  if (blurs.length) {
    const base = await img.png().toBuffer();
    const patches = await Promise.all(
      blurs.map(async (b) => ({
        input: await sharp(base).extract({ left: b.x, top: b.y, width: b.w, height: b.h }).blur(6).toBuffer(),
        left: b.x,
        top: b.y,
      })),
    );
    img = sharp(base).composite(patches);
  }
  return img.png().toBuffer();
}

async function processOne(item) {
  const src = `${RAW}/${item.src}`;
  const isPhoto = /\.jpe?g$/i.test(item.src);
  let buf = item.ops?.length ? await applyPixelOps(src, item.ops) : await sharp(src).rotate().toBuffer();
  let img = sharp(buf);
  if (item.crop) img = img.extract(item.crop);
  buf = await img.toBuffer();

  if (item.aspect) {
    const { width, height } = await sharp(buf).metadata();
    const target = item.aspect;
    if (width / height < target) {
      const pad = Math.round(height * target) - width;
      buf = await sharp(buf)
        .extend({ left: Math.floor(pad / 2), right: Math.ceil(pad / 2), extendWith: 'copy' })
        .toBuffer();
    } else {
      const pad = Math.round(width / target) - height;
      buf = await sharp(buf)
        .extend({ top: Math.floor(pad / 2), bottom: Math.ceil(pad / 2), extendWith: 'copy' })
        .toBuffer();
    }
  }

  const resized = sharp(buf).resize({ width: MAX_W, withoutEnlargement: true });
  const ext = isPhoto ? 'jpg' : 'png';
  const out = isPhoto ? resized.jpeg({ quality: 88, mozjpeg: true }) : resized.png({ compressionLevel: 9 });
  mkdirSync(`${OUT}/${item.slug}`, { recursive: true });
  const file = `${OUT}/${item.slug}/${item.name}.${ext}`;
  const info = await out.toFile(file);
  return { ...item, file, ext, width: info.width, height: info.height };
}

const results = [];
for (const item of images) results.push(await processOne(item));
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(results, null, 2));
for (const r of results) console.log(`${r.file}  ${r.width}x${r.height}`);

if (publish) {
  for (const r of results) {
    const dir = `src/assets/projects/${r.slug}`;
    mkdirSync(dir, { recursive: true });
    copyFileSync(r.file, `${dir}/${r.name}.${r.ext}`);
  }
  console.log('published to src/assets/projects/');
}
