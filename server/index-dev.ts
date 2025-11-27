import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: {
      allowedHosts: true,
      port: 5000,
      host: '0.0.0.0',
    },
  });

  await server.listen();
  console.log('✓ Server ready at http://localhost:5000');
})();
