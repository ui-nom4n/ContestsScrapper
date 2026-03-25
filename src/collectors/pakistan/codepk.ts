import { Contest } from '../../models/contest';
import { logger } from '../../utils/logger';

export async function fetchCodePKContests(): Promise<Contest[]> {
  logger.info('Fetching contests from mock CodePK scraper...');
  
  // In a real implementation, this would use Cheerio/Puppeteer to scrape
  // https://cwpakistan.com or https://ignite.org.pk  
  
  const mockContest: Contest = {
    contest_id: `codepk-2025-mock`,
    name: 'codePK 2025 Regional Qualifier',
    platform: 'codepk',
    start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    duration: 3 * 60 * 60, // 3 hours
    url: 'https://cwpakistan.com/codepk-2025',
    status: 'upcoming',
    tags: ['pakistan', 'ignite', 'regional'],
    region: 'pakistan',
    difficulty: 'intermediate',
    scraped_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  logger.info(`Successfully fetched 1 mock contest from CodePK.`);
  return [mockContest];
}
