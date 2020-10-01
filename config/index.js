'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // dev: { //开发环境下

    //   // 静态资源文件夹
    //   assetsSubDirectory: 'static',
    
    //   // 发布路径
    //   assetsPublicPath: '/',
    
    //   // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
    //   // 例如将'localhost:8080/api/xxx'代理到'http://xxxxxxx.com/xxx'
    //   proxyTable: {
    //    '/api': {
    //     target: 'http://xxxxxx.com', // 接口的域名
    //     // secure: false, // 如果是https接口，需要配置这个参数
    //     changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
    //     pathRewrite: {
    //      '^/api': '', // 这种接口配置出来 http://xxxxxx.com:8080/xxx
    //     }
    //    }
    //   }
    // }
    //     '/api': {}, 就是告诉node, 我接口只要是'/api'开头的才用代理.所以你的接口就要这么写 /api/xx/xx. 最后代理的路径就是 http://xxxxxx.com/api/xx/xx.
    //     可是不对啊, 我正确的接口路径里面没有/api啊. 所以就需要 pathRewrite,用''^/api'':'', 把'/api'去掉, 这样既能有正确标识, 又能在请求接口的时候去掉api

    proxyTable: {
      // 这里配置 '/api' 就等价于 target , 你在链接里访问 /api === http://localhost:54321
      '/api': {
        target: 'http://192.168.1.36:10088/', // 真是服务器的接口地址 // http://www.siychina.com:10088/json.data.json,
        secure: true, // 如果是 https ,需要开启这个选项
        changeOrigin: true, // 是否是跨域请求?肯定是啊,不跨域就没有必要配置这个proxyTable了.
        pathRewirte: {
          // 这里是追加链接,比如真是接口里包含了 /api,就需要这样配置.

          '/^api': '/', 
          // '/^api': 'api/', 
          // 等价于 
          // step 1  /api = http://localhost:54321/
          // step 2 /^api = /api + api == http://localhost:54321/api
        }
      }
     },

     //'http://localhost:8080/api' ===> 'http://192.168.1.36:10088'

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/gmt/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
