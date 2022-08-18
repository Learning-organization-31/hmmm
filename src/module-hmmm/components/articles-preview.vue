<template>
  <el-dialog title="预览文章" :visible="visible" @close="onClose" width="800px">
    <h2 style="margin-top: -6px">{{ titleBody }}</h2>
    <div style="margin: -10px 0 10px">
      &nbsp;&nbsp; {{ header.time | parseTimeByString }}&nbsp;&nbsp;{{
        header.name
      }}&nbsp;&nbsp;<i class="el-icon-view" /> &nbsp;&nbsp;{{ header.visits }}
    </div>
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    titleBody: {
      type: String,
      default: '',
    },
    header: {
      type: Object,
      default: {},
    },
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped lang="less"></style>
