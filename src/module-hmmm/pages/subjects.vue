<template>
  <div class="container">
    <el-card class="box-card">
      <Search
        leftTitle="学科名称"
        @SearchClear="SearchClear"
        @SearchContent="SearchFn"
        :content="content"
        ref="formTable"
      ></Search>
      <addButton @parentMethod="refreshPage"></addButton>
      <el-tag type="info">
        <i class="el-icon-info"></i>
        数据一共 {{ infoCount }} 条</el-tag
      >
      <el-table style="width: 100%" :data="subjectListInfo">
        <el-table-column
          prop="date"
          label="序号"
          width="70"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="subjectName" label="学科名称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="{ row }">
            {{ row.addDate | formateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="isFrontDisplay" label="前台是否显示">
        </el-table-column>
        <el-table-column prop="twoLevelDirectory" label="二级目录">
        </el-table-column>
        <el-table-column prop="tags" label="标签"> </el-table-column>
        <el-table-column prop="totals" label="题目数量"> </el-table-column>
        <el-table-column prop="address" label="操作" width="210">
          <template v-slot:default="row">
            <el-button @click="handleClick(row)" type="text" size="small"
              >学科分类</el-button
            >
            <el-button type="text" size="small" @click="handTag(row)"
              >学科标签</el-button
            >
            <el-button type="text" size="small" @click="editFn(row)"
              >修改</el-button
            >
            <el-button type="text" size="small" @click="delFn(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="infoCount"
        @current-change="currentChange"
        :page-size="pages.pagesize"
        :current-page="pages.page"
        :page-sizes="[5, 10, 20, 50]"
        @size-change="handleSizeChange"
      >
      </el-pagination>
      <el-dialog title="修改学科" :visible.sync="dialogVisible" width="25%">
        <el-form :model="form" :rules="formRule" ref="formSubject">
          <el-form-item
            label="学科名称"
            :label-width="formLabelWidth"
            prop="subjectName"
          >
            <el-input
              v-model="subjectInfo.subjectName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="isFrontDisplay">
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              v-model="subjectInfo.isFrontDisplay"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!-- <template slot-scope="{ row }"> -->
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="saveBtn">确 定</el-button>
          <!-- </template> -->
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Search from "../components/search.vue";
import addButton from "./addButton.vue";

import {
  detail,
  list,
  remove,
  update,
  simple,
  deleteInfo,
  subjectInfo,
} from "../../api/hmmm/subjects";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  components: {
    Search,
    addButton,
  },
  data() {
    return {
      content: "",
      subjectListInfo: [],
      infoCount: 0, //tag标签数量
      pages: {
        page: 1,
        pagesize: 10,
      },
      dialogVisible: false,

      formList: {
        id: "",
        addDate: "",
        creatorID: 0,
        isFrontDisplay: 0,
        subjectName: "",
        tags: 0,
        totals: 0,
        twoLevelDirectory: 0,
      },

      pageinfo: {
        subjectName: "",
        page: 1,
        pagesize: 10,
      },
      subjectInfo: {}, //学科信息
      dialogVisible: false,
      form: {
        subjectName: "",
        isFrontDisplay: 1,
      },
      formLabelWidth: "60px",
      value: "",
      subjectSearch: "",
      formRule: {
        subjectName: [
          {
            required: true,
            message: "请输入学科名称",
            trigger: "blur",
          },
        ],
        isFrontDisplay: [
          {
            required: true,
            message: "是否显示",
            trigger: "blur",
          },
        ],
        pageCount: 0,
      },
    };
  },
  created() {
    this.getSubject();
    this.getInfoList();
    const h = this.$createElement;
    this.$notify({
      title: "作业人",
      message: h(
        "b",
        {
          style: "color: #5ee7df",
        },
        "金絮帆"
      ),
      type: "success",
      duration: 3000,
    });
  },
  computed: {
    ...mapState("subject", ["subjectList"]),
  },
  methods: {
    ...mapActions("subject", ["setSubjectList"]),
    ...mapMutations("subject", ["getSubjectList"]),
    async getInfoList(payload) {
      await this.setSubjectList(payload);
    },
    async getSubject() {
      // const { data } = await list({
      //   subjectName: this.subjectSearch,
      //   page: this.pages.page,
      //   pagesize: this.pages.pagesize,
      // });
      const { data } = await list(this.pageinfo);
      //获取标签数量
      this.infoCount = data.counts;
      this.pageCount = data.pages;
      //拿到table表格数据，然后将其进行渲染
      this.subjectListInfo = data.items;
      this.subjectListInfo.forEach((item, index) => {
        if (item.isFrontDisplay === 1) {
          this.subjectListInfo[index].isFrontDisplay = "是";
        } else {
          this.subjectListInfo[index].isFrontDisplay = "否";
        }
      });
    },
    //点击清空按钮，输入框内容清空
    SearchClear() {
      this.$refs.formTable.content = "";
    },
    //点击搜索，出现对应内容
    async SearchFn(val, page, pagesize) {
      this.pageinfo.subjectName = val;
      this.pageinfo.page = page;
      this.pageinfo.pagesize = pagesize;
      this.getSubject();
    },
    indexMethod(index) {
      return index + 1;
    },
    //点击，实现路由跳转
    handleClick(val) {
      this.$router.push({
        path: "/subjects/directorys",
        query: val,
      });
    },
    //点击学科标签，实现路由跳转
    handTag(val) {
      this.$router.push({
        path: "/subjects/tags",
        query: val,
      });
    },
    // 点击分页改变
    currentChange(val) {
      this.pageinfo.page = val;
      this.getSubject();
    },
    //修改数字，显示每一页
    handleSizeChange(val) {
      this.pageinfo.pagesize = +val;
      this.getSubject();
    },
    //添加后，重新更新页面
    refreshPage() {
      this.getSubject();
    },
    //删除数据
    async delFn({ row }) {
      await this.$confirm("您确定删除该数据吗？");
      await deleteInfo(row.id);
      this.$message.success("删除成功");
      let deleteAfterPage = Math.ceil(
        (this.infoCount - 1) / this.pageinfo.pagesize
      );
      let currentPage =
        this.pageinfo.page > deleteAfterPage
          ? deleteAfterPage
          : this.pageinfo.page;
      this.pageinfo.page = currentPage < 1 ? 1 : currentPage;
      this.getSubject();
    },
    //打开修改信息弹层
    async editFn({ row }) {
      const { data } = await subjectInfo(row.id);
      this.subjectInfo = data;
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.$refs.formSubject.resetFields();
    },
    //修改信息
    async saveBtn() {
      await update({
        id: this.subjectInfo.id,
        subjectName: this.subjectInfo.subjectName,
        isFrontDisplay: this.subjectInfo.isFrontDisplay,
      });
      this.$message.success("修改成功");
      this.getSubject();
      this.close();
    },
  },
};
</script>

<style scoped lang="less">
.container {
  .el-tag {
    width: 100%;
    height: 35px;
    line-height: 35px;
  }
  .el-icon-info {
    font-size: 16px;
    width: 16px;
    margin-right: 5px;
  }
  .el-pagination {
    margin-top: 20px;
    margin-left: 1280px;
  }
  ::v-deep .el-pagination__jump {
    margin-left: 0px;
  }
  ::v-deep .el-form-item__label {
    width: 80px !important;
  }
  .el-input {
    width: 80%;
    margin-left: 10px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
  }
  .el-switch {
    margin-left: 10px;
  }
}
</style>
