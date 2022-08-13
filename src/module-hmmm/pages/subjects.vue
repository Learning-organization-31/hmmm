<template>
  <div class="container">
    <el-card class="box-card">
      <Search
        leftTitle="学科名称"
        @SearchClear="SearchClear"
        @SearchContent="SearchContent"
      ></Search>
      <addButton @parentMethod="refreshPage"></addButton>
      <el-tag type="info">
        <i class="el-icon-info"></i>
        数据一共 {{ infoCount }} 条</el-tag
      >
      <el-table style="width: 100%" :data="subjectList">
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
          <template slot-scope="row">
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
          <template slot-scope="{ row }">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >学科分类</el-button
            >
            <el-button type="text" size="small">学科标签</el-button>
            <el-button type="text" size="small" @click="editFn(row.id)"
              >修改</el-button
            >
            <el-button type="text" size="small" @click="delFn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改学科" :visible.sync="dialogVisible" width="20%">
        <el-form :model="form">
          <el-form-item
            label="学科名称"
            :label-width="formLabelWidth"
            prop="subjectName"
          >
            <el-input v-model="form.subjectName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="isFrontDisplay">
            <el-switch
              v-model="form.isFrontDisplay"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog>
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
    </el-card>
  </div>
</template>

<script>
import Search from "../components/search.vue";
import addButton from "./addButton.vue";
import { detail, list, remove, update } from "../../api/hmmm/subjects";
export default {
  components: {
    Search,
    addButton,
  },
  data() {
    return {
      subjectList: [],
      infoCount: 0, //tag标签数量
      pages: {
        page: 1,
        pagesize: 10,
      },
      dialogVisible: false,
      formLabelWidth: "60px",
      form: {
        subjectName: "",
        isFrontDisplay: 1,
      },
      val: "",
    };
  },
  created() {
    this.getSubject();
    this.editFn();
  },
  methods: {
    //点击清空按钮，输入框内容清空
    SearchClear(content, status) {
      content: "";
      status: "";
    },
    //点击搜索，出现对应内容
    SearchContent() {},
    async getSubject() {
      const { data } = await list({
        page: this.pages.page,
        pagesize: this.pages.pagesize,
      });
      //获取标签数量
      this.infoCount = data.counts;
      //拿到table表格数据，然后将其进行渲染
      this.subjectList = data.items;
      console.log(this.subjectList);
    },
    indexMethod(index) {
      return index + 1;
    },
    handleClick() {},
    // 点击分页改变
    currentChange(val) {
      this.pages.page = val;
      this.getSubject();
    },
    //
    handleSizeChange(val, it) {
      this.pages.page = val;
      this.pages.pagesize = it;
      this.getSubject();
    },
    //添加后，重新更新页面
    refreshPage() {
      this.getSubject();
    },
    //删除数据
    async delFn(id) {
      console.log(id);
      await this.$confirm("您确定删除该数据吗？");
      await remove(id);
      this.$message.success("删除成功");
      this.getSubject();
    },
    //修改信息
    async editFn(id) {
      const res = await detail(id);
      console.log(res);
      this.dialogVisible = true;
      // const res = await update(id);
      // console.log(res);
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
