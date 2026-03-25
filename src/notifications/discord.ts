import axios from 'axios';
import { Contest } from '../models/contest';
import { logger } from '../utils/logger';

export async function sendDiscordNotification(contests: Contest[]): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    logger.warn('DISCORD_WEBHOOK_URL not found. Skipping Discord notifications.');
    return;
  }

  if (contests.length === 0) return;

  logger.info(`Sending ${contests.length} new contests to Discord...`);

  for (const contest of contests) {
    const embed = {
      title: '🔔 New Contest Alert: ' + contest.name,
      url: contest.url,
      color: 3447003, // Blue
      fields: [
        { name: 'Platform', value: contest.platform.toUpperCase(), inline: true },
        { name: 'Start Time (UTC)', value: new Date(contest.start_time).toLocaleString(), inline: true },
        { name: 'Duration', value: `${Math.round(contest.duration / 3600)} hours`, inline: true }
      ],
      footer: { text: 'Automated Coding Contest Repository' }
    };

    try {
      await axios.post(webhookUrl, {
        embeds: [embed]
      });
      logger.info(`Notified Discord about ${contest.name}`);
    } catch (error) {
      logger.error('Failed to send Discord webhook:', (error as Error).message);
    }
  }
}
