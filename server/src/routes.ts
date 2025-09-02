import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import multer from 'multer';
import { env } from './env.js';
import { makeAnimatedGif } from './generate.js';
import { startPayment } from './payments.js';
import { claimReferral } from './referrals.js';
import { verifyWebAppInitData } from './auth.js';
import { setReferrer } from './referral-store.js';
import { createStarsInvoiceLink } from './payments-stars.js';
import { createFiatInvoiceLink } from './payments-fiat.js';

const uploadDir = env.UPLOAD_DIR;
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

export function buildRouter() {
  const router = express.Router();

  router.get('/health', (_req, res) => res.json({ ok: true }));

  router.post('/generate', upload.single('drawing'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'no_file' });
      const basename = path.basename(file.filename, path.extname(file.filename));
      const gifPath = await makeAnimatedGif(file.path, basename);
      const publicUrl = `${env.PUBLIC_URL}/generated/${path.basename(gifPath)}`;
      return res.json({ ok: true, url: publicUrl });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false, error: 'generation_failed' });
    }
  });

  // Auth verify initData
  router.post('/auth/verify-init', express.json(), (req, res) => {
    const { initData } = req.body as { initData: string };
    const r = verifyWebAppInitData(initData, env.TELEGRAM_BOT_TOKEN);
    if (!r.ok) return res.status(401).json(r);
    if (r.user) {
      const uid = r.user.id as number;
      if (r.startParam?.startsWith('ref_')) {
        const refId = Number(r.startParam.slice(4));
        if (Number.isFinite(refId) && refId !== uid) setReferrer(uid, refId);
      }
    }
    return res.json(r);
  });

  // create invoice link (Stars or fiat)
  router.post('/pay/create', express.json(), async (req, res) => {
    try {
      const { plan, method, initData } = req.body as { plan: 'start'|'family'|'pro'; method: 'stars'|'fiat'; initData: string };
      const v = verifyWebAppInitData(initData, env.TELEGRAM_BOT_TOKEN);
      if (!v.ok || !v.user) return res.status(401).json({ ok: false });
      const prices = { start: { stars: 300, rubMinor: 29900 }, family: { stars: 900, rubMinor: 59900 }, pro: { stars: 1500, rubMinor: 99900 } } as const;
      const p = prices[plan];
      const payload = JSON.stringify({ plan, uid: v.user.id, ts: Date.now() });
      const link = method === 'stars'
        ? await createStarsInvoiceLink({ title: 'Живой Рисунок', desc: 'Пакет ' + plan, payload, amountStars: p.stars })
        : await createFiatInvoiceLink({ title: 'Живой Рисунок', desc: 'Пакет ' + plan, payload, amountMinor: p.rubMinor, currency: 'RUB' });
      return res.json({ ok: true, invoice_link: link });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ ok: false });
    }
  });

  // legacy mocks
  router.post('/pay/start', express.json(), startPayment);
  router.post('/ref/claim', express.json(), claimReferral);

  return router;
}
