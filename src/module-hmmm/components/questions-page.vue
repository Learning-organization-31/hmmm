<template>
  <div class="questions-page">
    <el-pagination
      :page-sizes="[5, 10, 20, 50]"
      :page-size="Number(baseList.pagesize)"
      background
      layout="  prev, pager, next,sizes, jumper"
      :total="baseList.counts"
      @current-change="pageChange"
      @size-change="sizeChange"
      :current-page="Number(baseList.page)"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "QuestionsPage",
  data() {
    return {};
  },

  created() {},

  methods: {
    //页码发生改变时准备重新获取数据
    pageChange(page) {
      this.SET_PARAMS_PAGE(page);
      this.getBaseList(this.params);
    },

    //每页条数发生改变时重新获取
    sizeChange(size) {
      this.SET_PARAMS_PAGE_SIZE(size);
      this.SET_PARAMS_PAGE(1);
      this.getBaseList(this.params);
    },

    ...mapMutations("questionsList", [
      "SET_PARAMS_PAGE",
      "SET_PARAMS_PAGE_SIZE",
    ]),
    ...mapActions("questionsList", ["getBaseList"]),
  },

  computed: {
    ...mapState("questionsList", ["baseList", "params"]),
  },
};
</script>

<style lang="scss" scoped>
.questions-page {
  display: flex;
  justify-content: end;
  margin-top: 20px;
}
</style>
