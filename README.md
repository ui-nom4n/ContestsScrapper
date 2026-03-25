# Automated Coding Contest Repository

This repository automatically discovers, extracts, and summarizes coding contest details from major competitive programming platforms, leveraging GitHub Actions to update `data/contests/` with daily JSON files.

## Overview

The competitive programming landscape can be fragmented. By compiling contest schedules from sources like Codeforces, we allow easy consumption for static sites, discord bots, and telegram alerts. This eliminates the manual effort of maintaining university coding schedules.

## Platforms Supported (Phase 1)
- **Codeforces**: `src/collectors/codeforces.ts`

## Automation Workflow

The collection engine runs via a GitHub Action (`.github/workflows/fetch-contests.yml`) every 6 hours and commits the latest scraped data back to the repository.

### Setup locally

1. Clone repo
2. Run `npm install`
3. Generate the distribution: `npx tsc`
4. Exec collection target: `node dist/index.js`
