<template>
  <div>
    <el-button
      type="success"
      class="addSubject"
      icon="el-icon-edit"
      @click="addFn"
      >新增目录</el-button
    >
    <el-dialog title="新增目录" :visible.sync="dialogVisible" width="25%">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item
          label="所属学科"
          :label-width="formLabelWidth"
          prop="subjectID"
        >
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="目录名称"
          :label-width="formLabelWidth"
          prop="directoryName"
        >
          <el-input
            v-model="form.directoryName"
            autocomplete="off"
            placeholder="请输入目录名称"
          ></el-input>
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
import { mapActions, mapState } from "vuex";
import { add } from "../../../api/hmmm/directorys";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        subjectID: 1,
        directoryName: "",
      },
      formLabelWidth: "60px",
      //表单校验
      formRules: {
        subjectName: [
          {
            required: true,
            message: "请选择所属学科",
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
      value: "",
    };
  },

  created() {},

  methods: {
    ...mapActions("subject", ["setSubjectList"]),
    addFn() {
      this.dialogVisible = true;
    },
    //点击取消，关闭弹窗，然后将内容重置
    close() {
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    async saveBtn() {
      await add(this.form);
      this.$message.success("添加成功");
      this.close(); //添加成功，关闭弹层
      this.$emit("getDirective");
    },
  },
  computed: {
    ...mapState("subject", ["subjectList"]),
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
::v-deep .el-select {
  margin-left: 10px;
}
</style>
