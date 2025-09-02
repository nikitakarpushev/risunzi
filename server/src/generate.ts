import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';
import { env } from './env.js';

export async function makeAnimatedGif(inputPath: string, outName: string) {
  const img = await loadImage(inputPath);
  const size = 512;
  const frames = 16;
  const fps = 12;

  const encoder = new GIFEncoder(size, size);
  const outFile = path.join(env.GENERATED_DIR, `${outName}.gif`);
  fs.mkdirSync(env.GENERATED_DIR, { recursive: true });
  const stream = fs.createWriteStream(outFile);
  encoder.createReadStream().pipe(stream);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000 / fps);
  encoder.setQuality(10);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < frames; i++) {
    const t = i / frames;
    const wobble = Math.sin(t * Math.PI * 2) * 6;
    const scale = 1 + Math.sin(t * Math.PI * 2) * 0.02;

    ctx.clearRect(0, 0, size, size);

    // white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const targetW = size * 0.9 * scale;
    const targetH = (img.height / img.width) * targetW;
    const x = (size - targetW) / 2;
    const y = (size - targetH) / 2 + wobble;

    ctx.drawImage(img, x, y, targetW, targetH);

    if (i % 8 === 0) {
      ctx.fillStyle = 'rgba(255,215,0,0.8)';
      ctx.beginPath();
      ctx.arc(size * 0.85, size * 0.18, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // @ts-ignore
    encoder.addFrame(ctx);
  }

  encoder.finish();

  await new Promise<void>((res) => stream.on('close', () => res()));
  return outFile;
}
