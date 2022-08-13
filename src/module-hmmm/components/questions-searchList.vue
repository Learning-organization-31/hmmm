<template>
  <div>
    <el-table
      :data="baseList.items"
      stripe
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ background: '#fafafa' }"
    >
      <el-table-column prop="number" label="试题编号" width="120" />
      <el-table-column prop="subject" label="学科" />
      <el-table-column prop="catalog" label="目录" />
      <el-table-column
        prop="questionType"
        :formatter="formatType"
        label="题型"
      />
      <el-table-column label="题干" width="280">
        <template slot-scope="{ row }">
          <span v-html="row.question"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addDate"
        :formatter="formatDate"
        label="录入时间"
      />
      <el-table-column prop="difficulty" :formatter="formatDiff" label="难度" />
      <el-table-column prop="creator" label="录入人" />
      <el-table-column label="操作" width="180">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-view"
            plain
            circle
            size="small"
            @click="dialogIsShow(row)"
          />
          <el-button
            type="success"
            icon="el-icon-edit"
            plain
            circle
            size="small"
            @click="goNews(row)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            circle
            size="small"
            @click="removeQue(row)"
          />
          <el-button
            type="warning"
            icon="el-icon-check"
            plain
            circle
            size="small"
            @click="choiceAdd(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <QuestionsDialog :dialogIsShow.sync="IsShow" :id="detailId" />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { parseTime } from "@/utils";
import { questionType, difficulty } from "@/api/hmmm/constants";
import { remove, choiceAdd } from "@/api/hmmm/questions";
import QuestionsDialog from "./questions-dialog";
export default {
  name: "QuestionsSearchList",
  data() {
    return {
      IsShow: false,
      detailId: "",
    };
  },

  created() {
    //进入页面获取基础列表数据
    this.getBaseList(this.params);
  },

  methods: {
    //打开弹窗
    dialogIsShow({ id }) {
      console.log(id);
      this.detailId = id;
      this.IsShow = true;
    },

    //跳转至试题录入
    goNews({ id }) {
      this.$router.push({
        path: "/questions/new",
        query: {
          id,
        },
      });
    },

    //加入精选
    async choiceAdd({ id }) {
      try {
        await this.$confirm("此操作将该题目加入精选, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        });
        await choiceAdd({ id, choiceState: 1 });
        this.$message.success("加入精选成功成功");
        //成功判断当前页面是不是没有数据,没有数据向前一页获取数据
        if (
          this.baseList.counts % this.baseList.pagesize === 1 &&
          this.params.page > 1
        ) {
          this.SET_PARAMS_PAGE(this.params.page - 1);
        }
        this.getBaseList(this.params);
      } catch (error) {
        if (error === "cancel") return;
        console.log(error);
      }
    },

    //删除功能
    async removeQue({ id }) {
      try {
        await this.$confirm("此操作将永久删除该题目,是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await remove({ id });
        this.$message.success("删除成功");
        //删除成功判断当前页面是不是没有数据,没有数据向前一页获取数据
        if (
          this.baseList.counts % this.baseList.pagesize === 1 &&
          this.params.page > 1
        ) {
          this.SET_PARAMS_PAGE(this.params.page - 1);
        }
        this.getBaseList(this.params);
      } catch (error) {
        if (error === "cancel") return;
        console.log(error);
      }
    },

    //格式化时间
    formatDate(row, column, cellValue) {
      return parseTime(cellValue);
    },

    //格式化提醒
    formatType(row, column, cellValue) {
      return questionType.find((item) => item.value == cellValue).label;
    },

    //格式化难度
    formatDiff(row, column, cellValue) {
      return difficulty.find((item) => item.value == cellValue).label;
    },

    ...mapActions("questionsList", ["getBaseList"]),
    ...mapMutations("questionsList", ["SET_PARAMS_PAGE"]),
  },

  computed: {
    ...mapState("questionsList", ["params", "baseList", "loading"]),
  },

  components: {
    QuestionsDialog,
  },
};
</script>

<style lang="scss" scoped></style>
