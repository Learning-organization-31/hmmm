<template>
  <div>
    <el-card>
      <!-- 头部搜索框 -->
      <headerTool
        @OnSearch="OnSearch"
        @Onremove="Onremove"
        @rightBtn="rightBtn"
        :buttonText="$t('table.addUser')"
      />
      <!-- 警告框 -->
      <el-alert
        style="margin-top: 18px; margin-bottom: 18px"
        :title="'共 ' + total + ' 条记录'"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 表单 -->
      <el-table
        v-loading="formLoading"
        :data="userList.list"
        style="width: 100%"
      >
        <el-table-column type="index" align="center" :label="$t('table.id')">
        </el-table-column>
        <el-table-column prop="email" align="center" :label="$t('table.email')">
        </el-table-column>
        <el-table-column prop="phone" align="center" :label="$t('table.phone')">
        </el-table-column>
        <el-table-column
          prop="username"
          align="center"
          :label="$t('table.username')"
        >
        </el-table-column>
        <el-table-column
          prop="permission_group_title"
          align="center"
          :label="$t('table.permissionUser')"
        >
        </el-table-column>
        <el-table-column prop="role" align="center" :label="$t('table.role')">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          :label="$t('table.actions')"
        >
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
              v-if="row.id !== 2"
              circle
              @click="delUser(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部上下页 -->
      <el-row type="flex" justify="end" style="margin-top: 20px">
        <pageTool
          :total="total"
          :paginationPage="getUserTerm.page"
          :paginationPagesize="getUserTerm.pagesize"
          @pageChange="pageChange"
          @pageSizeChange="pageSizeChange"
        />
      </el-row>
    </el-card>

    <!-- 新增用户弹出层 -->
    <userAdd
      ref="userAdd"
      :text="userAddText"
      pageTitle="用户"
      :formBase="formBase"
      :ruleInline="ruleInline"
      :PermissionGroupsList="permissionSimpleList"
      @newDataes="getUsersList"
      @OnClose="OnClose"
    />
  </div>
</template>

<script>
import headerTool from "../components/header-tool";
import pageTool from "../components/page-tool.vue";
import userAdd from "../components/user-add.vue";
import { mapActions, mapState } from "vuex";
import { remove, detail } from "@/api/base/users";
export default {
  data() {
    return {
      getUserTerm: {
        page: 1,
        pagesize: 10,
        username: "",
      },
      total: 0,
      formLoading: false,
      formBase: {
        username: "",
        email: "",
        password: "",
        role: "",
        permission_group_id: "",
        phone: "",
        introduction: "",
        avatar: "",
        sex: "",
      },
      ruleInline: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        permission_group_id: [
          { required: true, message: "请选择权限组", trigger: "change" },
        ],
      },
      userAddText: "",
    };
  },
  components: { headerTool, userAdd, pageTool },

  created() {
    this.getUsersList();
  },

  methods: {
    ...mapActions("users", ["getUserList", "getpermissionSimpleList"]),

    // 获取用户列表
    async getUsersList() {
      this.formLoading = true;
      await this.getUserList(this.getUserTerm);
      this.total = this.userList.counts;
      this.formLoading = false;
    },

    // 点击编辑用户
    async exitUser(id) {
      this.userAddText = "编辑";
      this.$refs.userAdd.dialogFormV();
      this.getpermissionSimpleList();
      const { data } = await detail(id);
      this.formBase.username = data.username;
      this.formBase.email = data.email;
      this.formBase.email = data.email;
      this.formBase.role = data.role;
      this.formBase.permission_group_id = data.permission_group_id;
      this.formBase.phone = data.phone;
      this.formBase.introduction = data.introduction;
      this.formBase.id = data.id;
    },

    // 点击新增用户
    rightBtn() {
      this.userAddText = "创建";
      this.$refs.userAdd.dialogFormV();
      this.getpermissionSimpleList();
    },

    // 模态框关闭
    OnClose() {
      this.formBase = {
        username: "",
        email: "",
        password: "",
        role: "",
        permission_group_id: "",
        phone: "",
        introduction: "",
        avatar: "",
        sex: "",
      };
    },

    // 点击删除用户
    delUser(userid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(userid);
          this.$message.success("删除成功");
          this.getUsersList();
        })
        .catch(() => {
          this.$message.info("已取消操作");
        });
    },

    // 点击搜索
    OnSearch(keyword) {
      if (this.formLoading) return; // 防抖
      this.getUserTerm.page = 1;
      this.getUserTerm.username = keyword;
      this.getUsersList();
    },

    // 点击清空
    Onremove() {
      if (this.formLoading || !this.getUserTerm.username) return; // 防抖
      this.getUserTerm.username = "";
      this.getUserTerm.page = 1;
      this.getUsersList();
    },

    // 切换page
    pageChange(pageNum) {
      if (this.formLoading) return; // 防抖
      this.getUserTerm.page = pageNum;
      this.getUsersList();
    },

    // 切换pageSize
    pageSizeChange(pageSize) {
      this.getUserTerm.pagesize = pageSize;
      this.getUsersList();
    },
  },

  computed: {
    ...mapState("users", ["userList", "permissionSimpleList"]),
  },
};
</script>

<style scoped lang="less"></style>
