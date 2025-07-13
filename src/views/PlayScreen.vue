<script setup lang="ts">
import rrwebPlayer from 'rrweb-player'
import { useEventStore } from '@/stores/eventStore'
const eventStore = useEventStore()
const events = eventStore.eventList
let playerInstance: rrwebPlayer | null = null

const onPlay = () => {
  if (events.length == 0) return

  // 如果播放器实例已存在，直接返回
  if (playerInstance) {
    return
  }

  // 创建新的播放器实例
  playerInstance = new rrwebPlayer({
    target: document.querySelector('#doPlay')!,
    props: {
      events,
    },
  })
}
</script>
<template>
  <div class="play">
    <el-button type="primary" @click="onPlay">回放</el-button>
    <hr />
    <div id="doPlay"></div>
  </div>
</template>
<style lang="less" scoped></style>
