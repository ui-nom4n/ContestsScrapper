import { Contest, ContestSchema } from '../models/contest';
import { logger } from '../utils/logger';

export function validateContests(contests: any[]): Contest[] {
  const validContests: Contest[] = [];
  
  for (const contest of contests) {
    const result = ContestSchema.safeParse(contest);
    if (result.success) {
      validContests.push(result.data);
    } else {
      logger.warn(`Validation failed for contest [${contest.name} / ${contest.platform}]:`, result.error.issues);
    }
  }

  logger.info(`Validated ${validContests.length}/${contests.length} contests successfully.`);
  return validContests;
}
