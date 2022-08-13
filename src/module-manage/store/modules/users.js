import { UserList } from "@/api/base/users";
import { simple } from "@/api/base/permissions";
export default {
  namespaced: true,
  state: {
    userList: {}, // 用户列表
    permissionSimpleList: [], // 权限组简单列表
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
  },
};
