const express = require('express')
const { Telegraf } = require('telegraf');

const app = express()

const APP_PORT = 3000
const token = process.env.TELEGRAM_BOT_TOKEN;
const CURRENT_HOST = "https://telegram-bot-omega-nine.vercel.app/"

const bot = new Telegraf(token);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

app.listen(APP_PORT, () => {
  console.log(`listening on ${APP_PORT}`)
})