const path = require('node:path');
const { defineConfig } = require('@playwright/test');

const port = Number(process.env.FUTURE_G_E2E_PORT || 4175);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('FUTURE_G_E2E_PORT deve ser uma porta entre 1024 e 65535.');
const run = process.env.FUTURE_G_E2E_RUN || 'latest';
if (!/^[a-zA-Z0-9_-]+$/.test(run)) throw new Error('FUTURE_G_E2E_RUN aceita somente letras, números, hífen e underscore.');
const artifacts = path.join(__dirname, 'artifacts', 'e2e', run);

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.cjs',
  // Clipboard is shared by Chromium. Keep these user-flow tests sequential.
  workers: 1,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 30000,
  globalTimeout: 180000,
  expect: { timeout: 5000 },
  outputDir: path.join(artifacts, 'results'),
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(artifacts, 'report.json') }],
    ['html', { outputFolder: path.join(artifacts, 'html'), open: 'never' }]
  ],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
    permissions: ['clipboard-read', 'clipboard-write'],
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    { name: 'chromium-desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'chromium-mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } }
  ],
  webServer: {
    command: 'node tests/e2e/server.cjs',
    url: `http://127.0.0.1:${port}`,
    env: { FUTURE_G_E2E_PORT: String(port) },
    reuseExistingServer: false,
    timeout: 15000,
    stdout: 'pipe',
    stderr: 'pipe'
  }
});
