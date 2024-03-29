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
const Eureka = require('eureka-js-client').Eureka;
const {default: agent} = require('skywalking-backend-js');

const githubRawBaseUrl = "https://raw.githubusercontent.com/masachi/files/main"

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
  console.log("photo message info", ctx.message, ctx.message.chat.id);
  if(ctx.message.chat.id.toString() !== "195999776") {
    ctx.reply("蛤？你好像不在用户白名单中");
  } else {
    const msgId = ctx.message.message_id;
    const message = ctx.message;
    const uploadedFile = await processPhotoMessage(ctx, message);
    if (uploadedFile.path) {
      let fileName = uploadedFile.path.replace("/file/", "");
      let folder = fileName.substring(0,2);
      ctx.reply(`${githubRawBaseUrl}/${folder}/${fileName}`, { reply_to_message_id: msgId });
    } else {
      ctx.reply("好像出错了~", { reply_to_message_id: msgId });
    }
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
  urlencoded: true,
  formLimit: '10mb'
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
      if(ctx?.request?.header?.authorization === process.env.UPLOAD_TOKEN) {
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

console.info("skywalking starting")
// skywalking
agent.start({
  serviceName: 'telegram-bot',
  serviceInstance: 'telegram-bot',
  collectorAddress: process.env.SKYWALKING_HOST,
  authorization: process.env.SKYWALKING_TOKEN,
});
console.info("skywalking started")

module.exports = app;

// // eureka
// const client = new Eureka({
//   // application instance information
//   instance: {
//     app: 'upload-service',
//     ipAddr: '52.53.116.73',
//     hostName: 'upload-service.bronya.autos',
//     port: {
//       '$': 3000,
//       '@enabled': true,
//     },
//     vipAddress: 'upload-service',
//     dataCenterInfo: {
//       '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
//       name: 'MyOwn',
//     }
//   },
//   eureka: {
//     // eureka server host / port
//     host: '101.226.96.92',
//     port: 8761,
//     servicePath: '/eureka/apps'
//   },
// });
// client.start();