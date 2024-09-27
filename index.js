const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token from BotFather
const TOKEN = '837199932:AAF5Se7BbzAjQnbf1epU5yIaNbcFrgwCxo8';

const bot = new TelegramBot(TOKEN, { polling: true });

// Handle '/start' command to send the game
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send the game using the correct short name
  bot.sendGame(chatId, 'gallwenclicker');
});

// Handle callback queries to launch the game within Telegram
bot.on('callback_query', (callbackQuery) => {
  const gameUrl = 'https://gallwen.github.io/telegram-clicker-game/';
  bot.answerCallbackQuery(callbackQuery.id, { url: gameUrl });
});
