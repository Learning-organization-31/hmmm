<template>
  <div class="questions-page">
    <el-pagination
      :page-sizes="[5, 10, 20, 50]"
      :page-size="Number(choiceInfo.pagesize)"
      background
      layout="  prev, pager, next,sizes, jumper"
      :total="choiceInfo.counts"
      @current-change="pageChange"
      @size-change="sizeChange"
      :current-page="Number(choiceInfo.page)"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "QuestionsChoicePage",
  data() {
    return {};
  },

  created() {},

  methods: {
    //页码发生改变时准备重新获取数据
    pageChange(page) {
      this.SET_DATA_PAGE(page);
      this.getChoiceInfo(this.data);
    },

    //每页条数发生改变时重新获取
    sizeChange(size) {
      this.SET_DATA_PAGE_SIZE(size);
      this.SET_DATA_PAGE(1);
      this.getChoiceInfo(this.data);
    },

    ...mapMutations("questionsChoice", ["SET_DATA_PAGE", "SET_DATA_PAGE_SIZE"]),
    ...mapActions("questionsChoice", ["getChoiceInfo"]),
  },

  computed: {
    ...mapState("questionsChoice", ["choiceInfo", "data"]),
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
