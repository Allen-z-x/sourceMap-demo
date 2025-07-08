import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import type { StackFrame } from 'error-stack-parser'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { findCodeBySourceMap } from './utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance) => {
  const errorStack: StackFrame[] = ErrorStackParser.parse(err as Error)
  console.error('errorStack', errorStack)
  findCodeBySourceMap(errorStack[0])
}

app.mount('#app')
