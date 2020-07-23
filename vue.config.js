const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    productionSourceMap: false,
    transpileDependencies: ['uni-simple-router'],
    devServer: {
        proxy: {
            '/api': {
                target: 'https://apidev.zzgqsh.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/uni.scss";\n$imgUrl: "${process.env.VUE_APP_IMG_URL}";`
            }
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.plugins.push(new BundleAnalyzerPlugin());
        }
    }
};
