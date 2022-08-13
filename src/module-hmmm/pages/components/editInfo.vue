<template>
  <div>
    <el-dialog title="新增学科" :visible.sync="dialogVisible" width="20%">
      <el-form :model="form">
        <el-form-item
          label="学科名称"
          :label-width="formLabelWidth"
          prop="subjectName"
        >
          <el-input v-model="form.subjectName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isFrontDisplay">
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { update } from "../../../api/hmmm/subjects";
export default {
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: "60px",
      form: {
        subjectName: "",
        isFrontDisplay: 1,
      },
      value: true,
    };
  },

  created() {},

  methods: {},
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
  width: 70px !important;
}
.el-input {
  width: 90%;
  margin-left: 10px;
}
::v-deep .el-input__inner {
  height: 32px;
}
.el-switch {
  margin-left: 10px;
}
</style>
