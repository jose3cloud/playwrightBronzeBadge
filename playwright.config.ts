import { PlaywrightTestConfig } from '@playwright/test';

// Common settings shared across all browsers
const commonSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: 'https://3cloudsolutions.com',
};

// Common launch arguments for Chromium and WebKit
const commonLaunchArgs = [
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
];

// Silver Badge settings
const silverBadgeSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: process.env.CONTACT_LIST_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
};

// Detect when the Silver Badge project is being run, so we can scope
// retries/parallel settings without affecting Bronze projects.
const cli = process.argv.join(' ');
const silverProjectMatches = cli.match(/silver-badge-(chromium|firefox|webkit)/g) || [];
const isSilverRun = silverProjectMatches.length > 0;
const isMultiSilverProjectRun = silverProjectMatches.length > 1;

const config: PlaywrightTestConfig = {
  testDir: './uitests/tests',
  // Extra credit (scoped): retries + parallel execution for Silver Badge only
  fullyParallel: isSilverRun,
  retries: isSilverRun ? (process.env.CI ? 2 : 1) : 0,
  // Workers strategy:
  // - CI: cap at 2
  // - local single-project: use 5
  // - local multi-project (e.g., all 3 browsers at once): reduce to 2 to avoid overloading the public demo app
  workers: isSilverRun ? (process.env.CI ? 2 : isMultiSilverProjectRun ? 2 : 5) : undefined,
  use: {
    ...commonSettings,
    browserName: 'chromium',
  },
  projects: [
    // Bronze Badge Projects
    {
      name: 'chromium',
      testDir: './uitests/tests',
      use: {
        ...commonSettings,
        browserName: 'chromium',
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
    {
      name: 'firefox',
      testDir: './uitests/tests',
      use: {
        ...commonSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      testDir: './uitests/tests',
      use: {
        ...commonSettings,
        browserName: 'webkit',
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
    // Silver Badge Project
    {
      name: 'silver-badge-chromium',
      testDir: './silverBadgeTests/tests',
      use: {
        ...silverBadgeSettings,
        browserName: 'chromium',
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
    {
      name: 'silver-badge-firefox',
      testDir: './silverBadgeTests/tests',
      use: {
        ...silverBadgeSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'silver-badge-webkit',
      testDir: './silverBadgeTests/tests',
      use: {
        ...silverBadgeSettings,
        browserName: 'webkit',
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
  ],
};

export default config;
