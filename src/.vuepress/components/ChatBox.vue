<template>
  <el-card shadow="never" style="max-width:800px;margin:0 auto;">
    <template #header>
      <div style="display:flex;align-items:center;">
        <el-avatar size="small">💬</el-avatar>
        <span style="margin-left:8px">实时聊天</span>
      </div>
    </template>

    <!-- 消息区 -->
    <div ref="box" style="height:50vh;overflow:auto;padding:0 8px;" @scroll="handleScroll">
      <div v-for="m in msgs" :key="m.id" style="margin-bottom:12px;">
        <el-text type="primary" size="small">{{ m.name }}</el-text>
        <el-text size="small" style="margin-left:8px;">{{ m.msg }}</el-text>
        <el-text type="info" size="mini" style="float:right">{{ time(m.ts) }}</el-text>
      </div>
    </div>

    <!-- 输入区 -->
    <el-row :gutter="8" style="margin-top:12px">
      <el-col :span="4">
        <el-input v-model="name" placeholder="昵称" size="small" />
      </el-col>
      <el-col :span="14">
        <el-input v-model="msg" placeholder="回车发送" size="small" @keyup.enter="send" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small" @click="send">发送</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getMsg, addMsg } from '../utils/api.js'

const msgs = ref([])
const name = ref('匿名')
const msg  = ref('')
const box  = ref(null)
const pollingTimer = ref(null)
const isUserAtBottom = ref(true)

onMounted(async () => {
  await load()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  // 使用更长的轮询间隔，减少频繁刷新
  pollingTimer.value = setInterval(load, 3000)
}

function stopPolling() {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

function handleScroll() {
  const el = box.value
  // 检查用户是否在底部附近（允许一些误差）
  isUserAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 50
}

async function load() {
  const list = await getMsg()
  const oldLength = msgs.value.length
  msgs.value = list
  
  // 只有当用户在底部或者有新消息时才滚动到底部
  if (isUserAtBottom.value || list.length > oldLength) {
    await scrollToBottom()
  }
}

async function send() {
  if (!msg.value.trim()) return
  const timestamp = Date.now()
  const messageData = {
    name: name.value,
    msg: msg.value,
    ts: timestamp.toString() // 转换为字符串格式
  }
  // 先在本地添加消息，提升用户体验
  msgs.value.push({
    ...messageData,
    id: 'temp-' + timestamp + Math.random()
  })
  await scrollToBottom()
  
  try {
    // 发送到服务器
    await addMsg(messageData)
  } catch (error) {
    console.error('消息发送失败:', error)
  }
  
  msg.value = ''
}

async function scrollToBottom() {
  // 使用 setTimeout 确保 DOM 已更新
  setTimeout(() => {
    if (box.value) {
      box.value.scrollTop = box.value.scrollHeight
    }
  }, 0)
}

function time(t) {
  // 处理字符串格式的时间戳
  const timestamp = typeof t === 'string' ? parseInt(t) : t
  return new Date(timestamp).toLocaleTimeString()
}
</script>