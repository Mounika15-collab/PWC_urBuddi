import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 90 * 1000,
  expect: {
    timeout: 8 * 1000,
  },
  //globalTeardown: require.resolve('./utils/EmailReport'),
  testDir: './tests',
  // fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html',{open:'never'}],['json', { outputFile: 'results.json' }]
],

  use: 
  {
    baseURL: process.env.BASE_URL ||'https://dev.urbuddi.com',
    viewport: { width: 1536, height: 834} ,
    storageState: 'auth.json', 
    trace: 'on-first-retry',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  globalSetup: require.resolve('./tests/Login.setup.ts'),

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],launchOptions: {slowMo: 100},viewport: { width: 1540, height: 720} },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'],launchOptions: {slowMo: 300,},viewport: { width: 1540, height: 864} },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],launchOptions: {slowMo: 300,},viewport: { width: 1540, height: 864} },
    // },
  ],
});