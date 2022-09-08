const { Telegraf } = require("telegraf");
const {processPhotoMessage} = require('../service/photo');
const Koa = require('koa')
const koaBody = require('koa-body')

const APP_PORT = 3000;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
bot.telegram.setWebhook('https://unusual-bedclothes-crow.cyclic.app/YukinoshitaKyaru')

bot.start((ctx) => ctx.reply("用法问问dalao？"));
bot.help((ctx) => ctx.reply("没有帮助，问dalao去.jpg"));

bot.on('text', (ctx) => {
  ctx.reply("蛤？")
});

bot.on('video', (ctx) => {
    ctx.reply("不急，还没做.jpg")
});

bot.on('photo', async (ctx) => {
  const msgId = ctx.message.message_id;
  const message = ctx.message;
  const uploadedFile = await processPhotoMessage(ctx, message);
  if(uploadedFile.link) {
    ctx.reply(uploadedFile.link, {reply_to_message_id: msgId})
  }
  else {
    ctx.reply("好像出错了~", {reply_to_message_id: msgId})
  }
});

bot.on('sticker', (ctx) => {
  const msgId = ctx.message.message_id;
  console.error("ctx", ctx.message);
  ctx.reply("等一下做个上传 + gist push", {reply_to_message_id: msgId})
});

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
