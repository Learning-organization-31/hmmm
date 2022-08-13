import { list as getBaseList } from "@/api/hmmm/questions";

export default {
  namespaced: true,
  state: {
    baseList: {}, //基础题库数据
    params: {
      page: 1,
      pagesize: 5,
      subjectID: "", //学科id
      difficulty: "", //难度
      questionType: "", //试题类型
      tags: "", //标签名称
      province: "", //企业所在地省份
      city: "", //企业所在城市
      keyword: "", //关键字
      remarks: "", //	题目备注
      shortName: "", //企业简称
      direction: "", //方向
      creatorID: "", //录入人
      catalogID: "", //目录
    },
    loading: false,
  },

  mutations: {
    //修改基础题库数据
    SET_BASE_LIST(state, payload) {
      state.baseList = payload;
    },

    //修改当前页
    SET_PARAMS_PAGE(state, payload) {
      state.params.page = payload;
    },

    //修改每条页数
    SET_PARAMS_PAGE_SIZE(state, payload) {
      state.params.pagesize = payload;
    },

    //遍历修改params中的内容
    SET_PARAMS(state, payload) {
      for (let key in payload) {
        state.params[key] = payload[key];
      }
      //每次搜索需要把当前页修改为1
      state.params.page = 1;
      console.log(state.params);
    },
  },

  actions: {
    //获取基础题库数据
    async getBaseList(context, payload) {
      context.state.loading = true;
      const obj = {};
      for (let key in payload) {
        if (payload[key]) {
          obj[key] = payload[key];
        }
      }
      const res = (await getBaseList(obj)).data;
      context.commit("SET_BASE_LIST", res);
      context.state.loading = false;
    },
  },

  getters: {},
};
