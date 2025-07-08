import './assets/main.css'
import ErrorStackParser from 'error-stack-parser'
import type { StackFrame } from 'error-stack-parser'
import type { ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import 'rrweb-player/dist/style.css'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

interface MessageInstance {
  $message?: {
    error?: (msg: string) => void
  }
}

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.config.errorHandler = (err: unknown, vm: ComponentPublicInstance | null) => {
  let error: Error
  if (err instanceof Error) {
    error = err
  } else {
    error = new Error(String(err))
  }
  const errorStack: StackFrame[] = ErrorStackParser.parse(error)
  const jsError = {
    stack_frames: errorStack,
    message: error.message,
    stack: error.stack,
    error_name: error.name,
  }
  if (vm && (vm as MessageInstance).$message?.error) {
    ;(vm as MessageInstance).$message!.error!(`您触发了一个${error.name}错误`)
  }
  localStorage.setItem('jsErrorList', JSON.stringify(jsError))
}

app.mount('#app')
