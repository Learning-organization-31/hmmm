import { createAPI } from "@/utils/request";

export const list = (data) => createAPI("/permissions", "get", data);
// 权限组简单列表
export const simple = () => createAPI("/permissions/simple", "get");
export const add = (data) => createAPI("/permissions", "post", data);
export const update = (data) =>
  createAPI(`/permissions/${data.id}`, "put", data);
// 权限组删除
export const remove = (id) => createAPI(`/permissions/${id}`, "delete");
// 权限组详情
export const detail = (id) => createAPI(`/permissions/${id}`, "get");
