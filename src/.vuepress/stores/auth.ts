import { reactive, computed } from 'vue'
import { getMe } from '../utils/api.js'

export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
}

export const authStore = reactive({
  accessToken: '',
  userInfo: null as UserInfo | null,
  
  // 设置访问令牌
  setToken(token: string) {
    this.accessToken = token
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('accessToken', token)
    }
  },
  
  // 设置用户信息
  setUserInfo(info: UserInfo) {
    this.userInfo = info
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(info))
    }
  },

  // 从localStorage恢复用户信息
  restore() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      const userInfoStr = localStorage.getItem('userInfo')
      
      if (token) {
        this.accessToken = token
      }
      
      if (userInfoStr) {
        try {
          this.userInfo = JSON.parse(userInfoStr)
        } catch (e) {
          console.error('解析用户信息失败:', e)
          localStorage.removeItem('userInfo')
        }
      }
    }
  },
  
  // 退出登录
  logout() {
    this.accessToken = ''
    this.userInfo = null
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    }
  },
  
  // 检查登录状态
  async checkLoginStatus() {
    // 如果没有访问令牌，直接返回未登录
    if (!this.accessToken) {
      return false
    }
    
    try {
      // 尝试获取用户信息来验证令牌有效性
      const userInfo = await getMe()
      // 如果成功获取到用户信息，更新用户信息并返回已登录
      this.setUserInfo(userInfo)
      return true
    } catch (error) {
      // 只有在确认是认证错误时才清除认证信息
      // 网络错误或其他问题不应导致登出
      if (error.response && error.response.status === 401) {
        this.logout()
        return false
      }
      // 其他错误（如网络问题）保持当前状态
      return !!this.userInfo
    }
  }
})

/** 全局快捷函数 */
export const isLogin = computed(() => !!authStore.accessToken)
export const currentUsername = computed(() => authStore.userInfo?.username || '')