<script setup lang="ts">
import { ElMessage } from 'element-plus'
import sourceMap from 'source-map-js'
import { onMounted, ref } from 'vue'
const js_error = ref<any>({ stack: [], stack_frames: [] })
const isError = ref(false)
const dialogVisible = ref(false)
const activeName = ref([0])
const activeTab = ref('local')
let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
}

onMounted(() => {
  try {
    const jsErrorList = localStorage.getItem('jsErrorList')
    if (jsErrorList) {
      isError.value = true
      js_error.value = JSON.parse(jsErrorList)
    }
  } catch (e) {
    console.log(e)
  }
})
const openDialog = (item: any, index: number) => {
  dialogVisible.value = true
  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index,
  }
}
const handleTabClick = (tab, event) => {}

const getSource = async (sourcemap: any, line: number, column: number) => {
  try {
    const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(sourcemap))
    const oringinalPosition = consumer.originalPositionFor({
      line,
      column,
    })
    const source = consumer.sourceContentFor(oringinalPosition.source)
    return {
      source,
      line: oringinalPosition.line,
      column: oringinalPosition.column,
    }
  } catch {
    ElMessage.error('sourceMap解析失败')
  }
}

const sourceMapUpload = (file: any) => {
  if (!file.name.endWith('.map')) {
    ElMessage.error('请上传正确的sourceMap文件')
    return
  }
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = async function (evt) {
    const source = await getSource(evt.target?.result, stackFrameObj.line, stackFrameObj.column)
    js_error.value.stack_frames[stackFrameObj.index].origin = source
  }
  dialogVisible.value = false
}
</script>

<template>
  <div class="home" v-if="isError">
    <pre>
      {{ js_error.stack }}
    </pre>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(item, index) in js_error.stack_frames"
        :key="index"
        :name="index"
        :title="item.source"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>{{ item.fileName }}</div>
          </el-col>
          <el-col :span="4">
            <el-button @click="openDialog(item, index)" type="primary" size="small">
              映射源码
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <template v-if="item.origin">
            <el-col>{{ item.origin }}</el-col>
          </template>
          <template v-else>
            <el-col>{{ item.fileName }}</el-col>
          </template>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="dialogVisible" title="sourceMap源码映射" :width="500">
      <el-tabs v-model="activeTab" className="sourceMap-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourceMapUpload">
            <i className="el-icon-upload"></i>
            <div>将文件拖到此处，或者<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="request"> 2 </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
