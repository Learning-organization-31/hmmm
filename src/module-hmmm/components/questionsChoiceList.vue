<template>
  <div>
    <el-table
      :data="choiceInfo.items"
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ background: '#fafafa' }"
    >
      <el-table-column prop="number" label="试题编号" width="120" />
      <el-table-column prop="subjectID" label="学科" width="120" />
      <el-table-column prop="catalogID" label="目录" width="120" />
      <el-table-column label="题型" width="120">
        <template slot-scope="{ row }">
          {{ row.questionType | getQuestionType }}
        </template>
      </el-table-column>
      <el-table-column prop="question" label="题干" width="280">
        <template slot-scope="{ row }">
          <p v-html="row.question"></p>
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="录入时间" width="180" />
      <el-table-column label="难度" width="80">
        <template slot-scope="{ row }">
          {{ row.difficulty | getDifficulty }}
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="120" />
      <el-table-column prop="chkState" label="审核状态" width="120" />
      <el-table-column prop="chkRemarks" label="审核意见" width="150" />
      <el-table-column prop="chkUser" label="审核人" width="120" />
      <el-table-column prop="publishState" label="发布状态" width="150" />
      <el-table-column label="操作" fixed="right" width="200">
        <template>
          <el-row>
            <el-col :span="5"> <span class="col-pan">预览</span> </el-col>
            <el-col :span="5"> <span class="col-pan">审核</span> </el-col>
            <el-col :span="5"> <span class="col-pan">修改</span> </el-col>
            <el-col :span="5"> <span class="col-pan">上架</span> </el-col>
            <el-col :span="4"> <span class="col-pan">删除</span> </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "QuestionsChoiceList",
  data() {
    return {};
  },

  created() {},

  methods: {},

  computed: {
    ...mapState("questionsChoice", ["choiceInfo", "loading"]),
  },
};
</script>

<style lang="scss" scoped>
.col-pan {
  color: #8da9fe;
  opacity: 0.8;
  cursor: pointer;
}
</style>
