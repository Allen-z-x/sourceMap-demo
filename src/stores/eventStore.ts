import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { eventWithTime } from '@rrweb/types'

export const useEventStore = defineStore('eventStore', () => {
  const eventList = ref<eventWithTime[]>([])
  const setEventList = (list: eventWithTime[]) => {
    eventList.value = list
    console.log('eventList', eventList.value)
  }

  return { eventList, setEventList }
})
