<template>
  <el-dialog
    @close="closeFn"
    @open="open"
    title="题目预览"
    :visible="dialogIsShow"
    width="900px"
  >
    <div v-if="id">
      <el-row>
        <el-col :span="6"
          >【题型】：{{ detailInfo.questionType | getQuestionType }}题</el-col
        >
        <el-col :span="6">【编号】：{{ detailInfo.id }}</el-col>
        <el-col :span="6"
          >【难度】：{{ detailInfo.difficulty | getDifficulty }}</el-col
        >
        <el-col :span="6">【标签】：{{ detailInfo.tags }}</el-col>
        <el-col :span="6">【学科】：{{ detailInfo.subjectName }}</el-col>
        <el-col :span="6">【目录】：{{ detailInfo.directoryName }}</el-col>
        <el-col :span="6">【方向】：{{ detailInfo.direction }}</el-col>
      </el-row>
      <hr />
      <div>【题干】：</div>
      <p class="text" v-html="detailInfo.question" />
      <!-- 1为单选题 -->
      <!-- 2为多选题 -->
      <div v-if="Number(detailInfo.questionType) !== 3">
        <div style="margin-bottom: 10px">
          {{
            Number(detailInfo.questionType) === 1
              ? "单选题 选项：（以下选中的选项为正确答案）"
              : "多选题 选项：（以下选中的选项为正确答案）"
          }}
        </div>
        <!-- 单选框区域 -->
        <template v-if="Number(detailInfo.questionType) === 1">
          <el-radio-group v-model="raidoNum" @change="radioChange">
            <div
              v-for="item in detailInfo.options"
              :key="item.id"
              style="height: 33px"
            >
              <el-radio :label="item.isRight">
                {{ item.title }}
              </el-radio>
            </div>
          </el-radio-group>
        </template>
        <!-- 多选框区域 -->
        <template v-if="Number(detailInfo.questionType) === 2">
          <el-checkbox-group v-model="checkboxNum" @change="checkBoxChange">
            <div
              v-for="item in detailInfo.options"
              :key="item.id"
              style="height: 33px"
            >
              <el-checkbox :label="item.code">{{ item.title }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </template>
      </div>
      <hr />
      <div class="answer">
        <div>【参考答案】：</div>
        <el-button type="danger" size="small" @click="videoIsShowFn">
          视频答案预览
        </el-button>
      </div>
      <div class="video" v-if="videoIsShow">
        <video
          :src="detailInfo.videoURL"
          controls="controls"
          autoplay
          muted="muted"
        ></video>
      </div>
      <hr />
      <div class="div">
        <span>【答案解析】：</span>
        <span v-html="detailInfo.answer"></span>
      </div>
      <hr />
      <div class="div">
        <span>【题目备注】：</span>
        <p>{{ detailInfo.remarks }}</p>
      </div>
    </div>
    <div class="closeBtn">
      <el-button type="primary" @click="closeFn">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { detail } from "@/api/hmmm/questions";
export default {
  name: "QuestionsDialog",
  data() {
    return {
      detailInfo: {},
      videoIsShow: false,
      raidoNum: 1,
      checkboxNum: [],
      arr: [], //用来留存进入时多选框的状态
    };
  },

  created() {},

  methods: {
    //判断页面是否需要弹出视频
    videoIsShowFn() {
      if (this.detailInfo.videoURL)
        return this.$message.info("该题目暂无视频答案");
      this.videoIsShow = true;
    },

    //打开弹窗触发,获取数据
    async open() {
      const { data } = await detail({ id: this.id });
      this.detailInfo = data;
      const arr = [];
      data.options.forEach((item) => {
        if (item.isRight) {
          arr.push(item.code);
        }
      });
      this.checkboxNum = arr;
      this.arr = arr;
    },

    //关闭弹窗触发
    closeFn() {
      this.$emit("update:dialogIsShow", false);
      this.videoIsShow = false;
      this.detailInfo = {};
      this.checkboxNum = [];
      this.arr = [];
    },

    //单选框发生变化
    radioChange() {
      this.raidoNum = 1;
    },

    //多选框发生变化
    checkBoxChange() {
      this.checkboxNum = this.arr;
    },
  },

  computed: {},

  props: {
    dialogIsShow: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  height: 36px;
  line-height: 36px;
}
.text {
  color: blue;
}
.answer {
  display: flex;
  align-items: center;
}
.closeBtn {
  display: flex;
  justify-content: end;
}
.div {
  display: flex;
  align-items: center;
}
.video {
  width: 400px;
  height: 300px;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
