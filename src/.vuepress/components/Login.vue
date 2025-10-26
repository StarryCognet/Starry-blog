<template>
  <el-card shadow="never" style="max-width: 400px; margin: 50px auto;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h2>登录 StarryCognition</h2>
    </div>

    <!-- 用户名密码登录表单 -->
    <el-form @submit.prevent="handlePwd">
      <el-form-item>
        <el-input v-model="form.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handlePwd" :loading="loading" style="width: 100%;">登录</el-button>
      </el-form-item>
    </el-form>

    <div style="text-align: center; font-size: 14px;">
      还没有账号？
      <el-link type="primary" href="/register.html">立即注册</el-link>
    </div>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { login } from '../utils/api.js'
import { authStore } from '../stores/auth.ts'

const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const router = useRouter();
const route = useRoute();

async function handlePwd() {
  if (!form.username || !form.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  loading.value = true;
  try {
    // 登录获取JWT token和基本信息
    const res = await login(form);
    console.log("登录成功", res);
    
    // 设置全局认证状态
    authStore.setToken(res.jwt);
    
    // 使用登录接口返回的数据作为用户信息
    authStore.setUserInfo({
      id: null, // 登录接口不返回ID
      username: res.username,
      email: res.email,
      role: res.role
    });
    
    // 尝试获取完整用户信息（包括ID）
    try {
      const userInfo = await getMe();
      authStore.setUserInfo(userInfo);
    } catch (error) {
      console.error('登录后获取完整用户信息失败:', error);
      // 即使获取失败也继续登录流程
    }
    
    ElNotification.success({
      title: '登录成功',
      message: `欢迎回来，${res.username}！`
    });

    // 跳转到聊天页面或其他指定页面
    const redirect = route.query.redirect || '/chat.html';
    router.push(redirect);
  } catch (err) {
    console.error("登录失败", err);
    ElNotification.error({
      title: '登录失败',
      message: err.message || '用户名或密码错误'
    });
  } finally {
    loading.value = false;
  }
}
</script>