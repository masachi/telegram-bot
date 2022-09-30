const { Telegraf } = require("telegraf");
const { processPhotoMessage } = require("../service/photo");
const Koa = require("koa");
const koaBody = require("koa-body");

const APP_PORT = 3000;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/${process.env.WEBHOOK_PATH}`;
const webhookPath = `/${process.env.WEBHOOK_PATH}`;
const ogs = require("open-graph-scraper");

bot.telegram.setWebhook(webhookUrl);

bot.start((ctx) => ctx.reply("用法问问dalao？"));
bot.help((ctx) => ctx.reply("没有帮助，问dalao去.jpg"));

bot.on("text", (ctx) => {
  const message = ctx.message;
  console.log("message info", message, message.entities, message.entities[0].type);
  if (message.entities && message.entities.length > 0) {
    if(message.entities[0].type === 'url') {
      ogs({ url: message.text }).then((data) => {
        const { error, result, response } = data;
        console.log("error:", error); // This returns true or false. True if there was an error. The error itself is inside the results object.
        console.log("result:", result); // This contains all of the Open Graph results
        console.log("response:", response); // This contains the HTML of page
        ctx.reply("link yes!");
        return;
      });
    }
  }
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
app.use(koaBody());
app.use(async (ctx, next) => {
  if (ctx.method !== "POST" || ctx.url !== webhookPath) {
    return next();
  }
  await bot.handleUpdate(ctx.request.body, ctx.response);
  ctx.status = 200;
});
app.use(async (ctx) => {
  ctx.body = {
    webhookUrl: webhookUrl,
    webhookPath: webhookPath,
  };
});

app.listen(3000);
