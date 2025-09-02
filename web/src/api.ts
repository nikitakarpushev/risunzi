export async function generate(file: File) {
  const fd = new FormData();
  fd.append('drawing', file);
  const r = await fetch(import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/generate', {
    method: 'POST',
    body: fd
  });
  return (await r.json()) as { ok: boolean; url?: string; error?: string };
}

export async function startPay(plan: 'start'|'family'|'pro') {
  const r = await fetch(import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/pay/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan })
  });
  return await r.json();
}

export async function createInvoice(plan: 'start'|'family'|'pro', method: 'stars'|'fiat') {
  // @ts-ignore
  const tg = (window as any).Telegram?.WebApp;
  const initData = tg?.initData || '';
  const r = await fetch((import.meta as any).env.VITE_API_URL + '/api/pay/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, method, initData })
  });
  return await r.json();
}
