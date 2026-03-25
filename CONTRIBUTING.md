# Contributing to the Automated Coding Contest Repository

First off, thank you for considering contributing! People like you make this repository such a great ecosystem for the Pakistani student community.

## Adding a New University
1. Identify the URL where your university posts coding events.
2. Formulate the CSS selector querying structure based on the HTML layout.
3. Update `src/collectors/pakistan/university-scraper.ts` with a new `scrapeUniversityEvents` invocation bridging the correct selectors.
4. Verify the extraction locally using `npx ts-node src/index.ts`.
5. Submit a Pull Request.

## Reporting Bugs
Use the GitHub Issue Tracker to report bugs. Please ensure you:
- Specify the platform/university scraper failing.
- Provide the exact URL and the expected behavior versus the actual behavior.
- Include logs from the GitHub Actions runner if available.

## Pull Request Process
1. Ensure your code compiles correctly (`npm run build` / `tsc`).
2. Adhere to the `Zod` `ContestSchema` strictly.
3. Update the `README.md` if your contribution adds a highly requested feature or changes runtime behavior.
4. Use descriptive commit messages.
