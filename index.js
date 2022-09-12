import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import * as cronJob from 'node-cron';

import { addPlayer, removePlayer, printPlayers, removeListPlayers } from './request.js'

dotenv.config();
cronJob.schedule('0 0 * * Wed', function () {
  console.log(`every Wednesday`)
  removeListPlayers();
});

const bot = new Telegraf(process.env.botToken);

export let players = [];

bot.hears('+', async (ctx) => {
  let dayOfWeek = new Date().getDay()
  let hourOfDay = new Date().getHours();
  if (dayOfWeek == 1 || (dayOfWeek == 2 && hourOfDay <= 20)) {
    addPlayer(ctx)
  } else {
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Отмечаемся по понедельникам и вторникам до 20:00`);
  }
});

bot.hears('-', async (ctx) => {
  removePlayer(ctx);
  await ctx.telegram.sendMessage(ctx.message.chat.id, printPlayers());
});

bot.hears('clear', async (ctx) => {
  await ctx.telegram.sendMessage(ctx.message.chat.id, 'Удаляю всех отметившихся их списка...');
  removeListPlayers();
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));