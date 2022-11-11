const { Telegraf } = require("telegraf");
const { processPhotoMessage } = require("../service/photo");
const Koa = require("koa");
const koaBody = require("koa-body");
const router = require('koa-router')();
const compress = require('koa-compress');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const responseHandler = require('../middleware/ResponseHandler');
const cors = require('@koa/cors');

const APP_PORT = 3000;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/${process.env.WEBHOOK_PATH}`;
const webhookPath = `/${process.env.WEBHOOK_PATH}`;
const {uploadImage} = require("../service/upload");

bot.telegram.setWebhook(webhookUrl);

bot.start((ctx) => ctx.reply("用法问问dalao？"));
bot.help((ctx) => ctx.reply("没有帮助，问dalao去.jpg"));

bot.on("text", async (ctx) => {
  const message = ctx.message;
  console.log("message info", message);
  ctx.reply("蛤？dalao在说什么？");
});

bot.on("video", (ctx) => {
  ctx.reply("不急，还没做.jpg");
});

bot.on("photo", async (ctx) => {
  const msgId = ctx.message.message_id;
  const message = ctx.message;
  const uploadedFile = await processPhotoMessage(ctx, message);
  if (uploadedFile.link) {
    ctx.reply(uploadedFile.link, { reply_to_message_id: msgId });
  } else {
    ctx.reply("好像出错了~", { reply_to_message_id: msgId });
  }
});

bot.on("sticker", (ctx) => {
  const msgId = ctx.message.message_id;
  console.error("ctx", ctx.message);
  ctx.reply("等一下做个上传 + gist push", { reply_to_message_id: msgId });
});

const app = new Koa();
app.use(cors());
app.use(koaBody({
  multipart: true,
  urlencoded: true
}));
app.use(bodyParser());
app.use(json());
app.use(compress());

app.use(responseHandler);

app.use(async (ctx, next) => {
  if (ctx.method !== "POST" || ctx.url !== webhookPath) {
    return next();
  }
  await bot.handleUpdate(ctx.request.body, ctx.response);
  ctx.status = 200;
});
// app.use(async (ctx) => {
//   ctx.body = {
//     webhookUrl: webhookUrl,
//     webhookPath: webhookPath,
//   };
// });

router.post('/api/upload', async (ctx, next) => {
  if(ctx?.request?.header) {
    if(ctx?.request?.header?.authorization) {
      if(ctx?.request?.header?.authorization === 'fa1385ffecef4945b0ddfd505a6a2bca') {
        if(ctx?.request?.files?.file) {
          const file = ctx.request.files.file;
          return await uploadImage(file);
        }
        else {
          return new Error("file not exist")
        }
      }
    }
    else {
      throw new Error("authorization invalid")
    }
  }

  throw new Error("Internal Server Error");
});



app.use(router.routes())
app.listen(3000);
