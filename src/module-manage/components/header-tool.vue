<template>
  <el-row type="flex" justify="space-between">
    <el-col v-if="SearchIsShow">
      <el-input
        size="small"
        style="width: 200px; margin-right: 15px"
        v-model="input"
        placeholder="根据用户名搜索"
      />
      <el-button size="small" @click="remove">清空</el-button>
      <el-button size="small" type="primary" @click="search">搜索</el-button>
    </el-col>
    <el-col>
      <el-row type="flex" justify="end">
        <el-button
          size="small"
          icon="el-icon-edit"
          type="success"
          @click="rightBtn"
        >
          {{ buttonText }}
        </el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "headerTool",
  props: {
    SearchIsShow: {
      type: Boolean,
      default: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    // 点击搜索
    search() {
      this.$emit("OnSearch", this.input);
    },
    // 点击清空
    remove() {
      this.input = "";
      this.$emit("Onremove");
    },
    // 点击右边按钮
    rightBtn() {
      this.$emit("rightBtn");
    },
  },
};
</script>

<style></style>
