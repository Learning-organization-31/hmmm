<template>
  <div class="container">
    <el-card class="box-card">
      <div v-if="$route?.query?.row?.id">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/subjects/list' }"
            ><span class="manger"> 学科管理 </span></el-breadcrumb-item
          >
          <el-breadcrumb-item>{{
            $route.query.row.subjectName
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>目录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="backto" @click="backtoUp">
          <i class="el-icon-back"></i>
          <a>返回学科</a>
        </div>
      </div>
      <Search
        leftTitle="目录名称"
        rightTitle="状态"
        @SearchClear="SearchClear"
        @SearchContent="SearchFn"
        :typeList="typeList"
        ref="form"
      ></Search>
      <addDirective
        @getDirective="getInfo"
        :directiveList="directiveList"
      ></addDirective>
      <el-tag type="info">
        <i class="el-icon-info"></i>
        数据一共 {{ totalCount }} 条</el-tag
      >
      <el-table style="width: 100%" :data="directiveList">
        <el-table-column
          prop="date"
          label="序号"
          width="70"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
        <el-table-column prop="directoryName" label="目录名称">
        </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="{ row }">
            {{ row.addDate | formateTime }}
          </template>
        </el-table-column>

        <el-table-column prop="totals" label="面试题数量"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="{ row }">
            {{ row.state === 0 ? "已禁用" : "已启用" }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="210">
          <template slot-scope="{ row }">
            <el-button type="text" @click="editBtn(row)">{{
              row.state === 0 ? "启用" : "禁用"
            }}</el-button>
            <el-button
              type="text"
              @click="editInfo(row.id)"
              :disabled="row.state === 1"
              >修改</el-button
            >
            <el-button
              type="text"
              @click="delFn(row.id)"
              :disabled="row.state === 1"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改目录" :visible.sync="dialogVisible" width="23%">
        <el-form :model="form" ref="form">
          <el-form-item label="所属学科" prop="subjectID">
            <el-select v-model="detailInfo.subjectID" class="selected">
              <el-option
                v-for="item in subjectlis"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录名称" prop="directoryName">
            <el-input
              class="inputdir"
              v-model="detailInfo.directoryName"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!-- <template slot-scope="row"> -->
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBtn">确 定</el-button>
          <!-- </template> -->
        </span>
      </el-dialog>
      <el-pagination
        background
        :total="totalCount"
        layout="prev, pager, next,sizes,jumper"
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
import addDirective from "./components/addDirective.vue";
import {
  directoryList,
  deleteDirectory,
  detailInfo,
  update,
  changeState,
  list,
} from "../../api/hmmm/directorys";
import { mapActions, mapState } from "vuex";
import { simple } from "../../api/hmmm/subjects";
export default {
  components: {
    Search, //注册搜索页面
    addDirective, //注册新增组件
  },
  data() {
    return {
      //用来接收请求后的数据，用来渲染页面
      directiveList: [],
      subjectlis: [],
      //页面请求后台需要用到的数据
      pages: {
        page: 1,
        pagesize: 10,
        directoryName: "",
        state: null,
        subjectID: null,
      },
      totalCount: 0, //tag上面的数据内容
      subjectName: [], //学科名

      typeList: [], //搜索框状态
      dialogVisible: false,
      form: {},
      value: "",
      detailInfo: {},
      states: false,
      // formdir: {
      //   subjectID: [
      //     {
      //       required: true,
      //       message: "请选择学科",
      //       trigger: "blur",
      //     },
      //   ],
      //   directoryName: [
      //     {
      //       required: true,
      //       message: "请输入目录名称",
      //       trigger: "blur",
      //     },
      //   ],
      // },
    };
  },
  //页面一加载，就需要获取到数据，然后渲染table
  created() {
    this.pages.subjectID = this.$route?.query?.row?.id;
    this.getDirective();
    this.getSubject();
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
  methods: {
    async getSubject() {
      const res = await simple();
      // this.subjectlis = res.data.items;
      this.subjectlis = res.data;
    },
    indexMethod(index) {
      return index + 1;
    },
    backtoUp() {
      this.$router.back();
    },
    ...mapActions("subject", ["setSubjectList"]),
    ...mapActions("subject", ["setDirectoryList"]),
    //发送请求，获取到数据，然后渲染页面
    async getDirective(payload) {
      //调用vuex里面的方法
      await this.setSubjectList(payload);
      await this.setDirectoryList(payload);
      // const { data } = await directoryList({
      //   page: this.pages.page,
      //   pagesize: this.pages.pagesize,
      // });
      const { data } = await list(this.pages);
      // this.pages
      this.totalCount = data.counts;
      this.directiveList = data.items;
      //通过foreach遍历，然后修改状态
      // this.directiveList.forEach((item, index) => {
      //   if (item.state === 1) {
      //     this.directiveList[index].state = "已启用";
      //   } else {
      //     this.directiveList[index].state = "已禁用";
      //   }
      // });
    },
    //点击清除按钮，搜索框内容清空
    SearchClear() {
      this.$refs.form.content = "";
    },
    //搜索框搜索
    async SearchFn(value, state, page, pagesize) {
      this.pages.page = page;
      this.pages.pagesize = pagesize;
      this.pages.directoryName = value;
      if (state !== "") {
        this.pages.state = state;
      } else {
        this.pages.state = null;
      }
      this.getDirective();
    },
    //修改分页
    currentChange(val) {
      this.pages.page = val;
      this.getDirective();
    },
    //修改分页，点击数字实现页面条数
    handleSizeChange(val) {
      this.pages.pagesize = +val;
      this.getDirective();
    },
    //删除信息
    async delFn(id) {
      await this.$confirm("您确定删除该数据吗？");
      await deleteDirectory(id);
      this.$message.success("删除成功");
      let deleteAfterPage = Math.ceil(
        (this.totalCount - 1) / this.pages.pagesize
      );
      let currentPage =
        this.pages.page > deleteAfterPage ? deleteAfterPage : this.pages.page;
      this.pages.page = currentPage < 1 ? 1 : currentPage;
      this.getDirective();
    },
    //子组件点击新增，重新渲染页面，帮子页面获取到父组件方法
    getInfo() {
      //给子组件调用页面已进入方法
      this.getDirective();
    },
    //修改按钮，点击禁用，按钮不可点击，点击启用，按钮可以点击
    async editBtn(row) {
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("状态修改成功");
    },
    //点击修改按钮，显示弹框
    async editInfo(id) {
      const { data } = await detailInfo(id);
      this.detailInfo = data;
      this.dialogVisible = true;
    },
    //点击确认，更改信息
    async saveBtn() {
      await update({
        id: this.detailInfo.id,
        subjectID: this.detailInfo.subjectID,
        directoryName: this.detailInfo.directoryName,
      });
      this.$message.success("修改成功");
      this.dialogVisible = false;
      this.getDirective();
    },
  },
  computed: {
    ...mapState("subject", ["subjectList"]),
    ...mapState("subject", ["directoryList"]),
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
  .inputdir {
    width: 75% !important;
  }
  .selected {
    width: 75%;
  }
  .el-breadcrumb {
    margin-bottom: 10px;
  }
  .manger {
    color: #333;
  }
  .backto {
    color: blue;
    position: absolute;
    right: 150px;
    top: 45px;
  }
}
</style>
