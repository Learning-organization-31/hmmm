<template>
  <div class="container">
    <el-card class="box-card">
      <QuestionsSearch @search="searchFn" />
      <el-alert type="info" show-icon :closable="false">
        数据一共 {{ baseList.counts }} 条
      </el-alert>
      <QuestionsSearchList />
      <QuestionsPage />
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import QuestionsSearch from "../components/questions-search";
import QuestionsSearchList from "../components/questions-searchList";
import QuestionsPage from "../components/questions-page";
export default {
  name: "Questions",
  data() {
    return {};
  },

  created() {},

  methods: {
    //搜索时间触发,可以获取所有搜索数据
    searchFn(params) {
      this.SET_PARAMS(params);
      this.getBaseList(this.params);
    },

    ...mapActions("questionsList", ["getBaseList"]),
    ...mapMutations("questionsList", ["SET_PARAMS"]),
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
}
</style>
