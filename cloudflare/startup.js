const { Telegraf } = require('telegraf');
const bot = new Telegraf("5616034370:AAFRfljBgPf4Z_GEl_LBnGNVAlhsfKdQg-E");

(async () => {
    // set webhook
    await bot.telegram.setWebhook('https://bot.masachi.workers.dev/YukinoshitaKyaru');

    // delete webhook
    // await bot.telegram.deleteWebhook();

    // get webhook info
    await bot.telegram.getWebhookInfo().then(console.log);
})();