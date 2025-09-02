import React, { useMemo, useState } from 'react';
import { generate, createInvoice } from './api';

export default function App() {
  const [file, setFile] = useState<File|null>(null);
  const [preview, setPreview] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const disabled = useMemo(() => !file || loading, [file, loading]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult('');
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function onGenerate() {
    if (!file) return;
    setLoading(true); setMessage('Оживляем рисунок…');
    const r = await generate(file);
    if ((r as any).ok && (r as any).url) {
      setResult((r as any).url);
      setMessage('Готово! Поделись и разблокируй эмоции.');
    } else {
      setMessage('Ошибка генерации. Попробуй другое фото.');
    }
    setLoading(false);
  }

  function onShare() {
    const text = 'Мой оживлённый рисунок!';
    const url = result || 'https://t.me';
    if (navigator.share) {
      navigator.share({ title: 'Живой Рисунок', text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      setMessage('Ссылка скопирована!');
    }
  }

  async function onPay(method: 'stars'|'fiat', plan: 'start'|'family'|'pro') {
    setMessage('Оформляем…');
    const r = await createInvoice(plan, method);
    if (r?.ok && r.invoice_link) {
      // @ts-ignore
      const tg = (window as any).Telegram?.WebApp;
      tg?.openInvoice(r.invoice_link, (status: string) => {
        if (status === 'paid') setMessage('Оплата прошла! Эмоции разблокированы.');
        else if (status === 'cancelled') setMessage('Оплата отменена.');
        else setMessage('Статус: ' + status);
      });
    } else setMessage('Не удалось создать счёт');
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold">Живой Рисунок</h1>
        <p className="text-sm text-gray-600 mb-4">Загрузи рисунок — получи живую анимацию и стикеры.</p>

        <label className="block">
          <input type="file" accept="image/*" onChange={onPick} className="hidden" />
          <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer bg-white">
            {preview ? (
              <img src={preview} className="max-h-64 mx-auto rounded-lg"/>
            ) : (
              <span className="text-gray-500">Нажми, чтобы выбрать фото рисунка</span>
            )}
          </div>
        </label>

        <button onClick={onGenerate} disabled={disabled} className="w-full mt-4 py-3 rounded-xl bg-black text-white disabled:opacity-40">
          {loading ? 'Оживляем…' : 'Оживить'}
        </button>

        {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}

        {result && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <img src={result} className="w-full rounded-lg"/>
            <div className="flex gap-2 mt-4">
              <button onClick={onShare} className="flex-1 py-2 rounded-lg border">Поделиться</button>
              <button onClick={() => onPay('stars', 'start')} className="flex-1 py-2 rounded-lg bg-emerald-600 text-white">Оплатить звёздами</button>
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => onPay('fiat', 'start')} className="flex-1 py-2 rounded-lg bg-black text-white">Оплатить картой</button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Доступно в PRO: видео, озвучка, ещё эмоции</div>
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500">
          Нажимая «Оживить», ты соглашаешься с правилами. Контент проверяется на соответствие политике и может быть удалён.
        </div>
      </div>
    </div>
  );
}
