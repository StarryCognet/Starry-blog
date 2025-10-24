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
        <el-text type="primary" size="small">{{ m.user }}</el-text>
        <el-text size="small" style="margin-left:8px;">{{ m.msg }}</el-text>
        <el-text type="info" size="small" style="float:right">{{ time(m.created_at) }}</el-text>
        <div style="text-align: right; margin-top: 4px;">
          <el-button 
            type="primary" 
            size="small" 
            @click="likeMessage(m)"
            :loading="m.id === likingMessageId"
          >
            👍 点赞 {{ m.likes }}
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="confirmDelete(m.id)"
            style="margin-left: 8px;"
          >
            删除
          </el-button>
        </div>
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
    
    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="300px"
      center
    >
      <span>确定要删除这条消息吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
          <el-button 
            type="primary" 
            size="small" 
            @click="deleteMessage"
            :loading="deleting"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getMsg, addMsg, delMsg, updateMsg } from '../utils/api.js'
import { ElNotification } from 'element-plus'

const msgs = ref([])
const name = ref('')
const msg  = ref('')
const box  = ref(null)
const pollingTimer = ref(null)
const isUserAtBottom = ref(true)
const deleteDialogVisible = ref(false)
const messageIdToDelete = ref(null)
const deleting = ref(false)
const likingMessageId = ref(null)

// 指数退避策略参数
const baseInterval = 3000;  // 基础间隔3秒
const maxInterval = 30000;  // 最大间隔30秒
const intervalMultiplier = 1.5;  // 间隔倍数
let currentInterval = baseInterval;
let lastMessageCount = 0;

onMounted(async () => {
  await load()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  // 使用指数退避策略，根据消息活动情况调整轮询频率
  pollingTimer.value = setTimeout(async () => {
    await load()
    startPolling() // 重新调度下一次轮询
  }, currentInterval)
}

function stopPolling() {
  if (pollingTimer.value) {
    clearTimeout(pollingTimer.value)
    pollingTimer.value = null
  }
}

function handleScroll() {
  const el = box.value
  // 检查用户是否在底部附近（允许一些误差）
  isUserAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 50
}

async function load() {
  try {
    const res = await getMsg()
    // 根据统一响应格式处理数据
    if (res.code === 200) {
      const list = res.data || []
      const oldLength = msgs.value.length
      // 检查是否有新消息
      const hasNewMessages = list.length > lastMessageCount;
      lastMessageCount = list.length;
      
      // 按时间正序排列（老消息在前，新消息在后）
      msgs.value = list.sort((a, b) => a.created_at - b.created_at)
      
      // 调整轮询频率
      if (hasNewMessages) {
        // 有新消息时，恢复较短的轮询间隔
        currentInterval = baseInterval;
      } else {
        // 没有新消息时，逐渐增加轮询间隔
        currentInterval = Math.min(currentInterval * intervalMultiplier, maxInterval);
      }
      
      // 只有当用户在底部或者有新消息时才滚动到底部
      if (isUserAtBottom.value || hasNewMessages) {
        await scrollToBottom()
      }
    } else {
      throw new Error(res.message || '获取消息失败')
    }
  } catch (error) {
    console.error('获取消息失败:', error)
    ElNotification({
      title: '获取失败',
      message: error.message || '获取消息时发生错误',
      type: 'error'
    })
    // 出错时重置轮询间隔
    currentInterval = baseInterval;
  }
}

async function send() {
  // 检查昵称和消息是否为空
  if (!name.value.trim()) {
    ElNotification({
      title: '发送失败',
      message: '请输入昵称',
      type: 'warning'
    })
    return
  }
  
  if (!msg.value.trim()) {
    ElNotification({
      title: '发送失败',
      message: '请输入消息内容',
      type: 'warning'
    })
    return
  }
  
  const timestamp = Date.now()
  const messageData = {
    user: name.value,
    msg: msg.value,
    likes: 0,  // 为点赞数设置默认值
    created_at: timestamp
  }
  
  // 先在本地添加消息，提升用户体验
  msgs.value.push({
    ...messageData,
    id: 'temp-' + timestamp + Math.random()
  })
  await scrollToBottom()
  
  try {
    // 发送到服务器
    const res = await addMsg(messageData)
    if (res.code === 200) {
      msg.value = ''
    } else {
      throw new Error(res.message || '发送失败')
    }
  } catch (error) {
    console.error('消息发送失败:', error)
    ElNotification({
      title: '发送失败',
      message: error.message || '消息发送失败，请稍后重试',
      type: 'error'
    })
  }
}

async function scrollToBottom() {
  // 使用 setTimeout 确保 DOM 已更新
  setTimeout(() => {
    if (box.value) {
      box.value.scrollTop = box.value.scrollHeight
    }
  }, 100)
}

function time(t) {
  // 处理数字格式的时间戳
  return new Date(t).toLocaleTimeString()
}

// 点赞消息函数
async function likeMessage(message) {
  const id = message.id;
  likingMessageId.value = id
  try {
    // 构造更新数据，只更新likes字段
    const updateData = {
      id: id,
      likes: (message.likes || 0) + 1
    };
    
    const res = await updateMsg(updateData)
    if (res.code === 200) {
      // 更新本地消息的点赞数
      message.likes = updateData.likes;
      
      ElNotification({
        title: '点赞成功',
        message: '感谢您的点赞！',
        type: 'success'
      })
    } else {
      throw new Error(res.message || '点赞失败')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElNotification({
      title: '点赞失败',
      message: error.message || '点赞时发生错误，请稍后重试',
      type: 'error'
    })
  } finally {
    likingMessageId.value = null
  }
}

// 删除消息相关函数
function confirmDelete(id) {
  messageIdToDelete.value = id
  deleteDialogVisible.value = true
}

async function deleteMessage() {
  if (!messageIdToDelete.value) return
  
  deleting.value = true
  try {
    const res = await delMsg(messageIdToDelete.value)
    if (res.code === 200) {
      // 从本地列表中移除消息
      msgs.value = msgs.value.filter(msg => msg.id !== messageIdToDelete.value)
      
      ElNotification({
        title: '删除成功',
        message: '消息已成功删除',
        type: 'success'
      })
      
      // 关闭对话框
      deleteDialogVisible.value = false
      messageIdToDelete.value = null
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除消息失败:', error)
    ElNotification({
      title: '删除失败',
      message: error.message || '删除消息时发生错误，请稍后重试',
      type: 'error'
    })
  } finally {
    deleting.value = false
  }
}
</script>