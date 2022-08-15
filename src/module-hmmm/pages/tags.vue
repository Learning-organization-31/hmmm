<template>
  <div class="container">
    <el-card class="box-card">
      <Search leftTitle="标签名称" rightTitle="状态"></Search>
      <addTag @getTag="getTag"></addTag>
      <el-tag type="info">
        <i class="el-icon-info"></i>
        数据一共 {{ totalCount }} 条</el-tag
      >
      <el-table style="width: 100%" :data="tagList">
        <el-table-column
          prop="date"
          label="序号"
          width="70"
          type="index"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="subjectName" label="所属学科"> </el-table-column>
        <el-table-column prop="tagName" label="标签名称"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="row">
            {{ row.addDate | formateTime }}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column prop="address" label="操作" width="210">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="editBtn(row.id)"
              :disabled="disabled"
              >禁用</el-button
            >
            <el-button type="text" size="small" :disabled="disabled"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="delFn(row.id)"
              :disabled="disabled"
              >删除</el-button
            >
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
import addTag from "./components/addTag.vue";
import { list, delTag } from "../../api/hmmm/tags";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Search,
    addTag,
  },
  data() {
    return {
      tagList: [],
      pages: {
        page: 1,
        pagesize: 10,
      },
      totalCount: 0,
      disabled: false,
    };
  },
  created() {
    this.getTagList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    ...mapActions("subject", ["setSubjectList"]),
    async getTagList() {
      const { data } = await list({
        page: this.pages.page,
        pagesize: this.pages.pagesize,
      });
      this.tagList = data.items;
      this.tagList.forEach((item, index) => {
        if (item.state === 1) {
          this.tagList[index].state = "已启用";
        } else {
          this.tagList[index].state = "已禁用";
        }
      });
      await this.setSubjectList();
    },
    currentChange(val) {
      this.pages.page = val;
      this.getTagList();
    },
    //
    handleSizeChange(val) {
      this.pages.page = val;
      this.pages.pagesize = val;
      this.getTagList();
    },
    //子组件调用父组件方法
    getTag() {
      this.getTagList();
    },
    //点击实现删除
    async delFn(id) {
      await this.$confirm("是否确认删除？");
      await delTag(id);
      this.$message.success("删除成功");
      this.getTagList();
    },
    //点击修改按钮
    editBtn(id) {
      if (this.disabled) {
        this.disabled = !this.disabled;
      }
    },
  },
  computed: {
    ...mapState("subject", ["subjectList"]),
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
