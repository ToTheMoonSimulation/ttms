var path = require("path");

module.exports = {
  outputDir: path.resolve("../backend/public"),

  devServer: {
    proxy: {
      "/": {
        target: "http://localhost:3000/"
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}