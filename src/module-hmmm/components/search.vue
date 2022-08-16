<template>
  <div>
    <el-form label-width="80px" :inline="true">
      <el-form-item :label="leftTitle">
        <el-input ref="leftTitle" v-model="content"></el-input>
      </el-form-item>
      <el-form-item :label="rightTitle" v-if="rightTitle" class="status">
        <el-select v-model="state" placeholder="请选择" :clearable="true">
          <el-option
            :label="item.value"
            :value="item.state"
            v-for="item in typeStatus"
            :key="item.state"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <MyButton
          @clickSearch="clickSearch"
          @clickClear="clearSearch"
        ></MyButton>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import MyButton from "./button.vue";
export default {
  name: "Search",
  props: {
    leftTitle: {
      type: String,
    },
    rightTitle: {
      type: String,
    },
    typeList: {
      type: Array,
    },
  },
  components: {
    MyButton,
  },
  data() {
    return {
      content: "",
      state: "",
      typeStatus: [
        {
          value: "启用",
          state: 1,
        },
        {
          value: "禁用",
          state: 0,
        },
      ],
    };
  },

  created() {},

  methods: {
    //点击清除，输入框内容清空
    clearSearch() {
      this.content = "";
      this.state = "";
      this.$emit("SearchClear", this.content, this.state);
    },
    //点击搜索，获取内容
    clickSearch() {
      this.$emit("SearchContent", this.content, this.state);
    },
  },
};
</script>

<style scoped lang="less">
.el-input {
  width: 92%;
}
::v-deep .el-input__inner {
  height: 33px;
  line-height: 33px;
}
.status {
  ::v-deep .el-form-item__label {
    margin-left: -40px;
  }
  .el-form--inline .el-form-item {
    margin-right: 30px !important;
  }
}
</style>
