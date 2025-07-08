<template>
  <div class="error">
    <el-button @click="triggerTypeError()">触发TypeError</el-button>
    <el-divider></el-divider>
    <el-button @click="triggerReferenceError()">触发ReferenceError</el-button>
    <el-divider></el-divider>
    <el-button @click="triggerSyntaxError()">触发SyntaxError</el-button>
  </div>
</template>
<script setup lang="ts">
const triggerTypeError = () => {
  if (typeError.length > 0) {
    console.log('err!')
  }
}
const triggerReferenceError = () => {
  throw new ReferenceError('Hello')
}
const triggerSyntaxError = () => {
  throw new SyntaxError('Hello')
}
</script>
