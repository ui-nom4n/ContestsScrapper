import { z } from 'zod';

export const ContestSchema = z.object({
  contest_id: z.string().describe('Unique identifier combining platform and contest number'),
  name: z.string().describe('Official contest name as published by the platform'),
  platform: z.string().describe('Platform identifier (codeforces, leetcode, codechef, etc.)'),
  start_time: z.string().datetime().describe('Contest start time in ISO 8601 format (UTC)'),
  duration: z.number().describe('Duration in seconds'),
  url: z.string().url().describe('Direct link to contest page'),
  status: z.enum(['upcoming', 'ongoing', 'completed']).describe('Current status'),
  registration_open: z.boolean().optional().describe('Whether registration is currently open'),
  registration_deadline: z.string().datetime().optional().describe('Registration deadline (if applicable)'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('Estimated difficulty'),
  tags: z.array(z.string()).default([]).describe('Relevant tags: icpc, hackathon, team-based, etc.'),
  region: z.string().optional().describe('Geographic scope: pakistan, international, asia'),
  university: z.string().optional().describe('Host university (for local contests)'),
  prize_pool: z.string().optional().describe('Prize information if available'),
  eligibility: z.string().optional().describe('Who can participate'),
  max_team_size: z.number().optional().describe('Maximum team size for team events'),
  scraped_at: z.string().datetime().describe('When this data was collected'),
  updated_at: z.string().datetime().describe('Last update timestamp')
});

export type Contest = z.infer<typeof ContestSchema>;

// Codeforces-specific API response types
export interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
}

export interface CodeforcesAPIResponse {
  status: 'OK' | 'FAILED';
  result?: CodeforcesContest[];
  comment?: string;
}
