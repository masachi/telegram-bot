const express = require('express')
const Telegraf = require('telegraf')

const app = express()

const APP_PORT = 3000
const token = process.env.TELEGRAM_BOT_TOKEN;
const CURRENT_HOST = "https://telegram-bot-omega-nine.vercel.app/"

const bot = new Telegraf(token, {
  telegram: {
    webhookReply: false
  }
})

bot.on('text', ctx => {
  return ctx.reply(
    `msg recebida de: ${ctx.message.from.username}`
  )
})

app.use(bot.webhookCallback('/callback'))

app.get('/', async (_req, res) => {
  const url = `${CURRENT_HOST}/callback`
  await bot.telegram.setWebhook(url)
  res.send(`listening on ${CURRENT_HOST}`)
})

app.listen(APP_PORT, () => {
  console.log(`listening on ${APP_PORT}`)
})