<template>
  <div>
    <el-dialog title="修改学科" :visible.sync="dialogVisible" width="20%">
      <el-form :model="form">
        <el-form-item
          label="学科名称"
          :label-width="formLabelWidth"
          prop="subjectName"
        >
          <el-input
            v-model="subjectInfo.subjectName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isFrontDisplay">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            :value="subjectInfo.isFrontDisplay === 1"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <template slot-scope="row"> -->
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFn">确 定</el-button>
        <!-- </template> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },

  created() {},

  methods: {},
};
</script>

<style scoped></style>
