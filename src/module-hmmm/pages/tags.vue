<template>
  <div class="container">
    <el-card class="box-card">
      <el-breadcrumb separator=">" v-if="$route?.query?.row?.id">
        <el-breadcrumb-item :to="{ path: '/subjects/list' }"
          >学科管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>{{
          $route.query.row.subjectName
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>目录</el-breadcrumb-item>
      </el-breadcrumb>
      <Search leftTitle="标签名称" rightTitle="状态"></Search>
      <addTag @getTag="getTag" :tagList="tagList"></addTag>
      <el-tag type="info">
        <i class="el-icon-info"></i>
        数据一共 {{ taginfo }} 条</el-tag
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

        <el-table-column label="状态" prop="state">
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
              :disabled="row.state === 1"
              @click="editInfo(row.id)"
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
      <el-dialog title="修改目录" :visible.sync="dialogVisible" width="22%">
        <el-form :model="form" :rules="EditformRules" ref="editForm">
          <el-form-item label="所属学科" prop="subjectID">
            <el-select v-model="tagInfo.subjectID" class="selected">
              <el-option
                v-for="item in tagList"
                :key="item.id"
                :label="item.subjectName"
                :value="item.subjectID"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目录名称" prop="tagName">
            <el-input class="inputdir" v-model="tagInfo.tagName"></el-input>
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
import addTag from "./components/addTag.vue";
import {
  list,
  delTag,
  tagInfo,
  update,
  changeState,
} from "../../api/hmmm/tags";
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
        directoryName: "",
        state: null,
        subjectID: null,
      },
      totalCount: 0,
      tagInfo: {},
      dialogVisible: false,
      form: {
        subjectID: 0,
        tagName: "",
      },
      taginfo: "",
      EditformRules: {
        subjectID: [
          {
            required: true,
            message: "请选择学科",
            trigger: "blur",
          },
        ],
        tagName: [
          {
            required: true,
            message: "请输入目录名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getTagList();
    this.pages.subjectID = this.$route?.query?.row?.id;
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    ...mapActions("subject", ["setSubjectList"]),
    async getTagList() {
      // const { data } = await list({
      //   page: this.pages.page,
      //   pagesize: this.pages.pagesize,
      // });
      const { data } = await list(this.pages);
      this.taginfo = data.counts;
      this.tagList = data.items;
      // this.tagList.forEach((item, index) => {
      //   if (item.state === 1) {
      //     this.tagList[index].state = "已启用";
      //   } else {
      //     this.tagList[index].state = "已禁用";
      //   }
      // });
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
    //点击修改状态按钮
    async editBtn(row) {
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("状态修改成功");
    },
    //点击修改按钮
    async editInfo(id) {
      const { data } = await tagInfo(id);
      this.tagInfo = data;
      this.dialogVisible = true;
    },
    async saveBtn() {
      await update({
        id: this.tagInfo.id,
        subjectID: this.tagInfo.subjectID,
        tagName: this.tagInfo.tagName,
      });
      this.$message.success("修改成功");
      this.dialogVisible = false;
      this.getTagList();
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
    margin-right: 1px;
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
  ::v-deep .el-form-item__error {
    margin-left: 80px;
  }
}
</style>
