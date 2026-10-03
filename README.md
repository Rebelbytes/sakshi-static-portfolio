# Sakshi Kadam — Portfolio

A responsive, art-directed portfolio with a Node.js serverless API, configured for Vercel. The palette combines charcoal, cool grey, and blush pink; the featured-work carousel links each project to its public GitHub repository.

## Run locally

Use Node.js 18.17 or newer:

```sh
npx vercel dev
```

This starts Vercel's local development server, including:

- `/api/health` for the Node.js runtime indicator.
- `/api/projects` to load selected public repositories from the `Rebelbytes` GitHub account. GitHub data is cached at Vercel's edge; the portfolio keeps a curated local project index available if GitHub cannot be reached.

## Deploy to Vercel

Import this project in Vercel, or authenticate with the Vercel CLI and run:

```sh
npm run deploy
```

The page is served as a static asset. Both API routes are deployed as Node.js serverless functions. No build step or third-party runtime dependencies are required.

## Before publishing

- Replace the supplied profile image and resume in `assets/` if needed.
- Add a LinkedIn profile link when you have the URL.
- Update the featured repository list and project descriptions in `api/projects.js` when your GitHub projects change.
