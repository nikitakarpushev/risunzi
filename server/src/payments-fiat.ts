import { env } from './env.js';

export async function createFiatInvoiceLink(opts: { title: string; desc: string; payload: string; amountMinor: number; currency: 'RUB'|'USD' }) {
  const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/createInvoiceLink`;
  const body = {
    title: opts.title,
    description: opts.desc,
    payload: opts.payload,
    currency: opts.currency,
    prices: [{ label: 'Живой Рисунок', amount: opts.amountMinor }],
    provider_token: env.PROVIDER_TOKEN || ''
  };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!j.ok) throw new Error('createInvoiceLink (fiat) fail: ' + JSON.stringify(j));
  return j.result as string;
}
