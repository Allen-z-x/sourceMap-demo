import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { onStartRecording, onStopRecording } from '../common/record'
import monitor from '../utils/monitor.esm.js'

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

router.afterEach((to, from) => {
  if (from.fullPath !== to.fullPath) {
    const reportData = {
      type: 'behavior',
      subType: 'router-change',
      startTime: performance.now(),
      from: from.fullPath,
      to: to.fullPath,
    }
    setTimeout(() => monitor.report(reportData), 1100)
  }
})

export default router
