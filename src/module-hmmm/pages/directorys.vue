<template>
  <div class="container">
    <el-card class="box-card">
      <Search
        leftTitle="目录名称"
        rightTitle="状态"
        @SearchClear="SearchClear"
        @SearchContent="SearchFn"
        :typeList="typeList"
        ref="formData"
      ></Search>
      <addDirective @getDirective="getInfo"></addDirective>
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
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column prop="address" label="操作" width="210">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="disabled"
              @click="editBtn"
              >禁用</el-button
            >
            <el-button type="text" size="small" @click="editInfo(row.id)"
              >修改</el-button
            >
            <el-button type="text" size="small" @click="delFn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改目录" :visible.sync="dialogVisible" width="25%">
        <el-form :model="form">
          <el-form-item label="所属学科" prop="subjectID">
            <el-select v-model="value" class="selected">
              <el-option
                v-for="item in directiveList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录名称" prop="isFrontDisplay">
            <el-input autocomplete="off" class="inputdir"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <!-- <template slot-scope="row"> -->
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editInfo">确 定</el-button>
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
import Dialogy from "./components/dialogyDirective.vue";
import addDirective from "./components/addDirective.vue";
import { list, deleteDirectory, changeState } from "../../api/hmmm/directorys";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    Search, //注册搜索页面
    addDirective, //注册新增组件
    Dialogy,
  },
  data() {
    return {
      //用来接收请求后的数据，用来渲染页面
      directiveList: [],
      //页面请求后台需要用到的数据
      pages: {
        page: 1,
        pagesize: 10,
      },
      totalCount: 0, //tag上面的数据内容
      subjectName: [], //学科名
      disabled: false, //控制按钮是否可以点击
      typeList: [], //搜索框状态
      dialogVisible: false,
      form: {},
      value: "",
    };
  },
  //页面一加载，就需要获取到数据，然后渲染table
  created() {
    this.getDirectiveList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    ...mapActions("subject", ["setSubjectList"]),
    ...mapActions("subject", ["setState"]),
    //发送请求，获取到数据，然后渲染页面
    async getDirectiveList(payload) {
      const { data } = await list({
        page: this.pages.page,
        pagesize: this.pages.pagesize,
      });
      this.totalCount = data.counts;
      this.directiveList = data.items;
      //通过foreach遍历，然后修改状态
      this.directiveList.forEach((item, index) => {
        if (item.state === 1) {
          this.directiveList[index].state = "已启用";
        } else {
          this.directiveList[index].state = "已禁用";
        }
      });
      // const res = await changeState();
      // console.log(res);
      //调用vuex里面的方法
      await this.setSubjectList(payload);
      await this.setState(payload);
    },
    //点击清除按钮，搜索框内容清空
    SearchClear() {
      this.$refs.formData.content = "";
    },
    //搜索框搜索
    SearchFn() {},
    //修改分页
    currentChange(val) {
      this.pages.page = val;
      this.getDirectiveList();
    },
    //修改分页，点击数字实现页面条数
    handleSizeChange(val) {
      this.pages.page = val;
      this.pages.pagesize = val;
      this.getSubject();
    },
    //删除信息
    async delFn(id) {
      await this.$confirm("您确定删除该数据吗？");
      await deleteDirectory(id);
      this.$message.success("删除成功");
      this.getDirectiveList();
    },
    //子组件点击新增，重新渲染页面，帮子页面获取到父组件方法
    getInfo() {
      //给子组件调用页面已进入方法
      this.getDirectiveList();
    },
    //修改按钮，点击禁用，按钮不可点击，点击启用，按钮可以点击
    editBtn() {},
    editInfo(id) {
      this.dialogVisible = true;
    },
  },
  computed: {
    ...mapState("subject", ["subjectList"]),
    // ...mapState("subject", ["dirstate"]),
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
}
</style>
