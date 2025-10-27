<template>
  <el-card shadow="never" style="max-width: 400px; margin: 50px auto;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2>注册 StarryCognition</h2>
    </div>

    <!-- 注册表单 -->
    <el-form @submit.prevent="handleRegister">
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名 (3-20位)" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.email" type="email" placeholder="邮箱" />
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="form.code" placeholder="验证码" />
          </el-col>
          <el-col :span="8">
            <el-button @click="sendCodeHandler" :disabled="cooldown > 0" style="width: 100%;">
              {{ cooldown ? `${cooldown}s` : '发送' }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="密码 (至少6位)" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.phone" placeholder="手机号（可选）" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%;">注册</el-button>
      </el-form-item>
    </el-form>

    <div style="text-align: center; font-size: 14px;">
      已有账号？
      <el-link type="primary" href="/login.html">立即登录</el-link>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { register, sendCode, verifyCode } from '../utils/api.js'

const form = reactive({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

const loading = ref(false)
const cooldown = ref(0)
const router = useRouter()

// 发送验证码
const sendCodeHandler = async () => {
  if (cooldown.value > 0) return
  
  if (!form.email) {
    ElMessage.warning('请输入邮箱')
    return
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  try {
    await sendCode({ email: form.email })
    ElMessage.success('验证码已发送，请查收邮箱')
    
    // 设置冷却时间
    cooldown.value = 60
    const timer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElNotification.error({
      title: '发送失败',
      message: error.message || '验证码发送失败，请稍后重试'
    })
  }
}

// 验证验证码
const verifyCodeHandler = async () => {
  if (!form.email || !form.code) {
    throw new Error('请输入邮箱和验证码')
  }
  
  try {
    // 由于拦截器已经处理了响应，直接使用返回的数据
    await verifyCode({ 
      email: form.email, 
      code: form.code 
    })
    console.log('验证码验证成功')
  } catch (error) {
    console.error('验证码验证失败:', error)
    throw new Error('验证码错误或已过期')
  }
}

const handleRegister = async () => {
  // 表单验证
  if (!form.username || !form.email || !form.code || !form.password) {
    ElMessage.warning('请填写用户名、邮箱、验证码和密码')
    return
  }
  
  if (form.username.length < 1 || form.username.length > 20) {
    ElMessage.warning('用户名长度应为1-20位')
    retur
  }
  
  if (form.password.length < 6) {
    ElMessage.warning('密码至少6位')
    return
  }
  
  if (form.password !== form.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  
  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    ElMessage.warning('请输入正确的邮箱格式')
    return
  }
  
  // 验证手机号格式（如果填写了的话）
  if (form.phone && (form.phone.length < 7 || form.phone.length > 15 || !/^\d+$/.test(form.phone))) {
    ElMessage.warning('请输入正确的手机号格式(7-15位数字)')
    return
  }

  loading.value = true
  try {
    // 先验证验证码
    await verifyCodeHandler()
    
    console.log('开始注册请求，参数:', {
      username: form.username,
      email: form.email,
      password: form.password
    });
    
    // 构建符合OpenAPI规范的注册参数
    const registerData = {
      username: form.username,
      email: form.email,
      password: form.password
    };
    
    // 只有当手机号填写时才添加到请求参数中
    if (form.phone) {
      registerData.phone = form.phone;
    }
    
    // 由于拦截器已经处理了响应，直接使用返回的数据
    const res = await register(registerData)
    
    console.log('注册响应:', res);
    
    // 由于拦截器已经处理了响应，直接显示成功消息
    ElNotification.success({
      title: '注册成功',
      message: '欢迎加入StarryCognition！'
    })
    
    // 延迟跳转到登录页
    setTimeout(() => {
      router.push('/login.html')
    }, 1500)
  } catch (error) {
    // 如果是验证码验证错误，不需要再次显示错误
    if (error.message && !error.message.includes('验证码')) {
      console.error('注册失败:', error)
      // 提供更具体的错误信息
      let message = '注册时发生错误，请稍后重试'
      
      // 处理不同类型的错误
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        message = '请求超时，请检查网络连接后重试'
      } else if (error.message) {
        const errorMsg = error.message.toLowerCase()
        
        // 网络相关错误
        if (errorMsg.includes('network error') || 
            errorMsg.includes('failed to fetch') ||
            errorMsg.includes('cors') ||
            errorMsg.includes('timeout') ||
            errorMsg.includes('networkerror')) {
          message = '网络连接异常，请检查网络设置或稍后再试'
        } 
        // 服务端明确的错误信息
        else if (errorMsg.includes('用户名已存在') || 
                 errorMsg.includes('email already exists') ||
                 errorMsg.includes('手机号已被占用')) {
          message = error.message
        }
        // 验证错误
        else if (errorMsg.includes('validation') || 
                 errorMsg.includes('invalid') ||
                 errorMsg.includes('required')) {
          message = '输入信息不符合要求，请检查后重试'
        }
      }
      
      ElNotification.error({
        title: '注册失败',
        message: message
      })
    }
  } finally {
    loading.value = false
  }
}
</script>