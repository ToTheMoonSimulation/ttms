var path = require("path");

module.exports = {
  outputDir: path.resolve("../backend/public"),

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/"
        // pathRewrite:{
        //   "^/api": ""
        // },
        // changeOrigin: true
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}