import { Contest } from '../../models/contest';
import { logger } from '../../utils/logger';

export async function fetchCodePKContests(): Promise<Contest[]> {
  logger.info('Fetching contests from mock CodePK scraper...');
  
  // In a real implementation, this would use Cheerio/Puppeteer to scrape
  // https://cwpakistan.com or https://ignite.org.pk  
  
  const mockContests: Contest[] = [
    {
      contest_id: `codepk-2025-mock`,
      name: 'codePK 2025 Regional Qualifier',
      platform: 'codepk',
      start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 3 * 60 * 60,
      url: 'https://cwpakistan.com/codepk-2025',
      status: 'upcoming',
      tags: ['pakistan', 'ignite', 'regional'],
      region: 'pakistan',
      university: 'FAST-NUCES Lahore',
      difficulty: 'intermediate',
      poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      contest_id: `nust-${Date.now()}`,
      name: 'NUST Coding Marathon',
      platform: 'codepk',
      start_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 5 * 60 * 60,
      url: 'https://nust.edu.pk/hackathon',
      status: 'upcoming',
      tags: ['marathon', 'nust'],
      region: 'pakistan',
      university: 'NUST Islamabad',
      poster: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      contest_id: `iba-${Date.now()}`,
      name: 'IBA Speed Programming',
      platform: 'codepk',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 2 * 60 * 60,
      url: 'https://iba.edu.pk/speed-prog',
      status: 'upcoming',
      tags: ['speed', 'sindh'],
      region: 'pakistan',
      university: 'IBA Karachi',
      poster: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      scraped_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  logger.info(`Successfully fetched ${mockContests.length} mock contests from CodePK.`);
  return mockContests;
}
