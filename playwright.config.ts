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

// Silver Badge timeout constants
const SILVER_BASE_TIMEOUT_MS = 60_000;
const SILVER_EXPECT_TIMEOUT_MS = SILVER_BASE_TIMEOUT_MS;
const SILVER_ACTION_TIMEOUT_MS = SILVER_BASE_TIMEOUT_MS;
const SILVER_ACTION_TIMEOUT_WEBKIT_MS = SILVER_BASE_TIMEOUT_MS * 2;
const SILVER_NAVIGATION_TIMEOUT_MS = 90_000;
const SILVER_NAVIGATION_TIMEOUT_WEBKIT_MS = SILVER_ACTION_TIMEOUT_WEBKIT_MS;

// Silver Badge settings
const silverBadgeSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: process.env.CONTACT_LIST_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
  actionTimeout: SILVER_ACTION_TIMEOUT_MS,
  navigationTimeout: SILVER_NAVIGATION_TIMEOUT_MS,
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
  // - CI: cap at 5
  // - local: use 10 (single or multi-project)
  workers: isSilverRun ? (process.env.CI ? 5 : 10) : undefined,
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
      timeout: 90_000,
      expect: { timeout: SILVER_EXPECT_TIMEOUT_MS },
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
      timeout: 90_000,
      expect: { timeout: SILVER_EXPECT_TIMEOUT_MS },
      use: {
        ...silverBadgeSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'silver-badge-webkit',
      testDir: './silverBadgeTests/tests',
      timeout: 180_000,
      expect: { timeout: SILVER_EXPECT_TIMEOUT_MS },
      use: {
        ...silverBadgeSettings,
        browserName: 'webkit',
        actionTimeout: SILVER_ACTION_TIMEOUT_WEBKIT_MS,
        navigationTimeout: SILVER_NAVIGATION_TIMEOUT_WEBKIT_MS,
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
  ],
};

export default config;
