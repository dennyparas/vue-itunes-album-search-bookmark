module.exports = {
  outputDir: 'dist',
  devServer: {
    proxy: {
      '/api/': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        pathRewrite: { '^/api/': '' }
      }
    }
  }
}
