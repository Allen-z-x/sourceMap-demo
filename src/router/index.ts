import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory('/sourceMap-demo'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/trigger',
      name: 'trigger',
      component: () => import('../views/ErrorView.vue'),
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('../views/RecordScreen.vue'),
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/PlayScreen.vue'),
    },
  ],
})

export default router
