import fs from 'fs/promises';
import path from 'path';
import { fetchCodeforcesContests } from './collectors/codeforces';
import { fetchClistContests } from './collectors/clist';
import { fetchCodePKContests } from './collectors/pakistan/codepk';
import { fetchPunjabUniversities, fetchSindhUniversities, fetchOtherRegionalUniversities } from './collectors/pakistan/university-scraper';
import { monitorSocialMedia } from './collectors/pakistan/social-media';
import { validateContests } from './processors/validator';
import { deduplicateContests } from './processors/deduplicator';
import { sendDiscordNotification } from './notifications/discord';
import { sendTelegramNotification } from './notifications/telegram';
import { logger } from './utils/logger';
import { Contest } from './models/contest';

async function main() {
  try {
    logger.info('Starting Automated Coding Contest Data Collection...');

    // Run collectors concurrently
    const results = await Promise.allSettled([
      fetchCodeforcesContests(),
      fetchClistContests(),
      fetchCodePKContests(),
      fetchPunjabUniversities(),
      fetchSindhUniversities(),
      fetchOtherRegionalUniversities(),
      monitorSocialMedia()
    ]);

    let rawContests: any[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        rawContests.push(...result.value);
      } else {
        logger.error(`Collector at index ${index} failed:`, result.reason);
      }
    });

    // Process Pipeline
    const validContests = validateContests(rawContests);
    const uniqueContests = deduplicateContests(validContests);

    const upcomingContests = uniqueContests.filter(c => c.status === 'upcoming');
    const ongoingContests = uniqueContests.filter(c => c.status === 'ongoing');

    const dataDir = path.join(__dirname, '..', 'data', 'contests');
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(
      path.join(dataDir, 'upcoming.json'),
      JSON.stringify(upcomingContests, null, 2)
    );
    await fs.writeFile(
      path.join(dataDir, 'ongoing.json'),
      JSON.stringify(ongoingContests, null, 2)
    );

    logger.info(`Successfully wrote ${upcomingContests.length} upcoming and ${ongoingContests.length} ongoing contests.`);
    
    // Dispatch Notifications (demonstration limit to 3)
    const newContestsToNotify = upcomingContests.slice(0, 3);
    await Promise.allSettled([
      sendDiscordNotification(newContestsToNotify),
      sendTelegramNotification(newContestsToNotify)
    ]);
    
  } catch (error) {
    logger.error('Failed to run data collection:', error);
    process.exit(1);
  }
}

main();
