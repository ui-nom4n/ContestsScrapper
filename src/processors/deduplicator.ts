import { Contest } from '../models/contest';
import { logger } from '../utils/logger';

export function deduplicateContests(contests: Contest[]): Contest[] {
  logger.info(`Deduplicating ${contests.length} contests...`);
  
  const map = new Map<string, Contest>();

  for (const contest of contests) {
    // Unique key: Combine platform and normalized URL, or just URL if universal.
    // For simplicity, we prioritize unique URLs.
    const uniqueKey = contest.url.trim().toLowerCase();

    if (!map.has(uniqueKey)) {
      map.set(uniqueKey, contest);
    } else {
      // If duplicate exists, keep the one that was updated/scraped more recently
      const existing = map.get(uniqueKey)!;
      if (new Date(contest.scraped_at) > new Date(existing.scraped_at)) {
        map.set(uniqueKey, contest);
      }
    }
  }

  const result = Array.from(map.values());
  logger.info(`Deduplication finished: ${result.length}/${contests.length} remaining.`);
  return result;
}
