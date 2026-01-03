// @ts-check
import { defineConfig } from 'astro/config';
// Add this line:
import vercel from '@astrojs/vercel'; 

export default defineConfig({
  // Ensure you are using it here:
  adapter: vercel(),
  output: 'server', // or 'hybrid'
});
