import axios from "axios";
import { ElMessage } from "element-plus";

// ① 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://apis.starrycognition.cn",
  timeout: 10000,
});

// ② 响应拦截（最简）
instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    ElMessage.error(err.message || "网络错误");
    return Promise.reject(err);
  }
);

// ③ 通用 CRUD
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);

// ④ 文件上传（单文件 / 多文件 / 带额外字段）
export const upload = (url, fileOrFiles, extra = {}) => {
  const fd = new FormData();
  if (Array.isArray(fileOrFiles)) {
    fileOrFiles.forEach((f) => fd.append("file", f));
  } else {
    fd.append("file", fileOrFiles);
  }
  Object.keys(extra).forEach((k) => fd.append(k, extra[k]));
  return instance.post(url, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (p) => {
      const percent = Math.round((p.loaded / p.total) * 100);
      console.log(`上传进度：${percent}%`); // 可换成 UI 进度条
    },
  });
};

// ⑤ 默认导出（备用）
export default instance;