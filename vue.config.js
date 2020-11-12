const path = require("path");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production';
// 是否使用gzip
const productionGzip = true
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css']
function resolve(dir) {
    return path.join(__dirname, dir)
}
const production_cdn = {
    css: [
        'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.css',
    ],
    js: [
        'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
        'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
        'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
        'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
        'https://cdn.bootcss.com/nprogress/0.2.0/nprogress.min.js',
        'https://cdn.bootcss.com/echarts/4.4.0-rc.1/echarts.min.js'
    ]
}
const development_cdn = {
    js: [
        'https://cdn.bootcss.com/vue/2.6.10/vue.js',
    ]
}
module.exports = {
    baseUrl: "/",//配置打包时的相对路径
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    devServer: {
        port: "8080",//代理端口
        open: false,//项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        proxy: {
            '/': {//代理api
                target: "https://test.h5.xu5g.com",//服务器api地址
                // target:'192.168.16.167:9997',
                changeOrigin: true,//是否跨域
                ws: false, // proxy websockets
                pathRewrite: {//重写路径
                    "^/": ''
                }
            }
        }
    },
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config
            .entry('index')
            .add('babel-polyfill')
            .end();
        // 配置别名
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@img", resolve("src/assets/images"))
            .set("@css", resolve("src/assets/styles/css"))
            .set("@scss", resolve("src/assets/styles/scss"));
        // 生产环境配置
        if (isProduction) {
            // 删除预加载
            // config.plugins.delete('preload');
            // config.plugins.delete('prefetch');
            // 压缩代码
            config.optimization.minimize(true);
            // 分割代码
            // config.optimization.splitChunks({
            //     chunks: 'all'
            // })
            // 生产环境注入cdn
            config.plugin('html')
                .tap(args => {
                    args[0].cdn = production_cdn;
                    return args;
                });
        }else{

        }
    },
    configureWebpack: config => {
        if (isProduction) {
            // 用cdn方式引入
            config.externals = {
                'vue': 'Vue',
                'vuex': 'Vuex',
                'vue-router': 'VueRouter',
                'nprogress':'NProgress',
                'axios': 'axios',
                'echarts':'echarts',
            }
            // 为生产环境修改配置...
            config.plugins.push(
                //生产环境自动删除console
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            drop_debugger: true,
                            drop_console: true,
                        },
                    },
                    sourceMap: false,
                    parallel: true,
                })
            );
            config.plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            )
        } else {

        }
    }
}
