const {defineConfig} = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    configureWebpack: {
        externals: {
            "crypto-js": "CryptoJS",
            bootstrap: "bootstrap",
            jquery: "jQuery",
            "element-plus": "ElementPlus"
        },
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
        proxy: "http://localhost:10048"
    }
})
