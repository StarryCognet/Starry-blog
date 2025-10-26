<template>
  <div v-if="isLogin" style="display: flex; align-items: center; gap: 12px;">
    <el-dropdown @command="handleCommand">
      <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
        <el-avatar size="small">{{ currentUsername.charAt(0) }}</el-avatar>
        <span>{{ currentUsername }}</span>
        <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">用户信息</el-dropdown-item>
          <!-- <el-dropdown-item command="settings">设置</el-dropdown-item> -->
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div v-else>
    <el-button type="primary" size="small" @click="goToLogin">登录</el-button>
  </div>
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { authStore, isLogin, currentUsername } from '../stores/auth.ts'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()

// 恢复认证状态
authStore.restore()

function goToLogin() {
  router.push('/login.html')
}

function handleCommand(command) {
  switch (command) {
    case 'profile':
      router.push('/profile.html')
      break
    case 'logout':
      handleLogout()
      break
  }
}

function handleLogout() {
  authStore.logout()
  ElNotification.success({
    title: '退出成功',
    message: '您已安全退出登录'
  })
  router.push('/login.html')
}
</script>