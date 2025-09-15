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

const config: PlaywrightTestConfig = {
  testDir: './uitests/tests',
  use: {
    ...commonSettings,
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'chromium',
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
      use: {
        ...commonSettings,
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        ...commonSettings,
        browserName: 'webkit',
        launchOptions: {
          args: commonLaunchArgs,
        },
      },
    },
  ],
};

export default config;
