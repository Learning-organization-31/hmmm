<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionsSearch @search="searchFn" :list="list" />
      <el-tabs
        v-model="activeName"
        type="card"
        @tab-click="handleClick"
        ref="tabs"
      >
        <el-tab-pane label="全部" name="first"></el-tab-pane>
        <el-tab-pane label="待审核" name="second"></el-tab-pane>
        <el-tab-pane label="已审核" name="third"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="fourth"></el-tab-pane>
      </el-tabs>
      <el-alert type="info" show-icon :closable="false">
        数据一共 {{ choiceInfo.counts }} 条
      </el-alert>
      <QuestionsChoiceList :list="list" />
      <QuestionsChoicePage />
    </el-card>
  </div>
</template>

<script>
import { list } from "@/api/hmmm/subjects";
import { mapActions, mapMutations, mapState } from "vuex";
import QuestionsSearch from "../components/questions-search";
import QuestionsChoiceList from "../components/questionsChoiceList";
import QuestionsChoicePage from "../components/questionsChoicePage";
export default {
  name: "QuestionsChoice",

  data() {
    return {
      activeName: "first",
      index: 0,
      list: [], //学科列表
    };
  },

  created() {
    //获取学科列表
    this.getList();

    //进入页面获取精选题库内容
    this.getChoiceInfo(this.data);
  },

  methods: {
    //获取学科列表
    async getList() {
      this.list = (await list({ pagesize: 10000 })).data.items;
    },

    //更改查询条件中的审核状态
    handleClick({ index }) {
      if (index == this.index) return;
      this.index = index;
      if (Number(index)) {
        this.SET_DATA_CHK_STATE(index - 1);
      } else {
        this.SET_DATA_CHK_STATE("");
      }
      this.getChoiceInfo(this.data);
    },

    //搜索时间触发,可以获取所有搜索数据
    searchFn(params) {
      this.SET_DATA_PAGE(1);
      this.getChoiceInfo(params);
    },

    ...mapActions("questionsChoice", ["getChoiceInfo"]),
    ...mapMutations("questionsChoice", ["SET_DATA_CHK_STATE", "SET_DATA_PAGE"]),
  },

  computed: {
    ...mapState("questionsChoice", ["data", "choiceInfo"]),
  },

  components: {
    QuestionsSearch,
    QuestionsChoiceList,
    QuestionsChoicePage,
  },
};
</script>

<style scoped lang="less">
.el-alert {
  margin-bottom: 15px;
  height: 35px;
}
::v-deep .el-icon-info {
  font-size: 16px;
}
::v-deep .el-alert__content {
  margin-left: -15px;
}
</style>
