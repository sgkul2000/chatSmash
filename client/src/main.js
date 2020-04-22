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


const model =  process.env.NODE_ENV;
console.log(model);
if ( model === 'development' ) {
  var connectionLink = 'http://localhost:8000/';
} else {
  connectionLink = 'https://shielded-beyond-17297.herokuapp.com/'; 
}

Vue.use(new VueSocketIO({
  debug: true,
  connection: connectionLink ,
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