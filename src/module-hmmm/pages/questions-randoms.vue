<template>
  <div class="container">
    <el-card class="box-card">
      <div class="title">
        <el-form
          status-icon
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
          style="width: 415px"
        >
          <el-form-item label="关键字">
            <el-input
              size="small"
              placeholder="根据编号搜索"
              v-model="inpText"
            ></el-input>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="small" @click="inpText = ''">清除</el-button>
          <el-button type="primary" size="small" @click="searchList">
            搜索
          </el-button>
        </div>
      </div>
      <el-alert type="info" show-icon :closable="false">
        数据一共 {{ randomsInfo.counts }} 条
      </el-alert>
      <el-table
        :data="randomsInfo.items"
        :header-cell-style="{ background: '#fafafa' }"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="220" />
        <el-table-column
          prop="questionType"
          label="题型"
          :formatter="matType"
          width="80"
        />
        <el-table-column label="题目编号" width="220">
          <template slot-scope="{ row }">
            <div
              v-for="item in row.questionIDs"
              :key="item.number"
              class="question"
              @click="diaShow(item.id)"
            >
              {{ item.number }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="录入时间" width="180" />
        <el-table-column prop="totalSeconds" label="答题时间(s)" width="295" />
        <el-table-column prop="accuracyRate" label="正确率(%)" />
        <el-table-column prop="userName" label="录入人" />
        <el-table-column label="操作" width="80">
          <template slot-scope="{ row }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              size="small"
              @click="removeRandoms(row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="questions-page">
        <el-pagination
          background
          :page-sizes="[20, 30, 50, 100]"
          :page-size="Number(randomsInfo.pagesize - 0)"
          layout="  prev, pager, next,sizes, jumper"
          :total="randomsInfo.counts"
          :current-page="Number(randomsInfo.page)"
          @size-change="sizeChange"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </el-card>
    <QuestionsDialog :dialogIsShow.sync="dialogIsShow" :id="id" />
  </div>
</template>

<script>
import QuestionsDialog from "../components/questions-dialog";
import { randoms, removeRandoms } from "@/api/hmmm/questions";
import { getQuestionType } from "@/filters";
export default {
  name: "QuestionsRandoms",
  data() {
    return {
      loading: false,
      randomsInfo: {}, //组题数据
      dialogIsShow: false,
      id: "",
      inpText: "", //搜索框内容
      params: {
        page: 1,
        pagesize: 20,
        keyword: "",
      },
      flag: true,
    };
  },

  created() {
    //进入页面获取所有题组
    this.getRandoms();
  },

  methods: {
    //删除组题
    async removeRandoms({ id }) {
      await this.$confirm("此操作将永久删除该组题,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await removeRandoms({ id });
      this.flag = false;
      this.$message.success("删除成功");
      this.params.keyword = "";
      if (
        this.randomsInfo.counts % this.randomsInfo.pagesize === 1 &&
        this.params.page > 1
      ) {
        this.params.page = this.params.page - 1;
      }
      this.setInfo();
    },

    //每页数量发生改变
    sizeChange(pagesize) {
      this.flag = false;
      this.params.page = 1;
      this.params.pagesize = pagesize;
      this.setInfo();
    },

    //页码发生变化
    pageChange(page) {
      if (this.flag) {
        this.params.page = page;
        this.setInfo();
      }
    },

    //进入页面获取所有题组
    async getRandoms() {
      this.setInfo();
      console.log(this.randomsInfo);
    },

    //初始化题型
    matType(row, column, cellValue) {
      return getQuestionType(cellValue);
    },

    //点击题目编号打开弹窗并渲染
    diaShow(id) {
      this.id = id;
      this.dialogIsShow = true;
    },

    //搜索功能
    async searchList() {
      this.params.page = 1;
      this.params.keyword = this.inpText;
      this.setInfo();
    },

    //获取数据
    async setInfo() {
      this.loading = true;
      const { data } = await randoms(this.params);
      this.randomsInfo = data;
      console.log(this.randomsInfo);
      this.loading = false;
      this.flag = true;
    },
  },

  components: {
    QuestionsDialog,
  },
};
</script>

<style scoped lang="less">
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .el-icon-info {
  font-size: 16px;
}

.el-alert {
  margin-bottom: 15px;
  height: 35px;
}

.questions-page {
  display: flex;
  justify-content: end;
  margin-top: 20px;
}
.question {
  color: #0099ff;
  cursor: pointer;
}
</style>
