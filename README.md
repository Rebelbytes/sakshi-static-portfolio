# Sakshi Kadam — Portfolio

A responsive, art-directed portfolio with a Node.js serverless API, configured for Vercel. The palette combines charcoal, cool grey, and blush pink; the compact project carousel links to each repository and supports swipe and arrow navigation.

## Run locally

Use Node.js 18.17 or newer:

```sh
npx vercel dev
```

This starts Vercel's local development server, including:

- `/api/health` for the Node.js runtime indicator.
- `/api/projects` to load metadata for the featured GitHub repositories. Project cards link to each repository's README; SafeRide also links to its IEEE Xplore paper and DOI. GitHub metadata is cached at Vercel's edge, and curated project details remain available if GitHub cannot be reached.

## Deploy to Vercel

Import this project in Vercel, or authenticate with the Vercel CLI and run:

```sh
npm run deploy
```

The page is served as a static asset. Both API routes are deployed as Node.js serverless functions. No build step or third-party runtime dependencies are required.

## Before publishing

- Replace the supplied profile image and resume in `assets/` if needed.
- Update the featured repository list and project descriptions in `api/projects.js` and `index.html` when your projects change.
