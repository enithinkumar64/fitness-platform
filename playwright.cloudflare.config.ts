import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/cloudflare',
  workers: 1,
  use: { baseURL: 'http://localhost:8787' },
  projects: [{ name: 'workerd-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'node scripts/cloudflare.mjs preview --verify-production', url: 'http://localhost:8787', reuseExistingServer: false, timeout: 120000 },
});
