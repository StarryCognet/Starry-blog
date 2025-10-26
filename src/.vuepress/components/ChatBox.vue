<template>
  <el-card shadow="never" style="max-width:1400px;margin:0 auto;">
    <!-- 使用flex布局 -->
    <div style="display: flex; gap: 20px;">
      <!-- 排行榜区域 -->
      <div style="min-width: 10px; border-right: 1px solid var(--vp-c-divider); padding-right: 20px;">
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
      <div style="flex: 1;min-width: 300px;">
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
          <!-- 已登录显示用户名，未登录显示登录提示 -->
          <div v-if="isLogin" style="margin-bottom: 8px;">
            <el-tag type="success" size="small">当前用户: {{ currentUsername }}</el-tag>
          </div>
          
          <el-row :gutter="8">
            <el-col :span="18">
              <div :style="isLogin ? {} : { 
                position: 'relative',
                filter: 'blur(5px)',
                pointerEvents: 'none'
              }">
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
              </div>
              
              <!-- 未登录时显示遮罩和提示 -->
              <div v-if="!isLogin" :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '4px',
                zIndex: 10
              }">
                <div style="font-size: 16px; margin-bottom: 16px; color: #666;">
                  登录后才能发言
                </div>
                <el-button type="primary" size="small" @click="goToLogin">
                  立即登录
                </el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <el-button 
                type="primary" 
                size="small" 
                @click="send" 
                :disabled="!isLogin"
                style="width: 100%;">
                发送
              </el-button>
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
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { getMsg, addMsg, delMsg, updateMsg } from '../utils/api.js'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { authStore, isLogin, currentUsername } from '../stores/auth.ts'

// 恢复认证状态
authStore.restore()

const msgs = ref([])
const msg  = ref('')
const box  = ref(null)
const pollingTimer = ref(null)
const isUserAtBottom = ref(true)
const deleteDialogVisible = ref(false)
const messageIdToDelete = ref(null)
const deleting = ref(false)
const likingMessageId = ref(null)
const isLoginChecked = ref(false) // 添加登录状态检查标志

const router = useRouter()

/**
 * 显示错误通知
 * @param {Error} error - 错误对象
 * @param {string} defaultTitle - 默认通知标题
 */
const showErrorNotification = (error, defaultTitle = '操作失败') => {
  // 定义常见的网络错误关键词
  const networkErrorKeywords = ['Network Error', '网络错误', 'Failed to fetch', '请求超时'];
  let message = error.message || '未知错误';
  let title = defaultTitle;

  // 根据错误信息判断是否为网络错误
  if (networkErrorKeywords.some(keyword => message.includes(keyword))) {
    message = '网络连接异常，请检查您的网络设置';
    title = '网络错误';
  }
  // 对于服务器返回的具体错误，使用其消息
  else if (message && !message.includes('获取消息失败') && !message.includes('消息发送失败')) {
    // 这里保留服务器返回的特定错误信息
    title = defaultTitle;
  }

  ElNotification({
    title,
    message,
    type: 'error'
  });
};

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
  // 检查登录状态
  if (authStore.accessToken) {
    try {
      await authStore.checkLoginStatus()
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  }
  isLoginChecked.value = true
  
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
  isUserAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 50
}

async function load() {
  try {
    const res = await getMsg()
    console.log('获取消息响应:', res)
    
    // 由于拦截器已经处理了响应，直接使用返回的数据
    // res 就是消息数组 [{id, user, msg, likes, created_at}, ...]
    if (Array.isArray(res)) {
      const oldLength = msgs.value.length
      // 按时间正序排列（老消息在前，新消息在后）
      msgs.value = res.sort((a, b) => a.created_at - b.created_at)
      
      // 只有当用户在底部或者有新消息时才滚动到底部
      if (isUserAtBottom.value || res.length > oldLength) {
        await scrollToBottom()
      }
    } else {
      // 如果响应不是数组，抛出错误
      throw new Error('数据格式错误')
    }
  } catch (error) {
    console.error('获取消息失败:', error)
    // 使用统一的错误处理函数
    showErrorNotification(error, '获取失败');
  }
}

// 跳转到登录页面
function goToLogin() {
  router.push('/login.html')
}

async function send() {
  // 检查是否已登录
  if (!isLogin.value) {
    ElNotification({
      title: '发送失败',
      message: '请先登录后再发言',
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
    user: currentUsername.value, // 使用登录用户的用户名
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
    // 由于拦截器已经处理了响应，直接检查res是否存在
    if (res) {
      msg.value = ''
      // 添加成功提示
      ElNotification.success({
        title: '发送成功',
        message: '消息发送成功'
      })
    } else {
      throw new Error('发送失败')
    }
  } catch (error) {
    console.error('消息发送失败:', error)
    // 使用统一的错误处理函数
    showErrorNotification(error, '发送失败');
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
  // 检查是否已登录
  if (!isLogin.value) {
    ElNotification({
      title: '点赞失败',
      message: '请先登录后再点赞',
      type: 'warning'
    })
    return
  }
  
  const id = message.id;
  likingMessageId.value = id
  try {
    // 构造更新数据，只更新likes字段
    const updateData = {
      id: id,
      likes: (message.likes || 0) + 1
    };
    
    const res = await updateMsg(updateData)
    // 由于拦截器已经处理了响应，直接检查res是否存在
    if (res) {
      // 更新本地消息的点赞数
      message.likes = updateData.likes;
      
      ElNotification.success({
        title: '点赞成功',
        message: '感谢您的点赞！'
      })
    } else {
      throw new Error('点赞失败')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    // 使用统一的错误处理函数
    showErrorNotification(error, '点赞失败');
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
    // 由于拦截器已经处理了响应，直接检查res是否存在
    if (res) {
      // 从本地列表中移除消息
      msgs.value = msgs.value.filter(msg => msg.id !== messageIdToDelete.value)
      
      ElNotification.success({
        title: '删除成功',
        message: '消息已成功删除'
      })
      
      // 关闭对话框
      deleteDialogVisible.value = false
      messageIdToDelete.value = null
    } else {
      throw new Error('删除失败')
    }
  } catch (error) {
    console.error('删除消息失败:', error)
    // 使用统一的错误处理函数
    showErrorNotification(error, '删除失败');
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* .ranking-header {
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
} */

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