import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// Relative base ("./") works whether this is deployed at
//   https://<user>.github.io/            (user/org page)
//   https://<user>.github.io/<repo>/     (project page)
// so no manual path edits are needed after cloning/renaming the repo.
export default defineConfig({
  base: './',
  build: {
    target: 'es2019',
    sourcemap: false,
    cssMinify: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split the (large) three.js dependency into its own chunk so the
        // main bundle stays small and three.js can be cached independently.
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
  plugins: [
    compression({ algorithm: 'brotliCompress', filename: '[path][base].br' }),
    compression({ algorithm: 'gzip', filename: '[path][base].gz' }),
  ],
});
