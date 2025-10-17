<template>
  <el-card shadow="never" style="max-width:800px;margin:0 auto;">
    <template #header>
      <div style="display:flex;align-items:center;">
        <el-avatar size="small">💬</el-avatar>
        <span style="margin-left:8px">实时聊天</span>
      </div>
    </template>

    <!-- 消息区 -->
    <div ref="box" style="height:50vh;overflow:auto;padding:0 8px;">
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
import { ref, onMounted, nextTick } from 'vue'
import { getMsg, addMsg } from '../utils/api.js'

const msgs = ref([])
const name = ref('匿名')
const msg  = ref('')
const box  = ref(null)

onMounted(async () => {
  await load()
  setInterval(load, 1000)   // 1 秒轮询
})

async function load() {
  const list = await getMsg()
  msgs.value = list
  await nextTick()
  box.value.scrollTop = box.value.scrollHeight
}

async function send() {
  if (!msg.value.trim()) return
  await addMsg({ name: name.value, msg: msg.value })
  msg.value = ''
  await load()
}

function time(t) {
  return new Date(t).toLocaleTimeString()
}
</script>