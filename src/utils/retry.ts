import { logger } from './logger';

export async function withRetry<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<T> {
  let latestError: Error | unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      latestError = error;
      if (attempt < maxRetries) {
        logger.warn(`Action failed (attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`);
        await new Promise(res => setTimeout(res, delayMs));
        // Exponential backoff
        delayMs *= 2;
      }
    }
  }

  logger.error(`Critical Failure: Action failed after ${maxRetries} attempts.`);
  throw latestError;
}
