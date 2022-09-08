const { Telegraf } = require('telegraf')
const Koa = require('koa')
const koaBody = require('koa-body')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
bot.telegram.setWebhook('https://unusual-bedclothes-crow.cyclic.app/YukinoshitaKyaru')

bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'))

const app = new Koa()
app.use(koaBody())
app.use(async (ctx, next) => {
  if (ctx.method !== 'POST' || ctx.url !== '/YukinoshitaKyaru') {
    return next()
  }
  await bot.handleUpdate(ctx.request.body, ctx.response)
  ctx.status = 200
})
app.use(async (ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)