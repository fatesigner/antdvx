import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { cjs2esmVitePlugin } from 'cjs2esmodule';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import usePluginImport from 'vite-plugin-importer';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {}
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    }
  },
  define: {
    // __VUE_I18N_FULL_INSTALL__: true,
    // __VUE_I18N_LEGACY_API__: false,
    // __INTLIFY_PROD_DEVTOOLS__: false,
    'process.env': process.env
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      },
      { find: 'antdvx', replacement: resolve(__dirname, 'src/antdvx') },
      { find: 'ace-builds', replacement: 'ace-builds/src-noconflict/ace' },
      { find: 'vuedraggable', replacement: 'vuedraggable/src/vuedraggable' }
    ]
  },
  server: {
    port: 3001
  },
  plugins: [
    vue(),
    vueJsx(),
    /* viteCommonjs(), */
    cjs2esmVitePlugin(),
    ViteEjsPlugin((viteConfig) => {
      // viteConfig is the current viteResolved config.
      return {
        root: viteConfig.root,
        baseHref: '',
        url: '',
        title: 'Javbus Web'
      };
    })
  ]
});
