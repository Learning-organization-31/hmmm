<template>
  <div>
    <el-table
      :data="choiceInfo.items"
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ background: '#fafafa' }"
    >
      <el-table-column prop="number" label="试题编号" width="120" />
      <el-table-column
        prop="subjectID"
        label="学科"
        :formatter="formatSubject"
        width="120"
      />
      <el-table-column prop="catalog" label="目录" width="120" />
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
      <el-table-column prop="addDate" label="录入时间" width="180">
        <template slot-scope="{ row }">
          {{ row.addDate | parseTime }}
        </template>
      </el-table-column>
      <el-table-column label="难度" width="80">
        <template slot-scope="{ row }">
          {{ row | getDifficulty }}
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="120" />
      <el-table-column prop="chkState" label="审核状态" width="120">
        <template slot-scope="{ row }">
          {{ row.chkState | getChkType }}
        </template>
      </el-table-column>
      <el-table-column prop="chkRemarks" label="审核意见" width="150" />
      <el-table-column prop="chkUser" label="审核人" width="120" />
      <el-table-column prop="publishState" label="发布状态" width="150">
        <template slot-scope="{ row }">
          {{ row | getPublishType }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="{ row }">
          <!-- 待审核 -->
          <el-row v-if="row.chkState === 0 && row.publishState === 0">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choiceCheckFn(row)">审核</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="goNews(row)">修改</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishUp(row)">上架</span>
            </el-col>
            <el-col :span="4">
              <span class="col-pan" @click="remove(row)">删除</span>
            </el-col>
          </el-row>
          <!-- 待审核 待发布-->
          <el-row v-if="row.chkState === 0 && row.publishState === 1">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choiceCheckFn(row)">审核</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan no">修改</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishDown(row)">下架</span>
            </el-col>
            <el-col :span="4">
              <span class="col-pan no">删除</span>
            </el-col>
          </el-row>
          <!-- 已下架 -->
          <el-row v-if="row.chkState === 1 && row.publishState === 0">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5"> <span class="col-pan no">审核</span> </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="goNews(row)">修改</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishUp(row)">上架</span>
            </el-col>
            <el-col :span="4">
              <span class="col-pan" @click="remove(row)">删除</span>
            </el-col>
          </el-row>
          <!-- 已发布 -->
          <el-row v-if="row.chkState === 1 && row.publishState === 1">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5"> <span class="col-pan no">审核</span> </el-col>
            <el-col :span="5"> <span class="col-pan no">修改</span> </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishDown(row)">下架</span>
            </el-col>
            <el-col :span="4"> <span class="col-pan no">删除</span> </el-col>
          </el-row>
          <!-- 已拒绝 -->
          <el-row v-if="row.chkState === 2 && row.publishState === 0">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5"> <span class="col-pan no">审核</span> </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="goNews(row)">修改</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishUp(row)">上架</span>
            </el-col>
            <el-col :span="4">
              <span class="col-pan" @click="remove(row)">删除</span>
            </el-col>
          </el-row>
          <!-- 已拒绝 待发布-->
          <el-row v-if="row.chkState === 2 && row.publishState === 1">
            <el-col :span="5">
              <span class="col-pan" @click="seeChoice(row)">预览</span>
            </el-col>
            <el-col :span="5"> <span class="col-pan no">审核</span> </el-col>
            <el-col :span="5">
              <span class="col-pan no">修改</span>
            </el-col>
            <el-col :span="5">
              <span class="col-pan" @click="choicePublishDown(row)">下架</span>
            </el-col>
            <el-col :span="4"> <span class="col-pan no">删除</span> </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <QuestionsDialog :dialogIsShow.sync="dialogIsShow" :id="id" />
    <el-dialog
      :visible.sync="choiceCheckisShow"
      title="题目审核"
      width="400px"
      @close="closeFn"
    >
      <el-radio-group v-model="choiceCheckInfo.chkState" v-if="choiceCheckInfo">
        <el-radio :label="1">通过</el-radio>
        <el-radio :label="2">拒绝</el-radio>
      </el-radio-group>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 2 }"
        placeholder="请输入审核意见"
        v-model="choiceCheckInfo.chkRemarks"
      >
      </el-input>
      <div class="foot">
        <el-button @click="closeFn">取消</el-button>
        <el-button type="primary" @click="setChoiceCheck">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { choiceCheck, choicePublish, remove } from "@/api/hmmm/questions";
import QuestionsDialog from "../components/questions-dialog";
export default {
  name: "QuestionsChoiceList",
  data() {
    return {
      dialogIsShow: false,
      id: "",
      choiceCheckisShow: false,
      choiceCheckInfo: {
        id: "",
        chkRemarks: "",
        chkState: 1,
      },
    };
  },

  created() {},

  methods: {
    //删除
    async remove({ id }) {
      await this.$confirm("此操作将永久删除该题目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      await remove({ id });
      //判断当前是否需要向前进一页
      if (
        this.choiceInfo.counts % this.choiceInfo.pagesize === 1 &&
        this.data.page > 1 &&
        this.data.page ===
          Math.ceil(this.choiceInfo.counts / this.choiceInfo.pagesize)
      ) {
        this.SET_DATA_PAGE(this.data.page - 1);
      }
      this.$message.success("删除成功");
      this.getChoiceInfo(this.data);
    },

    // 上架
    async choicePublishUp({ id }) {
      try {
        await this.$confirm("您确认上架这道题目吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.choicePublish({ id, publishState: 1 });
      } catch (error) {
        if (error === "cancel") return;
      }
    },

    // 下架
    async choicePublishDown({ id }) {
      try {
        await this.$confirm("您确认下架这道题目吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.choicePublish({ id, publishState: 0 });
      } catch (error) {
        if (error === "cancel") return;
      }
    },

    //实际对上下架的操作
    async choicePublish(data) {
      try {
        await choicePublish(data);
        if (data.publishState) {
          this.$message.success("上架成功");
        } else {
          this.$message.success("下架成功");
        }
        this.closeFn();
        this.getChoiceInfo(this.data);
      } catch (error) {}
    },

    //修改
    goNews({ id }) {
      this.$router.push({
        path: "/questions/new",
        query: {
          id,
        },
      });
    },

    //确认审核
    async setChoiceCheck() {
      if (this.choiceCheckInfo.chkRemarks.trim()) {
        try {
          await choiceCheck(this.choiceCheckInfo);
          this.$message.success("操作成功");
          this.getChoiceInfo(this.data);
          this.closeFn();
        } catch (error) {}
      } else {
        this.$message.warning("请输入审核意见");
      }
    },

    //审核
    choiceCheckFn({ id }) {
      this.choiceCheckisShow = true;
      this.choiceCheckInfo.id = id;
    },

    //预览
    seeChoice({ id }) {
      this.id = id;
      this.dialogIsShow = true;
    },

    //关闭对话框
    closeFn() {
      this.choiceCheckisShow = false;
      // 初始化数据
      this.choiceCheckInfo = {
        id: "",
        chkRemarks: "",
        chkState: 1,
      };
    },

    //格式化学科
    formatSubject(row, column, cellValue) {
      return this.list.find((item) => item.id === cellValue)?.subjectName;
    },

    ...mapActions("questionsChoice", ["getChoiceInfo"]),
    ...mapMutations("questionsChoice", ["SET_DATA_PAGE"]),
  },

  computed: {
    ...mapState("questionsChoice", ["choiceInfo", "loading", "data"]),
  },

  props: {
    list: {
      type: Array,
    },
  },

  components: {
    QuestionsDialog,
  },
};
</script>

<style lang="scss" scoped>
.col-pan {
  font-size: 12px;
  color: #8da9fe;
  opacity: 0.8;
  cursor: pointer;
}

.no {
  color: #c0c4cc;
  cursor: not-allowed;
}

.foot {
  display: flex;
  justify-content: end;
}
::v-deep .el-textarea__inner {
  margin-top: 20px;
  margin-bottom: 60px;
}
</style>
