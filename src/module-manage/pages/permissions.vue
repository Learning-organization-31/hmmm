<template>
  <div>
    <el-card>
      <!-- 头部搜索框 -->
      <headerTool
        :buttonText="$t('table.permissionNew')"
        @OnSearch="OnSearch"
        @Onremove="Onremove"
        @rightBtn="rightBtn"
      />
      <!-- 提示框 tips -->
      <el-alert
        style="margin-top: 18px; margin-bottom: 18px"
        :title="'共 ' + counts + ' 条记录'"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表单区域 -->
      <el-table
        v-loading="permissLoading"
        ref="multipleTable"
        :data="permissionList.list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column type="selection" width="100" align="center" />
        <el-table-column
          prop="title"
          :label="$t('table.username')"
          align="center"
        />
        <el-table-column
          prop="create_date"
          :label="$t('table.date')"
          :formatter="formatterTime"
          sortable
        >
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              circle
              @click="exitUser(row.id)"
            ></el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              circle
              @click="delUser(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部切换 -->
      <el-row type="flex" justify="end" style="margin-top: 20px">
        <pageTool
          :total="counts"
          :paginationPage="getpermissTerm.page"
          :paginationPagesize="getpermissTerm.pagesize"
          @pageChange="pageChange"
          @pageSizeChange="pageSizeChange"
        />
      </el-row>
    </el-card>

    <!-- 新增权限组弹出层 -->
    <permissionsAdd
      ref="permissDia"
      :text="permissionsAddText"
      pageTitle="权限组"
      :ruleInline="ruleInline"
      @newDataes="getpermission"
    />
  </div>
</template>

<script>
import headerTool from "../components/header-tool.vue";
import pageTool from "../components/page-tool.vue";
import permissionsAdd from "../components/permissions-add.vue";
import { mapActions, mapState } from "vuex";
import { parseTime } from "@/utils";
import { remove, detail } from "@/api/base/permissions";
export default {
  data() {
    return {
      multipleSelection: [],
      getpermissTerm: {
        page: 1,
        pagesize: 10,
        title: "",
      },
      counts: 0,
      permissLoading: false,
      ruleInline: {
        title: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
      },
      permissionsAddText: "",
    };
  },
  components: { headerTool, pageTool, permissionsAdd },
  created() {
    this.getpermission();
    this.$notify({
      message: "徐金平",
      duration: 1500,
    });
  },

  methods: {
    ...mapActions("users", ["getpermissionList"]),
    // 获取权限组列表
    async getpermission() {
      this.permissLoading = true;
      await this.getpermissionList(this.getpermissTerm);
      this.counts = this.permissionList.counts;
      this.permissLoading = false;
    },
    // 点击编辑用户
    async exitUser(id) {
      this.permissionsAddText = "编辑";
      this.$refs.permissDia.dialogFormV();
      const { data } = await detail(id);
      this.$refs.permissDia.formBase = data;
    },
    // 点击新增权限组
    rightBtn() {
      this.permissionsAddText = "创建";
      this.$refs.permissDia.dialogFormV();
    },
    // 点击删除用户
    async delUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(id);
          if (this.permissionList.list.length <= 1) {
            this.getpermissTerm.page -= 1;
          }
          this.$message.success("删除成功");
          this.getpermission();
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },
    // 点击搜索
    OnSearch(val) {
      if (this.permissLoading) return; // 防抖
      this.getpermissTerm.page = 1;
      this.getpermissTerm.title = val;
      this.getpermission();
    },
    // 点击清空
    Onremove() {
      if (this.permissLoading || !this.getpermissTerm.title) return;
      this.getpermissTerm.page = 1;
      this.getpermissTerm.title = "";
      this.getpermission();
    },
    // 复选框切换
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 页脚切换
    pageChange(pageNum) {
      if (this.permissLoading) return; // 防抖
      this.getpermissTerm.page = pageNum;
      this.getpermission();
    },
    pageSizeChange(pageSize) {
      this.getpermissTerm.pagesize = pageSize;
      this.getpermission();
    },
    // 时间格式化
    formatterTime(a, b, val) {
      return parseTime(val, "{y}-{m}-{d}");
    },
  },
  computed: {
    ...mapState("users", ["permissionList"]),
  },
};
</script>

<style scoped lang="less"></style>
