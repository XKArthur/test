'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 8085 npm run dev OR npm run dev --port = 8085
const port = process.env.port || process.env.npm_config_port || 8085 // dev port

const chunksArr = ['chunk-vendors', 'chunk-common', 'chunk-element-ui']
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  pages: {
    // index: 'src/main.js',
    // phone: 'src/pages-phone/main.js'
    index: {
      entry: 'src/pages-index/main.js',
      template: 'public/index.html',
      chunks: [...chunksArr, 'index']
    },
    phone: {
      entry: 'src/pages-phone/main.js',
      template: 'public/phone.html',
      chunks: [...chunksArr, 'phone']
    }
  },
  devServer: {
    port: port,
    open: true,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true // 将webpack编译的错误显示在网页上面
    },
    proxy: {
      '/api': {
        // target: "http://pro.mrstage.com", // 测试环境
        target: 'http://drawing.mrstage.com' // 生产环境
        // changeOrigin: true
      }
    }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            // 删除注释
            output: {
              comments: false
            },
            // 删除console debugger 删除警告
            compress: {
              drop_console: true, // console
              drop_debugger: false,
              pure_funcs: ['console.log']// 移除console
            }
          }
        })
      ]
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // config.plugin('preload-index').tap(() => [
    //   {
    //     rel: 'preload',
    //     // to ignore runtime.js
    //     // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])
    // config.plugin('preload-phone').tap(() => [
    //   {
    //     rel: 'preload',
    //     // to ignore runtime.js
    //     // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch-index').delete('preload-index')
    config.plugins.delete('prefetch-phone').delete('preload-phone')

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // config
    //   .when(process.env.NODE_ENV !== 'development',
    // config => {
    config
      .plugin('ScriptExtHtmlWebpackPlugin')
      .after('html')
      .use('script-ext-html-webpack-plugin', [
        {
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }
      ])
      .end()

    // config.optimization.splitChunks({
    //   chunks: 'all',
    //   cacheGroups: {
    //     libs: {
    //       name: 'chunk-libs',
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: 10,
    //       chunks: 'initial' // only package third parties that are initially dependent
    //     },
    //     elementUI: {
    //       name: 'chunk-elementUI', // split elementUI into a single package
    //       priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //       test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //     },
    //     commons: {
    //       name: 'chunk-commons',
    //       test: resolve('src/components'), // can customize your rules
    //       minChunks: 3, //  minimum common number
    //       priority: 5,
    //       reuseExistingChunk: true
    //     }
    //   }
    // })

    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    // config.optimization.runtimeChunk('single')
    // } )

    config.optimization.delete('splitChunks')

    config.optimization.splitChunks({
      cacheGroups: {
        // 抽离所有入口的公用资源为一个chunk
        common: {
          name: 'chunk-common',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        // 抽离node_modules下的库为一个chunk
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true
        },

        // 由于admin入口使用了element-ui,所以讲element-ui单独处理出来，这样index入口就不会使用此js
        element: {
          name: 'chunk-element-ui',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: 'all',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    })
  }

}
