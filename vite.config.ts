import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { vitePluginForArco } from '@arco-plugins/vite-vue';
import { VitePWA } from "vite-plugin-pwa";

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
        }),
        VitePWA({
            manifest: {
                "name": "DevilSpiderX",
                "short_name": "DSX",
                "start_url": "./",
                "display": "standalone",
                "background_color": "#ffffff",
                "theme_color": "#ffffff",
                "lang": "en",
                "scope": "./",
                icons: [
                    {
                        "src": "favicon.png",
                        "sizes": "256x256",
                        "type": "image/png"
                    }
                ]
            },
            workbox: {
                cacheId: "DSX-cache",
                navigateFallback: null,
                globPatterns: ["**\/*.{js,css,html,ttf,png,jpg}"],
                maximumFileSizeToCacheInBytes: 8000000
            }
        }),
        vitePluginForArco({
            style: "css"
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
