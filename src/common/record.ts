import * as rrweb from 'rrweb'
import type { eventWithTime } from '@rrweb/types'
import { pack } from '@rrweb/packer'
import { useEventStore } from '@/stores/eventStore'

const eventsMatrix: eventWithTime[][] = [[]]
let stopFn: undefined | (() => void)

// const uploadQueue: any = []
// function addToQueue(data: eventWithTime[]) {
//   uploadQueue.push(data)
//   if (uploadQueue.length === 1) requestIdleCallback(processQueue) // 空闲时启动队列处理
// }

// function processQueue() {
// if (uploadQueue.length === 0) return
// const data = uploadQueue.shift()
// sendData(data).finally(() => {
//   requestIdleCallback(processQueue); // 空闲时处理下一任务
// });
// }

export const onStartRecording = (config = {}) => {
  eventsMatrix.length = 0
  stopFn = rrweb.record({
    emit: (event, isCheckout) => {
      if (isCheckout) {
        eventsMatrix.push([])
        // 最多保留2个事件矩阵
        if (eventsMatrix.length > 2) {
          eventsMatrix.splice(0, eventsMatrix.length - 2)
        }
      }
      const lastEvents = eventsMatrix[eventsMatrix.length - 1]
      lastEvents.push(event)
    },
    recordCanvas: true,
    packFn: pack,
    sampling: { mousemove: 50 }, // 降低高频事件采样率
    checkoutEveryNms: 30000, // 默认每 30s 重新制作快照
    // checkoutEveryNth: 200, // 每 200 个 event 重新制作快照
    ...config,
  })
}

export const onStopRecording = () => {
  if (!stopFn) return
  stopFn()
  const events = eventsMatrix.flat()
  // addToQueue(events) // 上报数据
  const eventStore = useEventStore()
  eventStore.setEventList(events)
}
