<template>
  <div class="menus-box">
    <el-card>
      <!-- 头部按钮 -->
      <headerTool
        buttonText="添加菜单"
        :SearchIsShow="false"
        @rightBtn="rightBtn"
      />
      <!-- 表单区域 -->
      <el-table
        :data="renderList"
        style="width: 100%"
        row-key="id"
        :tree-props="{ children: 'childs' }"
        default-expand-all
        >>
        <el-table-column label="标题">
          <template v-slot="{ row }">
            <i
              v-if="row.childs && !row.childs?.[0].is_point"
              class="el-icon-folder-opened menus-icon"
            ></i>
            <i
              v-if="!row.is_point && (row.childs?.[0].is_point || !row.childs)"
              class="el-icon-document-remove menus-icon"
            ></i>
            <i v-if="row.is_point" class="el-icon-view menus-icon"></i>
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column prop="code" label="权限点代码"> </el-table-column>
        <el-table-column
          prop="address"
          :label="$t('table.actions')"
          align="center"
        >
          <template v-slot="{ row }">
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              circle
              @click="exitmenus(row.id)"
            ></el-button>
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              circle
              @click="delmenus(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出层 -->
    <menusAdd ref="menusAdd" text="创建" pageTitle="菜单" />
  </div>
</template>

<script>
import headerTool from "../components/header-tool.vue";
import menusAdd from "../components/menu-add.vue";
import { mapActions, mapState } from "vuex";
import { remove } from "@/api/base/menus";

export default {
  data() {
    return {
      renderList: [],
    };
  },

  components: { headerTool, menusAdd },

  created() {
    this.getmenus();
  },

  methods: {
    ...mapActions("users", ["getmenusList"]),
    // 获取菜单列表
    async getmenus() {
      await this.getmenusList();
      this.renderList = JSON.parse(
        JSON.stringify(this.menusList).replace(/points/g, "childs")
      );
    },
    // 点击修改
    exitmenus(id) {
      console.log(id);
    },
    // 点击删除
    delmenus(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await remove(id);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getmenus();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击添加菜单
    rightBtn() {
      this.$refs.menusAdd.dialogFormVisible = true;
    },
  },
  computed: {
    ...mapState("users", ["menusList"]),
  },
};
</script>

<style scoped lang="less">
.menus-box {
  .menus-icon {
    font-size: 20px;
  }
}
::v-deep.el-table [class*="el-table__row--level"] .el-table__expand-icon {
  display: none;
}
</style>
