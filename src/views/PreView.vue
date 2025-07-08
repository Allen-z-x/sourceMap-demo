<script setup lang="ts">
const props = defineProps<{
  origin: { line: number; source: string }
}>()

const encodeHTML = (str: string) => {
  if (!str || str.length === 0) return ''
  return str
    .replace(/&/g, '&#38;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
const preLine = () => {
  const line = props.origin.line
  const origincodeLine = props.origin.source.split('\n')
  const len = origincodeLine.length - 1
  const start = line - 3 >= 0 ? line - 3 : 0
  const end = start + 5 >= len ? len : start + 5 // 最多展示6行
  const newLines = []
  for (let i = start; i <= end; i++) {
    const content = i + 1 + '. ' + encodeHTML(origincodeLine[i])

    newLines.push(`<div class='code-line ${i + 1 == line ? 'highlight' : ''}'>${content}</div>`)
  }
  return newLines.join('')
}
</script>
<template>
  <div class="pre-code">
    <div class="error-detail">
      <pre class="error-code" v-html="preLine()"></pre>
    </div>
  </div>
</template>
<style>
.pre-code {
  .error-detail {
    .error-code {
      padding: 10px;
      overflow: hidden;
      font-family: consolas, monospace;
      word-wrap: normal;
    }
  }
  .code-line {
    padding: 4px;
  }
  .highlight {
    color: #fff;
    background-color: #f12926;
  }
}
</style>
