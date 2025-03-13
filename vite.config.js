import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dynamicImport from 'vite-plugin-dynamic-import';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [
    vue(),
    dynamicImport()
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  server: {
    host: "localhost",
    port: 8080,
  },
  // base: process.env.NODE_ENV === 'production' ? '/test-...' : '/',
  build: {
    // outDir: '\\\\tnnc-sapsan-app\\Shares\\dev\\Release\\...\\WebCli',
    // assetsDir: '',
    emptyOutDir: true,
  },
  esbuild: {
    supported: {
      'top-level-await': true
    },
  }
});