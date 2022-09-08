const { Telegraf } = require("telegraf");
const Koa = require("koa")
const koaBody = require("koa-body");

const APP_PORT = 3000;
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token);
const app = new Koa();

// First reply will be served via webhook response,
// but messages order not guaranteed due to `koa` pipeline design.
// Details: https://github.com/telegraf/telegraf/issues/294
bot.command("image", ctx =>
	ctx.replyWithPhoto({ url: "https://picsum.photos/200/300/?random" }),
);
bot.on("text", ctx => ctx.reply("Hello"));

app.use(koaBody());

app.use(async (ctx, next) =>
	(await bot.createWebhook({ domain: "https://unusual-bedclothes-crow.cyclic.app" }))(ctx.req, ctx.res, next),
);

app.listen(APP_PORT, () => console.log("Listening on port", APP_PORT));