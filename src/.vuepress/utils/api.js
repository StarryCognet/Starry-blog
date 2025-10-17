import { get, post } from "./request.js";

export const getMsg = () => get("/api/msg");
export const addMsg = (data) => post("/api/msg", data);
