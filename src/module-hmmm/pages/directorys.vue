<template>
  <div class="container">
    <el-card class="box-card">
      <Search leftTitle="目录名称" rightTitle="状态"></Search>
      <addButton></addButton>
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
          <template slot-scope="row">
            {{ row.addDate | formateTime }}
          </template>
        </el-table-column>

        <el-table-column prop="totals" label="面试题数量"> </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column prop="address" label="操作" width="210">
          <template>
            <el-button type="text" size="small">禁用</el-button>
            <el-button type="text" size="small">修改</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import addButton from "./addButton.vue";
import { list } from "../../api/hmmm/directorys";
export default {
  components: {
    Search,
    addButton,
  },
  data() {
    return {
      directiveList: [],
      pages: {
        page: 1,
        pagesize: 10,
      },
      totalCount: 0,
    };
  },
  created() {
    this.getDirectiveList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    async getDirectiveList() {
      const { data } = await list({
        page: this.pages.page,
        pagesize: this.pages.pagesize,
      });
      this.totalCount = data.counts;
      this.directiveList = data.items;
      console.log(this.directiveList);
    },
    currentChange(val) {
      this.pages.page = val;
      this.getDirectiveList();
    },
    //
    handleSizeChange() {
      console.log(`每页 ${val} 条`);
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
}
</style>
