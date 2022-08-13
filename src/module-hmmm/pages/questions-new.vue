<template>
  <el-card>
    <div class="title">试题录入</div>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="学科：">
        <el-select placeholder="请选择" style="width: 400px">
          <!-- <el-option></el-option> -->
        </el-select>
      </el-form-item>

      <el-form-item label="目录：">
        <el-select placeholder="请选择" style="width: 400px"> </el-select>
      </el-form-item>

      <el-form-item label="企业：">
        <el-select placeholder="请选择" style="width: 400px"> </el-select>
      </el-form-item>

      <el-form-item label="城市：">
        <el-select placeholder="请选择" style="width: 197px"> </el-select>
        <el-select placeholder="请选择" style="width: 197px; margin-left: 6px">
        </el-select>
      </el-form-item>
      <el-form-item label="方向：">
        <el-select placeholder="请选择" style="width: 400px"> </el-select>
      </el-form-item>

      <el-form-item label="题型: ">
        <el-radio-group>
          <el-radio :label="3">单选</el-radio>
          <el-radio :label="6">多选</el-radio>
          <el-radio :label="9">简答</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="难度: ">
        <el-radio-group>
          <el-radio :label="3">简单</el-radio>
          <el-radio :label="6">一般</el-radio>
          <el-radio :label="9">困难</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题干: "> </el-form-item>

      <el-form-item label="解析视频: ">
        <el-input style="width: 400px"></el-input>
      </el-form-item>

      <el-form-item label="答案解析: ">11 </el-form-item>

      <el-form-item label="题目备注: ">
        <el-input type="textarea" style="width: 400px" :rows="4"></el-input>
      </el-form-item>

      <el-form-item label="试题标签: ">
        <el-select placeholder="请选择" style="width: 400px"> </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">确认提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "QuestionsNew",
  data() {
    return {};
  },

  created() {},

  methods: {},

  computed: {},
};
</script>

<style lang="scss" scoped>
.title {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 18px;
  margin-bottom: 20px;
}
</style>
