const webpack = require('webpack')
module.exports = {
  css:{
    loaderOptions:{
      sass:{
        data: '@/styles/main'
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
