import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const commonSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: 'https://3cloudsolutions.com',
};

const chromiumLaunchArgs = [
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
];

const CONTACT_LIST_BASE_URL =
  process.env.CONTACT_LIST_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com';

const BADGE_BASE_TIMEOUT_MS = 60_000;
const BADGE_NAVIGATION_TIMEOUT_MS = 90_000;
const BADGE_WEBKIT_ACTION_TIMEOUT_MS = BADGE_BASE_TIMEOUT_MS * 2;

const contactListSettings = {
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
  baseURL: CONTACT_LIST_BASE_URL,
  actionTimeout: BADGE_BASE_TIMEOUT_MS,
  navigationTimeout: BADGE_NAVIGATION_TIMEOUT_MS,
};

const cli = process.argv.join(' ');
const silverProjectMatches = cli.match(/silver-badge-(chromium|firefox|webkit)/g) || [];
const goldProjectMatches = cli.match(/gold-badge-(chromium|firefox|webkit)/g) || [];
const isSilverRun = silverProjectMatches.length > 0;
const isGoldRun = goldProjectMatches.length > 0;
const isBadgeRun = isSilverRun || isGoldRun;

const config: PlaywrightTestConfig = {
  testDir: './uitests/tests',
  fullyParallel: isBadgeRun,
  retries: isBadgeRun ? (process.env.CI ? 2 : 1) : 0,
  workers: isBadgeRun ? (process.env.CI ? 5 : 10) : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...commonSettings,
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium',
      testDir: './uitests/tests',
      use: {
        ...commonSettings,
        browserName: 'chromium',
        launchOptions: { args: chromiumLaunchArgs },
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
      },
    },
    {
      name: 'silver-badge-chromium',
      testDir: './silverBadgeTests/tests',
      timeout: 90_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'chromium',
        launchOptions: { args: chromiumLaunchArgs },
      },
    },
    {
      name: 'silver-badge-firefox',
      testDir: './silverBadgeTests/tests',
      timeout: 90_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'silver-badge-webkit',
      testDir: './silverBadgeTests/tests',
      timeout: 180_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'webkit',
        actionTimeout: BADGE_WEBKIT_ACTION_TIMEOUT_MS,
        navigationTimeout: BADGE_WEBKIT_ACTION_TIMEOUT_MS,
      },
    },
    {
      name: 'gold-badge-chromium',
      testDir: './goldBadgeTests/tests',
      timeout: 90_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'chromium',
        launchOptions: { args: chromiumLaunchArgs },
      },
    },
    {
      name: 'gold-badge-firefox',
      testDir: './goldBadgeTests/tests',
      timeout: 90_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'gold-badge-webkit',
      testDir: './goldBadgeTests/tests',
      timeout: 180_000,
      expect: { timeout: BADGE_BASE_TIMEOUT_MS },
      use: {
        ...contactListSettings,
        browserName: 'webkit',
        actionTimeout: BADGE_WEBKIT_ACTION_TIMEOUT_MS,
        navigationTimeout: BADGE_WEBKIT_ACTION_TIMEOUT_MS,
      },
    },
  ],
};

export default config;
