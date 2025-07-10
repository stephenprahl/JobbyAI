import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    define: {
      // Expose env variables to the client
      'import.meta.env.MODE': JSON.stringify(env.MODE || 'development'),
      'import.meta.env.DEV': env.NODE_ENV !== 'production',
      'import.meta.env.PROD': env.NODE_ENV === 'production',
      'import.meta.env.API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 
        (env.NODE_ENV === 'production' 
          ? 'https://api.resumeplan.ai' 
          : 'http://localhost:3001')
      ),
    },
    plugins: [
      react(),
      crx({
        manifest: manifest as any, // Cast to any to avoid type issues with CRXJS
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
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'popup/index.html'),
          content: resolve(__dirname, 'content/content.ts'),
          background: resolve(__dirname, 'background/background.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            const fileName = chunkInfo.name === 'background' ? 'background/background.js' :
                           chunkInfo.name === 'content' ? 'content/content.js' :
                           '[name]/index.js';
            return fileName;
          },
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
    // Configure the development server to watch for changes in the extension directory
    // and reload the extension when files change
    optimizeDeps: {
      include: ['react', 'react-dom', 'webextension-polyfill'],
    },
  };
});
