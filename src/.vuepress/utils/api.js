import { get, post, upload as _upload } from "./request.js";

/* ===== 留言板快捷函数 ===== */
export const getMsg = () => get("/api/messages/get");
export const addMsg = (data) => post("/api/messages/add", data);
export const updateMsg = (data) => post("/api/messages/update", data);
export const delMsg = (id) => post("/api/messages/del", { id });
export const likeMsg = (id) => post("/api/messages/like", { id });

/* ===== 用户认证相关 ===== */
export const login = (data) => post("/api/auth/login", data);
export const register = (data) => post("/api/auth/register", data);
export const sendCode = (data) => post("/api/login/code", data);
export const verifyCode = (data) => post("/api/login/verify", data);
export const forgotPassword = (data) => post("/api/auth/forgot-password", data);
export const resetPassword = (data) => post("/api/auth/reset-password", data);
export const refresh = (data) => post("/api/auth/refresh", data);
export const getMe = () => get("/api/me");
export const updateMe = (data) => post("/api/me/update", data);

/* ===== 文件上传相关 ===== */
export const upload = (file, extra) => _upload("/api/upload", file, extra);