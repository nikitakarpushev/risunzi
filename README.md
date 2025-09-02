# Живой Рисунок — Telegram Mini App (MVP)

Бот + Mini App (React) + API/генерация (Node/TypeScript). Локальный запуск и деплой на Railway/Render + Vercel/Cloudflare Pages.

## Быстрый старт (локально)

1) Создай файл `server/.env` на основе `server/.env.example`.
2) В двух терминалах запусти фронт и бэк:

```bash
cd web && npm i && npm run dev
# в другом окне:
cd server && npm i && npm run dev
```

3) Напиши боту `/start` в Telegram — появится кнопка запуска Mini App.
4) Загрузите фото рисунка, получите GIF-анимацию и протестируйте оплату (Stars/фиат).

## Переменные окружения

Смотри `server/.env.example`. Минимум:
```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_WEBAPP_URL=http://localhost:5173
PUBLIC_URL=http://localhost:8080
# Для фиатных платежей:
PROVIDER_TOKEN=<из BotFather для платежного провайдера>
```

## GitHub: как загрузить репозиторий

1) Распакуй архив в папку `live-drawings` и перейди в неё.
2) Инициализируй git и запушь в пустой репозиторий:

```bash
git init
git add .
git commit -m "feat: initial MVP (bot + mini app + payments + referrals)"
git branch -M main
git remote add origin https://github.com/<ВАШ_ЛОГИН>/<ИМЯ_РЕПО>.git
git push -u origin main
```

> Если включена 2FA или нужен SSH, настройте `gh auth login` или `ssh-keygen` → добавьте ключ в GitHub.

## Деплой (кратко)

- **Backend**: Railway/Render. Node 20, команда запуска: `npm run start` (предварительно `npm run build`). Укажи переменные `.env`.
- **Frontend**: Vercel/Cloudflare Pages. Vite build: `npm run build`, output: `dist/`.
- **Webhook**: выставь публичный HTTPS и включи webhook у бота (см. `server/src/tg-bot.ts`).

## Папки

- `server/` — API, генерация, платежи, бот.
- `web/` — React Mini App (Vite + Tailwind).

## Лицензия

MIT — делай fork и адаптируй под свой продакшен.
