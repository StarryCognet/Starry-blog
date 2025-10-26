<template>
  <div class="profile-container">
    <el-card shadow="never" class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">{{ usernameFirstChar }}</div>
        <h2>{{ currentUsername }}</h2>
      </div>
      
      <div class="profile-info">
        <div class="profile-item">
          <div class="profile-label">用户ID:</div>
          <div class="profile-value">
            <span v-if="userInfo?.id">{{ userInfo.id }}</span>
            <span v-else class="placeholder">暂无ID信息</span>
          </div>
        </div>
        
        <div class="profile-item">
          <div class="profile-label">用户名:</div>
          <div class="profile-value">{{ currentUsername }}</div>
        </div>
        
        <div class="profile-item">
          <div class="profile-label">邮箱:</div>
          <div class="profile-value">{{ userInfo?.email || 'N/A' }}</div>
        </div>
        
        <div class="profile-item">
          <div class="profile-label">角色:</div>
          <div class="profile-value">{{ userInfo?.role || 'N/A' }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" @click="goToUpdateProfile">修改信息</el-button>
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { authStore, isLogin, currentUsername } from '../stores/auth.ts'
import { getMe } from '../utils/api.js'

const router = useRouter()
const isLoginChecked = ref(false) // 添加登录状态检查标志

// 恢复认证状态
authStore.restore()

// 计算属性
const userInfo = computed(() => authStore.userInfo)
const usernameFirstChar = computed(() => currentUsername.value.charAt(0).toUpperCase())

// 检查登录状态
onMounted(async () => {
  // 如果有访问令牌，检查登录状态
  if (authStore.accessToken) {
    try {
      // 尝试获取完整的用户信息
      const userInfo = await getMe();
      authStore.setUserInfo(userInfo);
    } catch (error) {
      console.error('获取完整用户信息失败:', error);
      // 如果获取失败，检查是否是CORS问题
      if (error.code === 'ERR_NETWORK' || (error.message && error.message.includes('CORS'))) {
        ElNotification.warning({
          title: '网络问题',
          message: '获取用户详细信息时遇到网络问题，将使用基础信息'
        });
      }
      // 保持当前用户信息不变
    }
  }
  
  isLoginChecked.value = true
})

const goToUpdateProfile = () => {
  alert('修改用户信息功能正在开发中...')
}

const handleLogout = () => {
  authStore.logout()
  ElNotification.success({
    title: '退出成功',
    message: '您已安全退出登录'
  })
  router.push('/login.html')
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 200px);
  padding: 50px 0;
}

.profile-card {
  width: 100%;
  max-width: 600px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 20px;
}

.profile-info {
  margin-bottom: 30px;
}

.profile-item {
  display: flex;
  margin-bottom: 15px;
}

.profile-label {
  width: 100px;
  font-weight: bold;
  color: #666;
}

.profile-value {
  flex: 1;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>