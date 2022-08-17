<template>
  <el-dialog
    :title="titleFirst"
    :visible="visible"
    @close="onClose"
    width="800px"
  >
    <el-form
      :model="body"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      style="overflow: hidden"
    >
      <!-- 标题 -->
      <el-form-item label="文章标题: " prop="title">
        <el-input
          size="small"
          v-model="body.title"
          placeholder="请输入文章标签"
        ></el-input>
      </el-form-item>

      <!-- 文章内容 -->
      <el-form-item label="文章内容: " prop="articleBody">
        <quill-editor v-model="body.articleBody" :options="editorOption" />
      </el-form-item>

      <!-- 视频地址 -->
      <el-form-item label="视频地址: " prop="videoURL">
        <el-input
          size="small"
          v-model="body.videoURL"
          placeholder="请输入视频地址"
        ></el-input>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item
        style="margin-top: 20px; float: right; margin-bottom: unset"
      >
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="sureBtn">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  ['blockquote'], // 引用  代码块-----['blockquote', 'code-block']
  ['code-block', 'image', 'link'], // 链接、图片、视频-----['link', 'image', 'video']
]
import { update, add } from '@/api/hmmm/articles'
export default {
  name: 'articlesAdd',
  data() {
    return {
      html: '',
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      rules: {
        title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        articleBody: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
      },
    }
  },
  props: {
    body: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    titleFirst: {
      type: String,
      required: true,
    },
  },
  methods: {
    async sureBtn() {
      await this.$refs.ruleForm.validate()

      const data = {
        ...this.body,
      }
      if (this.body.id) {
        const res = await update(data)
        console.log(res)
        this.$parent.getInterviewListFirst()
        this.$message.success('数据更新成功')
      } else {
        const res = await add(data)
        console.log(res)
        this.$parent.searchFn()
        this.$message.success('数据添加成功')
      }
      this.$refs.ruleForm.resetFields()
      this.onClose()
    },
    onClose() {
      this.$emit('remove')
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped lang="less">
/deep/.el-form-item__label {
  padding-right: 20px;
}
/deep/.ql-snow {
  padding: 0 0 0 10px;
}
/deep/.ql-editor {
  height: 200px;
}
</style>
