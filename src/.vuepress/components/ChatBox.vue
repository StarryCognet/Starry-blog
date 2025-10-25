<template>
  <el-card shadow="never" style="max-width:1200px;margin:0 auto;">
    <!-- 使用flex布局 -->
    <div style="display: flex; gap: 20px;">
      <!-- 排行榜区域 -->
      <div style="min-width: 300px; border-right: 1px solid var(--vp-c-divider); padding-right: 20px;">
        <h3 style="text-align: center; margin-bottom: 16px; color: var(--vp-c-brand);">🏆 排行榜</h3>
        <el-table 
          :data="rankings" 
          style="width: 100%" 
          size="small"
          :show-header="true"
          max-height="500"
          :border="false"
          :highlight-current-row="true"
          header-row-class-name="ranking-header"
          row-class-name="ranking-row"
        >
          <el-table-column prop="rank" label="#" width="50" align="center">
            <template #default="scope">
              <div class="rank-cell" :class="'rank-' + scope.row.rank">
                {{ scope.row.rank }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="用户">
            <template #default="scope">
              <div style="display: flex; align-items: center;">
                <el-avatar size="small" style="margin-right: 8px;">{{ scope.row.user.charAt(0) }}</el-avatar>
                <span>{{ scope.row.user }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="messageCount" label="消息数" width="80" align="center" />
          <el-table-column prop="likeCount" label="点赞数" width="80" align="center">
            <template #default="scope">
              <div style="display: flex; align-items: center; justify-content: center;">
                <span style="color: var(--vp-c-brand); font-weight: bold;">{{ scope.row.likeCount }}</span>
                <span style="margin-left: 4px;">👍</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 原有聊天区域 -->
      <div style="flex: 1;">
        <div style="display:flex;align-items:center; margin-bottom: 16px;">
          <el-avatar size="small">💬</el-avatar>
          <span style="margin-left:8px">实时聊天</span>
        </div>

        <!-- 消息区 -->
        <div ref="box" style="height:50vh;overflow:auto;padding:0 8px;" @scroll="handleScroll">
          <div v-for="(m, index) in msgs" :key="m.id" :style="{marginBottom: '16px', paddingBottom: '12px', borderBottom: index < msgs.length - 1 ? '1px solid var(--vp-c-divider)' : 'none'}">
            <div style="padding: 12px; border-radius: 8px; background-color: var(--vp-c-bg-soft);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div>
                    <el-tag size="small" type="primary" style="margin-bottom: 8px;">{{ m.user }}</el-tag>
                  </div>
                  <div style="margin-top: 8px; white-space: pre-wrap;">
                    <el-text size="default" style="font-size: 16px; line-height: 1.5;">{{ m.msg }}</el-text>
                  </div>
                </div>
                <el-text type="info" size="small">{{ time(m.created_at) }}</el-text>
              </div>
              <div style="display: flex; justify-content: flex-start; margin-top: 12px; gap: 6px;">
                <el-button 
                  type="info" 
                  size="small" 
                  @click="likeMessage(m)"
                  :loading="m.id === likingMessageId"
                  plain
                  style="opacity: 0.6; font-size: 12px; padding: 6px;"
                >
                  👍 {{ m.likes }}
                </el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="confirmDelete(m.id)"
                  plain
                  style="opacity: 0.6; font-size: 12px; padding: 6px;"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区 -->
        <div style="margin-top: 12px;">
          <!-- 昵称输入框移到上方 -->
          <el-row :gutter="8" style="margin-bottom: 8px;">
            <el-col :span="24">
              <el-input v-model="name" placeholder="请输入您的昵称" size="small" />
            </el-col>
          </el-row>
          
          <!-- 消息输入框 -->
          <el-row :gutter="8">
            <el-col :span="18">
              <el-input 
                v-model="msg" 
                type="textarea"
                :rows="3"
                placeholder="在此输入消息内容，支持多行输入"
                size="small" 
                @keydown.enter.exact.prevent="send"
                @keydown.shift.enter.exact.prevent="addNewLine"
              />
              <div style="margin-top: 4px; font-size: 12px; color: #909399;">
                Shift + Enter 换行
              </div>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="send" style="width: 100%;">发送</el-button>
            </el-col>
          </el-row>
        </div>
        
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
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
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

// 计算排行榜数据
const rankings = computed(() => {
  // 统计每个用户的消息数和点赞数
  const userStats = {}
  msgs.value.forEach(m => {
    if (!userStats[m.user]) {
      userStats[m.user] = {
        messageCount: 0,
        likeCount: 0
      }
    }
    userStats[m.user].messageCount++
    userStats[m.user].likeCount += m.likes || 0
  })

  // 转换为数组并按点赞数降序排序
  const rankingArray = Object.keys(userStats).map((user, index) => ({
    user,
    messageCount: userStats[user].messageCount,
    likeCount: userStats[user].likeCount
  })).sort((a, b) => b.likeCount - a.likeCount)

  // 添加排名
  return rankingArray.map((item, index) => ({
    ...item,
    rank: index + 1
  }))
})

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
  const el = box.value  isUserAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 50
}

async function load() {
  try {
    const res = await getMsg()
    // 更加健壮的响应判断逻辑
    if (res && (res.code === 200 || res.success || (!res.error && res.error !== false) || Array.isArray(res))) {
      const list = Array.isArray(res) ? res : (res.data || [])
      const oldLength = msgs.value.length
      // 按时间正序排列（老消息在前，新消息在后）
      msgs.value = list.sort((a, b) => a.created_at - b.created_at)
      
      // 只有当用户在底部或者有新消息时才滚动到底部
      if (isUserAtBottom.value || list.length > oldLength) {
        await scrollToBottom()
      }
    } else if (res && res.code !== 200) {
      // 如果响应中包含错误信息，则抛出具体错误
      throw new Error(res.message || res.msg || '获取消息失败')
    }
    // 如果res为null或undefined，不执行任何操作，避免错误提示
  } catch (error) {
    console.error('获取消息失败:', error)
    // 只有在确实发生错误时才显示通知
    if (error.message && error.message !== '获取消息失败') {
      ElNotification({
        title: '获取失败',
        message: error.message || '获取消息时发生错误',
        type: 'error'
      })
    }
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
    // 根据API响应结构调整判断条件
    if (res && (res.code === 200 || res.success || !res.error)) {
      msg.value = ''
      // 添加成功提示
      ElNotification({
        title: '发送成功',
        message: '消息发送成功',
        type: 'success'
      })
    } else {
      throw new Error(res.message || res.msg || '发送失败')
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

function addNewLine() {
  msg.value += '\n'
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
  // 处理数字格式的时间戳，显示年月日时分秒
  if (!t) return '' // 防止时间戳为空时出错
  const date = new Date(t)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
    // 根据API响应结构调整判断条件
    if (res && (res.code === 200 || res.success || !res.error)) {
      // 更新本地消息的点赞数
      message.likes = updateData.likes;
      
      ElNotification({
        title: '点赞成功',
        message: '感谢您的点赞！',
        type: 'success'
      })
    } else {
      throw new Error(res.message || res.msg || '点赞失败')
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
    // 根据API响应结构调整判断条件
    if (res && (res.code === 200 || res.success || !res.error)) {
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
      throw new Error(res.message || res.msg || '删除失败')
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

<style scoped>
.ranking-header {
  background-color: var(--vp-c-bg-soft) !important;
  font-weight: bold;
  border-radius: 8px 8px 0 0 !important;
}

.ranking-row:hover {
  background-color: var(--vp-c-bg-alt) !important;
}

.rank-cell {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-weight: bold;
  color: white;
}

.rank-1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
}

.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #A0522D);
}

.rank-4,
.rank-5,
.rank-6,
.rank-7,
.rank-8,
.rank-9,
.rank-10 {
  background: linear-gradient(135deg, #409EFF, #3366CC);
}
</style>