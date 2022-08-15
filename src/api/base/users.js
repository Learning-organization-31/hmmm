import { createAPI } from "@/utils/request";
// 用户列表
export const UserList = (data) => createAPI("/users", "get", data);
export const simple = (data) => createAPI("/users/simple", "get", data);
// 用户添加
export const add = (data) => createAPI("/users", "post", data);
// 用户更新
export const update = (data) => createAPI(`/users/${data.id}`, "put", data);
// 用户删除
export const remove = (id) => createAPI(`/users/${id}}`, "delete");
export const detail = (id) => createAPI(`/users/${id}`, "get");
