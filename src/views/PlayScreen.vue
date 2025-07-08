<script setup lang="ts">
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { useEventStore } from '@/stores/eventStore'
const eventStore = useEventStore()
const events = eventStore.eventList

const onPlay = () => {
  if (events.length == 0) return
  new rrwebPlayer({
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
