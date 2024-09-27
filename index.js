
const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual bot token
const TOKEN = '837199932:AAF5Se7BbzAjQnbf1epU5yIaNbcFrgwCxo8';

const bot = new TelegramBot(TOKEN, { polling: true });

// Handle '/start' command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send the game using the correct short name
  bot.sendGame(chatId, 'YOUR_GAME_SHORT_NAME');
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
  const gameUrl = 'https://t.me/Viabtcbot?game=Winbtc88/';

  bot.answerCallbackQuery(callbackQuery.id, {
    url: gameUrl,
  });
});
