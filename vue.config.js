const {defineConfig} = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

let objExternals = {
    vue: "Vue",
    "element-plus": "ElementPlus",
    "crypto-js": "CryptoJS",
    jquery: "jQuery",
    "vue3-menus": "Vue3Menus"
}

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            title: "DevilSpiderX",
            filename: "index.html"
        }
    },
    configureWebpack: {
        externals: process.env.NODE_ENV === 'development' ? {} : objExternals,
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            })
        ]
    },
    devServer: {
        host: "0.0.0.0",
        port: "8080",
        // https: true,
        // proxy: "https://localhost:10048"
        proxy: "http://localhost:10048"
    }
})
