import axios from 'axios'
import sourceMap from 'source-map-js'
import type { StackFrame } from 'error-stack-parser'

const getSouerceMap = async (url: string) => {
  const res = await axios.get(url)
  return res.data
}

const findCodeBySourceMap = async (stackFrame: StackFrame) => {
  // 获取map文件
  const fileContent = await getSouerceMap(`${stackFrame.fileName}.map`)
  // 解析map文件
  const consumer = await new sourceMap.SourceMapConsumer(fileContent)
  const oringinalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber || 0,
    column: stackFrame.columnNumber || 0,
  })
  const code = consumer.sourceContentFor(oringinalPosition.source)
  console.log(code, '还原之后的代码')
}

export { findCodeBySourceMap }
