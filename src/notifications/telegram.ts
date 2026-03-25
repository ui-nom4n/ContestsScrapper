import axios from 'axios';
import { Contest } from '../models/contest';
import { logger } from '../utils/logger';

export async function sendTelegramNotification(contests: Contest[]): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    logger.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not found. Skipping Telegram notifications.');
    return;
  }

  if (contests.length === 0) return;

  logger.info(`Sending ${contests.length} new contests to Telegram...`);

  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  for (const contest of contests) {
    const message = `
🔔 *New Contest Alert!*

🏆 *Contest:* ${contest.name}
🌐 *Platform:* ${contest.platform.toUpperCase()}
📅 *Start Time:* ${new Date(contest.start_time).toUTCString()}
⏱ *Duration:* ${Math.round(contest.duration / 3600)} hours

[View Contest Details](${contest.url})
`;

    try {
      await axios.post(telegramApiUrl, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      });
      logger.info(`Notified Telegram about ${contest.name}`);
    } catch (error) {
      logger.error('Failed to send Telegram message:', (error as Error).message);
    }
  }
}
