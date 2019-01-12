module.exports = {
  outputDir: 'dist',
  devServer: {
    proxy: {
      '/api/': {
        target: 'https://itunes.apple.com',
        pathRewrite: { '^/api/': '' }
      }
    }
  }
}
