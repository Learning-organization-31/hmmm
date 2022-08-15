import { UserList } from "@/api/base/users";
import { simple, list } from "@/api/base/permissions";
import { list as menuslist } from "@/api/base/menus";

export default {
  namespaced: true,
  state: {
    userList: {}, // 用户列表
    permissionSimpleList: [], // 权限组简单列表
    permissionList: {}, // 权限组列表
    menusList: [], // 菜单列表
  },
  mutations: {
    // 更新用户列表
    updateUserList(state, payload) {
      state.userList = payload;
    },
    // 更新权限组简单列表
    updatepermissionSimpleList(state, payload) {
      state.permissionSimpleList = payload;
    },
    // 更新权限组列表
    updatepermissionList(state, payload) {
      state.permissionList = payload;
    },
    // 更新菜单列表
    updatemenusList(state, payload) {
      state.menusList = payload;
    },
  },
  actions: {
    // 获取用户列表
    async getUserList(context, payload) {
      const { data } = await UserList(payload);
      context.commit("updateUserList", data);
    },
    // 获取权限组简单列表
    async getpermissionSimpleList(context) {
      const { data } = await simple();
      context.commit("updatepermissionSimpleList", data);
    },
    // 获取权限组列表
    async getpermissionList(context, payload) {
      const { data } = await list(payload);
      context.commit("updatepermissionList", data);
    },
    // 获取菜单列表
    async getmenusList(context) {
      const { data } = await menuslist();
      context.commit("updatemenusList", data);
    },
  },
};
