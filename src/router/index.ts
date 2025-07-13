import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { onStartRecording, onStopRecording } from '../common/record'

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

router.beforeEach(async (_to, _from, next) => {
  // 只在关键页面自动开启录制
  if (_to.name && typeof _to.name === 'string' && ['record'].includes(_to.name)) {
    next()
    onStartRecording()
  } else {
    // 跳出关键页面自动关闭录制
    if (_from.name && typeof _from.name === 'string' && ['record'].includes(_from.name)) {
      onStopRecording()
    }
    next()
  }
})

export default router
