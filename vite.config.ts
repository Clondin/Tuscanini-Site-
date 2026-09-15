import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {catalogResponse} from './server/kayco-catalog';

function catalogApi(apiKey: string | undefined): Plugin {
  return {
    name: 'kayco-catalog-api',
    configureServer(server) {
      server.middlewares.use('/api/catalog', async (request, response) => {
        const result = await catalogResponse(request.method ?? 'GET', apiKey);
        response.statusCode = result.status;
        result.headers.forEach((value, name) => response.setHeader(name, value));
        response.end(await result.text());
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const privateEnv = loadEnv(mode, process.cwd(), 'KAYCO_');
  return {
    plugins: [react(), tailwindcss(), catalogApi(process.env.KAYCO_API_KEY || privateEnv.KAYCO_API_KEY)],
    build: {
      assetsDir: 'static',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
