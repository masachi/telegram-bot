const Telegraf = require('telegraf')
const express = require('express')
const APP_PORT = 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token);

bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'))

// Set telegram webhook
bot.telegram.setWebhook('https://unusual-bedclothes-crow.cyclic.app/YukinoshitaKyaru')

const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.use(bot.webhookCallback('/YukinoshitaKyaru'))
app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})