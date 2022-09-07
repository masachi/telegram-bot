const { Telegraf } = require('telegraf');
const { Application, Router } = require('@cfworker/web');
const createTelegrafMiddleware = require('cfworker-middleware-telegraf');
const {processPhotoMessage} = require("../service/photo");

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Your code here, but do not `bot.launch()`
// Do not forget to set environment variables BOT_TOKEN and SECRET_PATH on your worker
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
  const uploadedFile = await processPhotoMessage(message);
  if(uploadedFile.link) {
    ctx.reply(uploadedFile.link, {reply_to_message_id: msgId})
  }
  else {
    ctx.reply("好像出错了~", {reply_to_message_id: msgId})
  }
});

// bot.on('sticker', (ctx) => {
//   const msgId = ctx.message.message_id;
//   console.error("ctx", ctx.message);
//   ctx.reply("等一下做个上传 + gist push", {reply_to_message_id: msgId}) 
// });


const router = new Router();
router.post(`/${SECRET_PATH}`, createTelegrafMiddleware(bot));
new Application().use(router.middleware).listen();