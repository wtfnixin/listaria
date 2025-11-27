// Frontend-only dev server
import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startDevServer() {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: {
      host: '0.0.0.0',
      port: 5000,
      middlewareMode: false,
      allowedHosts: true,
      hmr: {
        protocol: 'wss',
        host: 'localhost',
        port: 5000,
      },
    },
  });

  await server.listen();
  console.log('Vite dev server running on http://0.0.0.0:5000');
}

startDevServer().catch(console.error);
