import axios from 'axios';
import { Contest, CodeforcesAPIResponse } from '../models/contest';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

const CODEFORCES_API_URL = 'https://codeforces.com/api/contest.list';

export async function fetchCodeforcesContests(): Promise<Contest[]> {
  try {
    logger.info('Fetching contests from Codeforces API...');
    
    // Wrapped in retry execution
    const response = await withRetry(() => axios.get<CodeforcesAPIResponse>(CODEFORCES_API_URL, {
      params: { gym: false }
    }));

    if (response.data.status !== 'OK' || !response.data.result) {
      throw new Error(`Codeforces API returned status: ${response.data.status}`);
    }

    const contests = response.data.result;
    logger.info(`Successfully fetched ${contests.length} contests from Codeforces.`);

    // Map Codeforces native format to our Unified Contest Model
    const normalizedContests: Contest[] = contests.map((contest) => {
      // Codeforces timestamps are in seconds
      const startTime = contest.startTimeSeconds
        ? new Date(contest.startTimeSeconds * 1000).toISOString()
        : new Date().toISOString(); 

      let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
      if (contest.phase === 'BEFORE') {
        status = 'upcoming';
      } else if (contest.phase === 'CODING') {
        status = 'ongoing';
      } else {
        status = 'completed';
      }

      return {
        contest_id: `codeforces-${contest.id}`,
        name: contest.name,
        platform: 'codeforces',
        start_time: startTime,
        duration: contest.durationSeconds,
        url: `https://codeforces.com/contest/${contest.id}`,
        status,
        tags: [],
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    return normalizedContests;
  } catch (error) {
    logger.error('Error fetching Codeforces contests:', error);
    throw error;
  }
}
