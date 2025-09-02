import crypto from 'node:crypto';

function buildDataCheckString(params: URLSearchParams) {
  const entries = Array.from(params.entries())
    .filter(([k]) => k !== 'hash')
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([k,v]) => `${k}=${v}`)
    .join('\n');
  return entries;
}

export function verifyWebAppInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false, reason: 'no_hash' } as const;

  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const dataCheckString = buildDataCheckString(params);
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

  const ok = hmac === hash;
  if (!ok) return { ok: false, reason: 'bad_hash' } as const;

  const user = params.get('user') ? JSON.parse(params.get('user')!) : null;
  const startParam = params.get('start_param') || '';
  return { ok: true, user, startParam } as const;
}
