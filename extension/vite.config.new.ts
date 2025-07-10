import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Expose env variables to the client
      'import.meta.env.MODE': JSON.stringify(env.MODE || 'development'),
      'import.meta.env.DEV': env.NODE_ENV !== 'production',
      'import.meta.env.PROD': env.NODE_ENV === 'production',
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL ||
        (env.NODE_ENV === 'production'
          ? 'https://api.resumeplan.ai'
          : 'http://localhost:3001')
      ),
    },
    plugins: [
      react(),
      crx({
        manifest: manifest as any,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: env.MODE === 'development' ? 'inline' : false,
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
  };
});
