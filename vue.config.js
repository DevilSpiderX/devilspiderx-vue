const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    configureWebpack: {
        externals: {
            CryptoJS: "CryptoJS",
            bootstrap: "bootstrap",
            jQuery: "jQuery"
        }
    },
    devServer: {
        open: true,
        host: "0.0.0.0",
        port: "8080",
        https: true,
        proxy: "https://localhost:10048"
    }
})
