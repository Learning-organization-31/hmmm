import { createAPI } from "@/utils/request";

export const list = (data) => createAPI("/permissions", "get", data);
// 权限组简单列表
export const simple = () => createAPI("/permissions/simple", "get");
export const add = (data) => createAPI("/permissions", "post", data);
export const update = (data) =>
  createAPI(`/permissions/${data.id}`, "put", data);
export const remove = (data) =>
  createAPI(`/permissions/${data.id}`, "delete", data);
export const detail = (data) =>
  createAPI(`/permissions/${data.id}`, "get", data);
