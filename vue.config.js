const webpack = require('webpack')
module.exports = {
  css:{
    loaderOptions:{
      sass:{
        data: '@import "@/scss/settings.scss";'
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
  },
  filenameHashing: false,
}
