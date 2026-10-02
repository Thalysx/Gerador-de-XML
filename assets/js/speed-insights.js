import { injectSpeedInsights } from '../vendor/vercel-speed-insights.mjs';

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

if (!localHosts.has(window.location.hostname)) {
  injectSpeedInsights();
}
