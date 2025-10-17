import axios from "axios";
import { ElMessage } from "element-plus";

// ① 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.starrycognition.cn",
  timeout: 10000,
});

// ② 响应拦截（只留最常用）
instance.interceptors.response.use(
  (res) => res.data, // 直接返回业务数据
  (err) => {
    ElMessage.error(err.message || "网络错误");
    return Promise.reject(err);
  }
);

// ③ 导出常用方法
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);

export default instance;
