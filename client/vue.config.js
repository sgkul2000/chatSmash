const path = require('path');
require('dotenv').config({ path: __dirname + '/.env' });
process.env.VUE_APP_PORT = process.env.PORT || 8080;

console.log(process.env.VUE_APP_PORT);
var port = process.env.VUE_APP_PORT;
const Port = port.toString();
console.log("the port is " + Port);

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:" + Port ,
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  }
};