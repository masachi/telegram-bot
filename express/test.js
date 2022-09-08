import express from "express";
import { Telegraf } from "telegraf";

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token);
const app = express();

// Set the bot API endpoint
app.use(await bot.createWebhook({ domain: "https://unusual-bedclothes-crow.cyclic.app" }));

bot.on("text", ctx => ctx.reply("Hello"));

app.listen(3000, () => console.log("Listening on port", port));