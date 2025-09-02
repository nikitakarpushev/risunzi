import { Telegraf, Markup } from 'telegraf';
import { env } from './env.js';
import { markPaid, getReferrer } from './referral-store.js';

export function initBot() {
  const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

  bot.start((ctx) => {
    ctx.reply(
      'Оживи рисунок ребёнка в пару кликов — запускай Mini App!',
      Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 Запустить', env.TELEGRAM_WEBAPP_URL)]
      ])
    );
  });

  bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

  bot.on('message', async (ctx) => {
    const m: any = ctx.message;
    if (m?.successful_payment) {
      const uid = m.from.id as number;
      markPaid(uid);
      const ref = getReferrer(uid);
      if (ref && ref !== uid) {
        try {
          await ctx.telegram.sendMessage(ref, '🎉 Твой друг оформил первую покупку! Начислен бонус.');
        } catch (e) { console.error('notify referrer', e); }
      }
      try { await ctx.reply('Спасибо за оплату! Эмоции разблокированы.'); } catch {}
    }
  });

  return bot;
}
