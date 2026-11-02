import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'unit-extract-pit-individually.trycloudflare.com'
    ]
  }
});