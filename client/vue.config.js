const path = require('path');
require('dotenv').config({path: __dirname + '/.env'});
process.env.NODE_ENV_VUE = process.env.NODE_ENV

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      }
    }
  }
};
