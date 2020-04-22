import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Chat from '../views/chat.vue'
import Chatmobile from '../views/Chatmobile.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chat/',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/chat/mobile/',
    name: 'Chatmobile',
    component: Chatmobile
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
