import { env } from './env.js';

export async function createStarsInvoiceLink(opts: { title: string; desc: string; payload: string; amountStars: number }) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/createInvoiceLink`;
  const body = {
    title: opts.title,
    description: opts.desc,
    payload: opts.payload,
    currency: 'XTR',
    prices: [{ label: 'Живой Рисунок', amount: opts.amountStars }],
    provider_token: ''
  };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!j.ok) throw new Error('createInvoiceLink (stars) fail: ' + JSON.stringify(j));
  return j.result as string;
}
