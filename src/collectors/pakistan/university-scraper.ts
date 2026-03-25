import axios from 'axios';
import * as cheerio from 'cheerio';
import { Contest } from '../../models/contest';
import { logger } from '../../utils/logger';

// Example generic scraper for university event pages
export async function scrapeUniversityEvents(
  universityName: string,
  region: string,
  url: string,
  eventSelector: string,
  titleSelector: string,
  dateSelector: string,
  linkSelector: string
): Promise<Contest[]> {
  try {
    logger.info(`Scraping university events from ${universityName} at ${url}...`);
    
    // Using simple GET for static generic sites. 
    // SPAs would need Playwright/Puppeteer instead
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'AutomatedCodingContestBot/1.0'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const contests: Contest[] = [];

    $(eventSelector).each((_, element) => {
      const title = $(element).find(titleSelector).text().trim();
      const dateText = $(element).find(dateSelector).text().trim();
      let link = $(element).find(linkSelector).attr('href') || url;

      if (link.startsWith('/')) {
        const urlObj = new URL(url);
        link = `${urlObj.origin}${link}`;
      }

      if (title && dateText) {
        // Mock parsing dates assuming format "March 28, 2026"
        let parsedDate = new Date(dateText);
        if (isNaN(parsedDate.getTime())) {
           // Fallback if date is unparseable
           parsedDate = new Date(); 
        }

        const contest: Contest = {
          contest_id: `uni-${universityName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
          name: title,
          platform: 'university_website',
          start_time: parsedDate.toISOString(),
          duration: 3 * 60 * 60, // Default duration
          url: link,
          status: 'upcoming', // Assume upcoming for simplicity
          tags: ['university', region, 'local'],
          region: 'pakistan',
          university: universityName,
          scraped_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        contests.push(contest);
      }
    });

    return contests;
  } catch (error) {
    logger.warn(`Failed to scrape ${universityName}:`, (error as Error).message);
    return [];
  }
}

// Orchestrator for Punjab Universities
export async function fetchPunjabUniversities(): Promise<Contest[]> {
  logger.info('Fetching contests from Punjab Universities...');
  
  // Example integration for NUST and FAST-NUCES Lahore
  // In reality, these selectors must match the structure of their respective actual websites.
  const [nustContests, fastContests] = await Promise.all([
    scrapeUniversityEvents(
      'NUST', 'Punjab', 'https://nust.edu.pk/events/',
      '.event-card', '.event-title', '.event-date', 'a.read-more'
    ),
    scrapeUniversityEvents(
      'FAST-NUCES Lahore', 'Punjab', 'https://lhr.nu.edu.pk/events/',
      '.event-item', 'h3.title', '.date', 'a.details'
    )
  ]);

  const results = [...nustContests, ...fastContests];
  logger.info(`Successfully scraped ${results.length} events from Punjab Universities.`);
  return results;
}

export async function fetchSindhUniversities(): Promise<Contest[]> {
  logger.info('Fetching contests from Sindh Universities...');
  
  const [neduetContests, ibaContests] = await Promise.all([
    scrapeUniversityEvents(
      'NED University', 'Sindh', 'https://neduet.edu.pk/events',
      '.views-row', '.views-field-title', '.views-field-created', 'a'
    ),
    scrapeUniversityEvents(
      'IBA Karachi', 'Sindh', 'https://www.iba.edu.pk/events/',
      '.event_box', 'h4', '.date', 'a.read_more'
    )
  ]);

  const results = [...neduetContests, ...ibaContests];
  logger.info(`Successfully scraped ${results.length} events from Sindh Universities.`);
  return results;
}

export async function fetchOtherRegionalUniversities(): Promise<Contest[]> {
  logger.info('Fetching contests from KPK, Balochistan, GB, and AJK Universities...');
  
  const [buitemsContests, uetPeshawarContests] = await Promise.all([
    scrapeUniversityEvents(
      'BUITEMS Quetta', 'Balochistan', 'https://www.buitms.edu.pk/events',
      '.event-card', '.title', '.date', 'a'
    ),
    scrapeUniversityEvents(
      'UET Peshawar', 'KPK', 'https://www.uetpeshawar.edu.pk/events.php',
      '.news-item', 'h3', '.date', 'a'
    )
  ]);

  const results = [...buitemsContests, ...uetPeshawarContests];
  logger.info(`Successfully scraped ${results.length} regional university events.`);
  return results;
}
