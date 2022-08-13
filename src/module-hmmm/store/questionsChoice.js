import { choice } from "@/api/hmmm/questions";

export default {
  namespaced: true,
  state: {
    loading: false,
    choiceInfo: {}, //精选题库的数据内容
    //精选题库所需条件
    data: {
      page: 1,
      pagesize: 5,
      subjectID: "", //学科
      difficulty: "", //难度
      questionType: "", //试题类型
      tags: "", //	标签名称
      province: "", //	企业所在地省份
      city: "", //	企业所在城市
      keyword: "", //	关键字
      remarks: "", //	题目备注
      shortName: "", //direction
      creatorID: "", //	录入人
      catalogID: "", //	目录
      chkState: "", //	审核状态0 待审核 1 通过 2 拒绝
    },
  },

  mutations: {
    //修改精选题库的数据内容
    SET_CHOICE_INFO(state, payload) {
      state.choiceInfo = payload;
      console.log(payload);
    },
    //修改精选题库搜索所需条件页码
    SET_DATA_PAGE(state, payload) {
      state.data.page = payload;
    },
    //修改精选题库搜索所需条件每页条数
    SET_DATA_PAGE_SIZE(state, payload) {
      state.data.pagesize = payload;
    },
  },

  actions: {
    //获取精选题库的数据
    async getChoiceInfo(context, payload) {
      context.state.loading = true;
      const obj = {};
      for (let key in payload) {
        if (payload[key] || payload[key] === 0 || payload[key] === "0") {
          obj[key] = payload[key];
        }
      }
      const { data } = await choice(obj);
      context.commit("SET_CHOICE_INFO", data);
      context.state.loading = false;
    },
  },

  getters: {},
};
