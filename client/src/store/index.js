import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import modules from './modules'
import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  plugins: [createPersistedState({
    getItem: key => Cookies.get(key),
    setItem: (key, value) => Cookies.set(key, value, { espires: 3, secure: true}),
    removeItem: key => Cookies.remove(key)
  })],
  actions,
  mutations,
  modules
})
