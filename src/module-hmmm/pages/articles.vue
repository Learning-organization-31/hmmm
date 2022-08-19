<template>
  <div>
    <el-card shadow="never">
      <!-- form表单 -->
      <el-form ref="form" :model="form" label-width="80px" class="formDate">
        <el-form-item label="关键字" size="small">
          <el-input
            v-model="form.keyword"
            placeholder="根据文章标题搜索"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" size="small">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>

        <div class="sureBtn">
          <el-button size="small" @click="form = {}">清除</el-button>
          <el-button type="primary" size="small" @click="searchFn"
            >搜索</el-button
          >
        </div>

        <div class="addBtn">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="addShow"
            >新增技巧</el-button
          >
        </div>
      </el-form>

      <!-- 提示文本 -->
      <el-alert
        :title="`数据一共 ${InterviewList.counts} 条`"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 表格 -->
      <el-table
        :data="InterviewList.items"
        style="margin-top: 20px"
        fit
        v-loading="tableLoading"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          :index="indexMethod"
          width="90"
        >
        </el-table-column>
        <el-table-column label="文章标题" width="400">
          <template v-slot="{ row }">
            {{ row.title
            }}<a
              style="margin-left: 8px; color: #00f"
              class="el-icon-film"
              v-if="!!row.videoURL"
              @click="videoClick(row)"
            ></a>
          </template>
        </el-table-column>

        <el-table-column prop="visits" label="阅读数" align="center">
        </el-table-column>
        <el-table-column prop="username" label="录入人" align="center">
        </el-table-column>
        <el-table-column label="录入时间" align="center">
          <template v-slot="{ row }">
            {{ row.createTime | parseTimeByString }}
          </template>
        </el-table-column>

        <el-table-column
          prop="state"
          label="状态"
          align="center"
          :formatter="formatterState"
        >
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" class="aColor">
          <template v-slot="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="showPreviewFn(row)"
              >预览</el-link
            >
            <el-link
              @click="changeStateFn({ state: row.state, id: row.id })"
              type="primary"
              :underline="false"
              >{{ row.state === 0 ? '启用' : '禁用' }}</el-link
            >
            <el-link
              :underline="false"
              type="primary"
              :disabled="!!row.state"
              :class="{ aColor: !!row.state }"
              @click="editClick(row)"
              >修改</el-link
            >
            <el-link
              :underline="false"
              type="primary"
              :disabled="!!row.state"
              :class="{ aColor: !!row.state }"
              @click="removeFn({ id: row.id })"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 页脚 -->
      <div
        style="margin-top: 20px; display: flex; flex-direction: row-reverse"
        v-if="!(InterviewList.counts <= 10)"
      >
        <el-pagination
          background
          layout="prev, pager, next,sizes, jumper"
          :page-size="pagesize"
          :current-page="page"
          :total="InterviewList.counts"
          :page-sizes="[5, 10, 20, 50]"
          @current-change="currentChange"
          @size-change="sizeChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 预览内容 -->
    <ArticlesPreview
      :visible.sync="showPreview"
      :titleBody="titleBody"
      :header="header"
    >
      <div
        style="
          background: #f5f5f5;
          padding: 10px;
          border-top: 1px dashed rgb(159 139 139);
        "
        v-html="articleBody"
      />
    </ArticlesPreview>

    <!-- 添加修改 -->
    <ArticlesAdd
      :visible.sync="showArticles"
      :titleFirst="titleInfo"
      :body="body"
      @remove="body = {}"
    />

    <!-- 视频播放 -->
    <div class="video">
      <el-dialog :visible="showVideo" width="800px" @close="videoClose">
        <video
          v-if="
            /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/.test(
              videoUrl
            )
          "
          :src="videoUrl"
          autoplay
          muted="muted"
          style="
            width: 100%;
            margin-bottom: -10px;
            height: 100%;
            object-fit: fill;
          "
        ></video>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ArticlesAdd from '../components/articles-add'
import { changeState, remove } from '@/api/hmmm/articles'
import ArticlesPreview from '../components/articles-preview'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      form: {},
      tableLoading: false,
      page: 1,
      pagesize: 10,
      showPreview: false,
      articleBody: '',
      titleBody: '',
      header: {},
      showArticles: false,
      body: {},
      titleInfo: '',
      showVideo: false,
      videoUrl: 'https://v-cdn.zjol.com.cn/277004.mp4',
    }
  },
  components: {
    ArticlesPreview,
    ArticlesAdd,
  },
  created() {
    this.getInterviewListFirst()

    const h = this.$createElement
    this.$notify({
      title: '作业人',
      message: h(
        'b',
        {
          style: 'color: #5ee7df',
        },
        '肖 杰'
      ),
      type: 'success',
      duration: 3000,
    })
  },
  methods: {
    ...mapMutations('articles', ['setState']),
    ...mapActions('articles', ['getInterviewList']),

    formatterState(row, coLumn, cellValue, index) {
      return cellValue === 0 ? '已禁用' : '已启用'
    },
    indexMethod(index) {
      if (this.InterviewList.page == 1) return index + 1
      else return index + 1 + this.InterviewList.page * 10 - 10
    },

    async getInterviewListFirst() {
      this.tableLoading = true
      await this.getInterviewList({
        page: this.page,
        pagesize: this.pagesize,
        ...this.form,
      })
      this.tableLoading = false
    },
    searchFn() {
      this.page = 1
      this.getInterviewListFirst()
    },

    async currentChange(val) {
      this.page = val
      this.tableLoading = true
      await this.getInterviewList({
        page: this.page,
        pagesize: this.pagesize,
      })
      this.tableLoading = false
    },

    async sizeChange(val) {
      this.pagesize = val
      this.tableLoading = true
      await this.getInterviewList({
        page: this.page,
        pagesize: this.pagesize,
      })
      this.tableLoading = false
    },
    showPreviewFn(row) {
      this.showPreview = true
      this.articleBody = row.articleBody
      this.titleBody = row.title
      this.header.time = row.createTime
      this.header.name = row.username
      this.header.visits = row.visits
    },
    async changeStateFn(obj) {
      obj.state === 1 ? (obj.state = 0) : (obj.state = 1)
      this.setState(obj.id)
      const result = await changeState(obj)
      if (result) this.$message.success('操作成功')
      else this.$message.error('操作失败')
    },
    removeFn(obj) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await remove(obj)
          if (this.InterviewList.counts === 11) this.page = 1
          this.getInterviewListFirst()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {})
    },
    addShow() {
      this.titleInfo = '新增文章'
      this.showArticles = true
    },
    editClick(row) {
      this.titleInfo = '修改文章'
      this.body = row
      this.showArticles = true
    },
    videoClose() {
      this.showVideo = false
    },
    videoClick(row) {
      this.showVideo = true
      this.videoUrl = row.videoURL
    },
  },

  computed: {
    ...mapGetters(['InterviewList']),
  },
}
</script>

<style scoped lang="less">
.formDate {
  display: flex;
  flex-wrap: wrap;

  .el-form-item {
    width: 25%;
  }

  .sureBtn {
    margin-left: 40px;
  }
  .addBtn {
    flex: 1;

    button {
      float: right;
    }
  }
}

/deep/.el-link {
  padding: 0 6px;
}
.aColor {
  color: #c0c4cc !important;
}

.video {
  /deep/.el-dialog {
    background: unset;
    border-radius: unset;
    border: unset;
  }
  /deep/.el-dialog__body {
    padding: unset;
  }
  /deep/.el-dialog__header {
    padding: unset;
  }
  /deep/.el-dialog__headerbtn {
    font-size: 22px;
    transform: translate(-50%, -50%);
    top: -10%;
    left: 50%;
    background: rgba(0, 0, 0, 0.4);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 5px rgb(0 0 0 / 40%);
  }
}
</style>
