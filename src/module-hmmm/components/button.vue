<template>
  <div>
    <el-button class="clear" @click="clickClear" :disabled="disabled"
      >清除</el-button
    >
    <el-button type="primary" @click="clickSearch" :disabled="disabled"
      >搜索</el-button
    >
  </div>
</template>

<script>
export default {
  name: "MyButton",
  data() {
    return {};
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  created() {},

  methods: {
    clickClear() {
      this.$emit("clickClear");
    },
    clickSearch() {
      this.$emit("clickSearch");
    },
  },
};
</script>

<style scoped lang="less">
.clear {
  margin-left: 2px;
}
.el-button {
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 33px;
  margin-top: 2px;
}
</style>
