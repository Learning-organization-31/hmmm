<template>
  <div>
    <el-button
      type="success"
      class="addSubject"
      icon="el-icon-edit"
      @click="addFn"
      >新增学科</el-button
    >
    <el-dialog title="新增学科" :visible.sync="dialogVisible" width="20%">
      <el-form :model="form" :rules="formRules" ref="form">
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
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add } from "../../api/hmmm/subjects";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        subjectName: "",
        isFrontDisplay: 1,
      },
      formLabelWidth: "60px",
      //表单校验
      formRules: {
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
      },
    };
  },

  created() {},

  methods: {
    addFn() {
      this.dialogVisible = true;
    },
    //点击取消，关闭弹窗，然后将内容重置
    close() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    //点击按钮新增
    async saveBtn() {
      //点击新增，如果内容为空，进行表单校验
      this.$refs.form.validate();
      await add({
        subjectName: this.form.subjectName,
        isFrontDisplay: this.form.isFrontDisplay,
      });
      this.$message.success("添加成功");
      this.$emit("parentMethod");
      this.close();
    },
  },
};
</script>

<style scoped lang="less">
.addSubject {
  position: absolute;
  right: 30px;
  top: 32px;
  height: 33px;
  width: 97px;
  display: flex;
  justify-content: center;
  align-items: center;
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
::v-deep .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 30px;
}
</style>
