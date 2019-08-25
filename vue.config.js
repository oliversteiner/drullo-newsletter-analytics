const webpack = require('webpack')
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/scss/settings.scss";' +
          '@import "@/scss/drullo.scss";'
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      // load `moment/locale/de.js`
      new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
        /de|de-ch|en/)
    ],
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
  },
  filenameHashing: false
}
