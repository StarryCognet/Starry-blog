// import { get, post } from "./request.js";

// export const getMsg = () => get("/api/msg");
// export const addMsg = (data) => post("/api/msg", data);


// import { get, post, upload as _upload } from "./request.js";

// // ===== 通用 CRUD =====
// export const list = (table, params = {}) => get(`/api/${table}/list`, params);
// export const detail = (table, id) => get(`/api/${table}/detail`, { id });
// export const add = (table, data) => post(`/api/${table}/add`, data);
// export const update = (table, data) => post(`/api/${table}/update`, data);
// export const del = (table, id) => post(`/api/${table}/delete`, { id });
// export const upload = (file, extra = {}) => _upload("/api/upload", file, extra);

// // ===== 留言板专用 =====
// export const getMsg = () => list("msg");
// export const addMsg = (data) => add("msg", data);

// // ===== 阅读数专用 =====
// export const getPv = (path) => detail("pv", path);
// export const incPv = (path) => add("pv", { path });

import { get, post, upload as _upload } from "./request.js";

/* ===== 通用 CRUD（任何表都能用） ===== */
export const list = (table, params) => get(`/api/${table}/list`, params);
export const add = (table, data) => post(`/api/${table}/add`, data);
export const update = (table, data) => post(`/api/${table}/update`, data);
export const del = (table, id) => post(`/api/${table}/del`, { id });
export const upload = (file, extra) => _upload("/api/upload", file, extra);

/* ===== 留言板快捷函数 ===== */
export const getMsg = () => get("/api/messages/get");
export const addMsg = (data) => post("/api/messages/add", data);
export const updateMsg = (data) => post("/api/messages/update", data);
export const delMsg = (id) => post("/api/messages/del", { id });
