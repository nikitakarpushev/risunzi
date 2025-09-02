import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { env } from './env.js';
import { buildRouter } from './routes.js';
import { initBot } from './tg-bot.js';

async function main() {
  const app = express();
  app.use(morgan('dev'));
  app.use(cors({ origin: env.ORIGIN }));

  app.use('/generated', express.static(path.resolve(env.GENERATED_DIR)));
  app.use('/api', buildRouter());

  const bot = initBot();
  bot.launch().then(() => console.log('Bot launched (polling)'));
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  app.listen(env.PORT, () => {
    console.log(`API on :${env.PORT}`);
  });
}

main();
