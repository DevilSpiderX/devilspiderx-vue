import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

let objExternals = {
    vue: "Vue",
    "crypto-js": "CryptoJS",
    "vue3-menus": "Vue3Menus"
}

export default defineConfig({
    base: "./",
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true
                })
            ],
        }),
        legacy({
            targets: ['defaults']
        })
    ],
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {target: `http://localhost:10048`},
            "/websocket": {
                target: 'ws://localhost:10048',
                ws: true
            }
        }
    }
})
