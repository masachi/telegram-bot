const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

const port = process.env.PORT || 9000;
const express = require('express');

const app = express();

// parse the updates to JSON
app.use(express.json());

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

console.error("token", token);
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "没有帮助，问dalao去.jpg");
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '蛤？');
});

bot.on('video', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '不急，还没做.jpg');
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const msgId = msg.message_id;
    bot.sendMessage(chatId, '等一下做个上传 + gist push', {reply_to_message_id: msgId});
});

module.exports = app;