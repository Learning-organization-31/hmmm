<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionsSearch @search="searchFn" :list="list" />
      <el-alert type="info" show-icon :closable="false">
        数据一共 {{ baseList.counts }} 条
      </el-alert>
      <QuestionsSearchList />
      <QuestionsPage />
    </el-card>
  </div>
</template>

<script>
import { list } from "@/api/hmmm/subjects";
import { mapActions, mapMutations, mapState } from "vuex";
import QuestionsSearch from "../components/questions-search";
import QuestionsSearchList from "../components/questions-searchList";
import QuestionsPage from "../components/questions-page";
export default {
  name: "Questions",
  data() {
    return {
      list: [], //学科列表
    };
  },

  created() {
    this.$notify({
      message: "张尊勇",
    });
    //进入页面页码清1
    this.SET_PARAMS_PAGE(1);
    //获取学科列表
    this.getList();
  },

  methods: {
    //获取学科列表
    async getList() {
      this.list = (await list({ pagesize: 10000 })).data.items;
    },

    //搜索时间触发,可以获取所有搜索数据
    searchFn(params) {
      this.SET_PARAMS(params);
      this.getBaseList(this.params);
    },

    ...mapActions("questionsList", ["getBaseList"]),
    ...mapMutations("questionsList", ["SET_PARAMS", "SET_PARAMS_PAGE"]),
  },

  computed: {
    ...mapState("questionsList", ["baseList", "params"]),
  },

  components: {
    QuestionsSearch,
    QuestionsSearchList,
    QuestionsPage,
  },
};
</script>

<style lang="scss" scoped>
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
