import axios from 'axios';
import { Contest } from '../models/contest';
import { logger } from '../utils/logger';

const CLIST_API_URL = 'https://clist.by/api/v4/contest/';

// The response structure from clist.by /contest/ endpoint
export interface ClistContest {
  id: number;
  event: string;
  start: string;
  end: string;
  duration: number;
  href: string;
  resource: string;
  status: string;
}

export interface ClistAPIResponse {
  meta: {
    total_count: number;
    limit: number;
    offset: number;
  };
  objects: ClistContest[];
}

export async function fetchClistContests(): Promise<Contest[]> {
  const apiKey = process.env.CLIST_API_KEY;
  const username = process.env.CLIST_USERNAME;

  if (!apiKey || !username) {
    logger.warn('CLIST_API_KEY or CLIST_USERNAME not found. Falling back to international mock data.');
    const internationalMocks: Contest[] = [
      {
        contest_id: `leetcode-${Date.now()}`,
        name: 'LeetCode Biweekly Contest 125',
        platform: 'leetcode',
        start_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 1.5 * 3600,
        url: 'https://leetcode.com/contest/',
        status: 'upcoming',
        tags: ['international', 'algorithms'],
        poster: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        contest_id: `hackerrank-${Date.now()}`,
        name: 'HackerRank HackFest 2026',
        platform: 'hackerrank',
        start_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 48 * 3600,
        url: 'https://hackerrank.com/contests',
        status: 'upcoming',
        tags: ['international', 'hiring'],
        poster: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=800&q=80',
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        contest_id: `codechef-${Date.now()}`,
        name: 'CodeChef Starters 150',
        platform: 'codechef',
        start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 2 * 3600,
        url: 'https://codechef.com/contests',
        status: 'upcoming',
        tags: ['international', 'rated'],
        poster: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&w=800&q=80',
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        contest_id: `atcoder-${Date.now()}`,
        name: 'AtCoder Beginner Contest 400',
        platform: 'atcoder',
        start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 2 * 3600,
        url: 'https://atcoder.jp/contests',
        status: 'upcoming',
        tags: ['international', 'beginner'],
        poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return internationalMocks;
  }

  try {
    logger.info('Fetching contests from CLIST.by API...');
    
    // Fetch upcoming and ongoing contests (e.g., from current time onwards)
    const now = new Date().toISOString();
    
    const response = await axios.get<ClistAPIResponse>(CLIST_API_URL, {
      headers: {
        'Authorization': `ApiKey ${username}:${apiKey}`
      },
      params: {
        start__gt: now, // Contests that start or are running now
        order_by: 'start',
        limit: 200 // Maximum batch size
      }
    });

    const contests = response.data.objects;
    logger.info(`Successfully fetched ${contests.length} contests from CLIST.by.`);

    const normalizedContests: Contest[] = contests.map((c) => {
      let status: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
      
      const startDate = new Date(c.start);
      const endDate = new Date(c.end);
      const currentDate = new Date();

      if (currentDate >= startDate && currentDate <= endDate) {
        status = 'ongoing';
      } else if (currentDate > endDate) {
        status = 'completed';
      }

      return {
        contest_id: `clist-${c.id}`,
        name: c.event,
        platform: c.resource,
        start_time: c.start, // UTC formatted natively by clist
        duration: c.duration,
        url: c.href,
        status,
        tags: [],
        scraped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    return normalizedContests;
  } catch (error) {
    logger.error('Error fetching CLIST.by contests:', error);
    // Don't throw, we want to proceed even if one collector fails
    return [];
  }
}
