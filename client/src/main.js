import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import VueSocketIO from 'vue-socket.io'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'jquery/dist/jquery.slim'
import '@popperjs/core/dist/esm/popper'

Vue.config.productionTip = false

Vue.use(BootstrapVue)


console.log(process.env.VUE_APP_PORT);
var port = process.env.VUE_APP_PORT;
const Port = port.toString();
console.log("the port is " + Port);


Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:' + Port,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
  options: {}
}))


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')