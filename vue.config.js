module.exports = {
  outputDir: 'client',
  devServer: {
    proxy: {
      "/api/": {
        target: "https://itunes.apple.com",
        pathRewrite: { "^/api/": "" }
      },
    }
  }
}