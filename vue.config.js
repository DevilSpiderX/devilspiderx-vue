const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: './',
    configureWebpack: {
        externals: {
            CryptoJS: "CryptoJS",
            bootstrap: "bootstrap",
            jquery: "jQuery"
        }
    }
})
