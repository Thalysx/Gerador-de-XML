// Start the actual application server without loading .env or changing serve.cjs.
const { createServer } = require('../../scripts/serve.cjs');

const port = Number(process.env.FUTURE_G_E2E_PORT || 4175);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Porta E2E inválida.');
const server = createServer();
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`FUTURE G E2E: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close());
