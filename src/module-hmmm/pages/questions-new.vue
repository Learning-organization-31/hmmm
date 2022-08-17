<template>
  <el-card>
    <div class="title">{{ queryId ? "试题修改" : "试题录入" }}</div>
    <el-form
      :model="body"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="学科：" prop="subjectID">
        <el-select
          v-model="body.subjectID"
          placeholder="请选择"
          style="width: 400px"
          @change="subjectChange"
        >
          <el-option
            v-for="item in subjectsList"
            :key="item.id"
            :value="item.id"
            :label="item.subjectName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="目录：" prop="catalogID">
        <el-select
          placeholder="请选择"
          style="width: 400px"
          v-model="body.catalogID"
        >
          <el-option
            v-for="item in simpleList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="企业：" prop="enterpriseID">
        <el-select
          placeholder="请选择"
          style="width: 400px"
          v-model="body.enterpriseID"
        >
          <el-option
            v-for="item in companysList"
            :key="item.id"
            :value="item.id"
            :label="item.company"
          ></el-option>
        </el-select>
      </el-form-item>

      <div calss="province">
        <el-form-item label="城市：" prop="province" :required="true">
          <el-select
            placeholder="请选择"
            style="width: 197px"
            v-model="body.province"
            @change="provinceChange"
          >
            <el-option
              v-for="item in provincesList"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>

          <el-form-item prop="city" style="display: inline-block">
            <el-select
              placeholder="请选择"
              style="width: 197px; margin-left: 6px"
              v-model="body.city"
            >
              <el-option
                v-for="item in citysList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
      </div>

      <el-form-item label="方向：" prop="direction">
        <el-select
          placeholder="请选择"
          style="width: 400px"
          v-model="body.direction"
        >
          <el-option
            v-for="item in direction"
            :key="item"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="题型: " :required="true">
        <el-radio-group v-model="body.questionType" @change="typeChange">
          <el-radio
            :label="item.value"
            v-for="item in questionType"
            :key="item.value"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="难度: " :required="true">
        <el-radio-group v-model="body.difficulty">
          <el-radio
            :label="item.value"
            v-for="item in difficulty"
            :key="item.value"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="题干: " prop="question">
        <quill-editor
          v-model="body.question"
          :options="editorOption"
          @blur="questionBlur"
        />
      </el-form-item>

      <el-form-item label="选择: " v-if="body.questionType !== 3">
        <!-- 单选框 -->
        <el-radio-group
          v-model="radioCheckout"
          @change="radioChange"
          v-if="body.questionType === 1"
          style="width: 100%"
        >
          <div
            v-for="(item, index) in body.options"
            :key="index"
            class="active"
          >
            <el-radio :label="item.code"> {{ item.code }}： </el-radio>
            <el-input
              style="width: 270px; padding: 0 15px; margin-left: -40px"
              v-model="item.title"
            />

            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="httpRequest"
              :show-file-list="false"
              @click.native="clickUpLoad(index, $event)"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="item.img" :src="item.img" class="avatar" />
              <p v-else>上传图片</p>
              <i
                class="el-icon-circle-close"
                @click="removeImg(index, $event)"
              ></i>
            </el-upload>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="addOptions"
            :disabled="body.questionType !== 2"
          >
            +增加选项与答案
          </el-button>
        </el-radio-group>

        <!-- 复选框 -->
        <el-checkbox-group
          v-model="checkList"
          @change="checkMax"
          v-if="body.questionType === 2"
        >
          <div
            v-for="(item, index) in body.options"
            :key="index"
            class="active"
            :class="index === 0 ? 'check' : 'check1'"
          >
            <el-checkbox :label="item.code"> {{ item.code }}： </el-checkbox>
            <el-input
              style="width: 270px; padding: 0 15px; margin-left: -10px"
              v-model="item.title"
            />

            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="httpRequest"
              :show-file-list="false"
              @click.native="clickUpLoad(index, $event)"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="item.img" :src="item.img" class="avatar" />
              <p v-else>上传图片</p>
              <i
                class="el-icon-circle-close"
                @click="removeImg(index, $event)"
              ></i>
            </el-upload>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="addOptions"
            :disabled="body.questionType !== 2"
          >
            +增加选项与答案
          </el-button>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="解析视频: ">
        <el-input style="width: 400px" v-model="body.videoURL"></el-input>
      </el-form-item>

      <el-form-item label="答案解析: " prop="answer">
        <quill-editor
          v-model="body.answer"
          :options="editorOption"
          @blur="answerBlur"
        />
      </el-form-item>

      <el-form-item label="题目备注: " prop="remarks">
        <el-input
          type="textarea"
          style="width: 400px"
          :rows="4"
          v-model="body.remarks"
        ></el-input>
      </el-form-item>

      <el-form-item label="试题标签: " prop="tags">
        <el-select
          placeholder="请选择"
          style="width: 400px"
          multiple
          v-model="body.tags"
        >
          <el-option
            v-for="item in tagsList"
            :key="item.id"
            :value="item.tagName"
            :label="item.tagName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fromSubmit" v-if="!queryId"
          >确认提交</el-button
        >
        <el-button type="success" @click="setFromSubmit" v-else
          >确认修改</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKIDb3IJ5f191g7KI2ZrujLjsmQr43nMhpjO",
  SecretKey: "VlmZ7RaU9dssmJchX8WgaFhGH2YqujId",
});
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  ["blockquote"], // 引用  代码块-----['blockquote', 'code-block']
  ["code-block", "image", "link"], // 链接、图片、视频-----['link', 'image', 'video']
];
import { list as getSubjectsList } from "@/api/hmmm/subjects";
import { list as getCompanysList } from "@/api/hmmm/companys";
import { simple } from "@/api/hmmm/directorys";
import { list as getTagsList } from "@/api/hmmm/tags";
import { provinces, citys } from "@/api/hmmm/citys";
import { direction, questionType, difficulty } from "@/api/hmmm/constants";
import { add, detail as getDetailInfo, update } from "@/api/hmmm/questions";

export default {
  name: "QuestionsNew",
  data() {
    return {
      imageUrl: "",
      checkList: [], //多选框选中框
      radioCheckout: "", //单选框选中状态
      difficulty, //难度列表
      questionType, //题型列表
      direction, //方向列表
      provincesList: provinces(), //一级城市列表
      citysList: [], //城市下地区列表
      subjectsList: [], //学科列表
      simpleList: [], //目录列表
      companysList: [], //企业列表
      tagsList: [], //标签列表
      body: {
        subjectID: "", //	学科
        catalogID: "", //	目录
        enterpriseID: "", //		企业
        province: "", //城市
        city: "", //地区
        direction: "", //方向
        questionType: 1, //题型
        difficulty: 1, //难度
        question: "", //题干
        options: [
          //选择
          {
            code: "A", //代码
            title: "", //标题
            img: "", //图片url
            isRight: false, //是否正确答案
          },
          {
            code: "B", //代码
            title: "", //标题
            img: "", //图片url
            isRight: false, //是否正确答案
          },
          {
            code: "C", //代码
            title: "", //标题
            img: "", //图片url
            isRight: false, //是否正确答案
          },
          {
            code: "D", //代码
            title: "", //标题
            img: "", //图片url
            isRight: false, //是否正确答案
          },
        ],
        videoURL: "", //解析视频
        answer: "", //答案解析
        remarks: "", //题目备注
        tags: [], //试题标签
      },
      html: "",
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: {
            container: toolbarOptions,
          },
        },
      },
      rules: {
        subjectID: [
          { required: true, message: "请选择学科", trigger: "change" },
        ],
        catalogID: [
          { required: true, message: "请选择目录", trigger: "change" },
        ],
        enterpriseID: [
          { required: true, message: "请选择企业", trigger: "change" },
        ],
        province: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change",
          },
        ],
        city: [
          {
            required: true,
            message: "请选择地区",
            trigger: "change",
          },
        ],
        direction: [
          { required: true, message: "请选择方向", trigger: "change" },
        ],
        question: [{ required: true, message: "请输入题干", trigger: "blur" }],
        answer: [
          { required: true, message: "请输入答案解析", trigger: "blur" },
        ],
        remarks: [
          { required: true, message: "请输入题目备注", trigger: "blur" },
        ],
        tags: [{ required: true, message: "请选择试题", trigger: "change" }],
      },
      imgIndex: "",
      index: "",
      queryId: "",
      imgFlag: true,
    };
  },

  created() {
    this.queryId = this.$route.query.id;
    if (this.queryId) {
      this.getDetailInfo();
    }
    //获取学科列表
    this.getSubjectsList();
    //获取企业列表
    this.getCompanysList();
  },

  methods: {
    //视频解析单独校验
    answerBlur() {
      this.$refs.ruleForm.validateField("answer");
    },

    //题干发生变化的时候单独校验题干
    questionBlur() {
      this.$refs.ruleForm.validateField("question");
    },

    //点击关闭小图标清除图片
    removeImg(index, e) {
      e.stopPropagation();
      this.body.options[index].img = "";
    },

    // 图片
    //自定义发送请求
    httpRequest({ file }) {
      cos.putObject(
        {
          Bucket: "bianling-1313341649" /* 必须 */,
          Region: "ap-shanghai" /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: "STANDARD",
          Body: file, // 上传文件对象
        },
        (err, data) => {
          if (err || data.statusCode !== 200) {
            this.imgFlag = true;
            return this.$message.error("上传失败");
          }
          this.body.options[this.index].img = "http://" + data.Location;
          this.imgFlag = true;
        }
      );
    },

    beforeAvatarUpload(file) {
      if (this.imgFlag) {
        this.imgFlag = false;
        this.index = this.imgIndex;
        const isJPG = ["image/jpeg", "image/png", "image/gif"].includes(
          file.type
        );

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传图片只能是 JPG,png,gif 格式!");
          this.imgFlag = true;
          return false;
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          this.imgFlag = true;
          return false;
        }
      } else {
        this.$message.error("当前有图片正在上传,请稍后重试");
        return false;
      }
    },
    //上传图片需要先点击,把index存好,方便后续渲染图片用
    clickUpLoad(index) {
      this.imgIndex = index;
    },

    //如果时修改页面发起请求获取修改数据
    async getDetailInfo() {
      const { data } = await getDetailInfo({ id: this.queryId });
      data.difficulty = Number(data.difficulty);
      data.questionType = Number(data.questionType);
      data.tags = data.tags.split(",");
      this.body = data;
      //下方用于判断正确答案
      if (this.body.questionType === 1) {
        // console.log("单选");
        this.radioCheckout = this.body.options.find((item) => {
          return item.isRight;
        })?.code;
      } else if (this.body.questionType === 2) {
        // console.log("多选");
        this.body.options.forEach((item) => {
          if (item.isRight) {
            this.checkList.push(item.code);
          }
        });
      }
      //回滚到顶部
      this.$nextTick(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      });
    },

    //复选框状态发生改变时
    checkMax(label) {
      this.body.options.forEach((item) => {
        item.isRight = false;
      });
      label.forEach((lab) => {
        this.body.options.find((item) => item.code === lab).isRight = true;
      });
    },

    //单选框发生发表时
    radioChange(label) {
      this.body.options.forEach((item) => {
        if (item.code === label) {
          item.isRight = true;
        } else {
          item.isRight = false;
        }
      });
    },

    //题型发生改变将选中情况清空
    typeChange() {
      this.body.options.forEach((item) => (item.isRight = false));
      this.checkList = [];
      this.radioCheckout = "";
    },

    //添加选项
    addOptions() {
      const num =
        this.body.options[this.body.options.length - 1].code.charCodeAt() + 1;
      this.body.options.push({
        code: String.fromCharCode(num), //代码
        title: "", //标题
        img: "", //图片url
        isRight: false, //是否正确答案
      });
    },

    //一级城市改变获取二级城市
    provinceChange(val) {
      this.body.city = "";
      this.citysList = citys(val);
    },

    //获取企业列表
    async getCompanysList() {
      const { data } = await getCompanysList({ pagesize: 999999 });
      this.companysList = data.items;
    },

    //点击学科发生改变时获取目录列表和标签列表并清空目录中已选项
    async subjectChange(id) {
      const { data } = await simple({ subjectID: id, pagesize: 999999 });
      this.tagsList = (
        await getTagsList({ subjectID: id, pagesize: 999999 })
      ).data.items;
      this.simpleList = data;
      this.body.catalogID = "";
      this.body.tags = [];
    },

    //获取学科列表
    async getSubjectsList() {
      this.subjectsList = (
        await getSubjectsList({ pagesize: 10000 })
      ).data.items;
    },

    //确认按钮
    async fromSubmit() {
      if (this.imgFlag) {
        try {
          await this.$refs.ruleForm.validate();
          //进行答案校验
          if (this.body.questionType === 1) {
            if (this.radioCheckout === "") {
              return this.$message.error("单选题未选择答案");
            }
          } else if (this.body.questionType === 2) {
            if (!this.checkList[1]) {
              return this.$message.error("多选题至少选择两个答案");
            }
          }
          const obj = { ...this.body };
          obj.difficulty = String(obj.difficulty);
          obj.questionType = String(obj.questionType);
          obj.tags = obj.tags.join(",");
          await add(obj);
          this.$message.success("添加成功");
          this.body = {
            subjectID: "", //	学科
            catalogID: "", //	目录
            enterpriseID: "", //		企业
            province: "", //城市
            city: "", //地区
            direction: "", //方向
            questionType: 1, //题型
            difficulty: 1, //难度
            question: "", //题干
            options: [
              //选择
              {
                code: "A", //代码
                title: "", //标题
                img: "", //图片url
                isRight: false, //是否正确答案
              },
              {
                code: "B", //代码
                title: "", //标题
                img: "", //图片url
                isRight: false, //是否正确答案
              },
              {
                code: "C", //代码
                title: "", //标题
                img: "", //图片url
                isRight: false, //是否正确答案
              },
              {
                code: "D", //代码
                title: "", //标题
                img: "", //图片url
                isRight: false, //是否正确答案
              },
            ],
            videoURL: "", //解析视频
            answer: "", //答案解析
            remarks: "", //题目备注
            tags: "", //试题标签
          };
          this.tagsList = [];
          this.radioCheckout = "";
          this.$refs.ruleForm.resetFields();
        } catch (error) {}
      } else {
        this.$message.error("有图片正在提交,暂时无法提交");
      }
    },

    //修改按钮
    async setFromSubmit() {
      if (this.imgFlag) {
        try {
          await this.$refs.ruleForm.validate();
          //进行答案校验
          if (this.body.questionType === 1) {
            if (this.radioCheckout === "") {
              return this.$message.error("单选题未选择答案");
            }
          } else if (this.body.questionType === 2) {
            if (!this.checkList[1]) {
              return this.$message.error("多选题至少选择两个答案");
            }
          }

          const obj = { ...this.body };
          obj.difficulty = String(obj.difficulty);
          obj.questionType = String(obj.questionType);
          obj.tags = obj.tags.join(",");
          await update(obj);
          this.$message.success("修改成功");
          this.$router.push("/questions/list");
        } catch (error) {}
      } else {
        this.$message.error("目前有图片正在提交,暂时无法修改");
      }
    },
  },

  computed: {},

  components: {},
};
</script>

<style lang="scss" scoped>
.title {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 18px;
  margin-bottom: 20px;
}
.active {
  display: flex;
  align-items: center;
  height: 80px;
}
::v-deep.check {
  .el-checkbox__label {
    margin-left: 3px;
    font-size: 14px;
  }
}

.el-radio {
  height: 36px;
  line-height: 36px;
}

::v-deep.check1 {
  .el-checkbox__label {
    margin-left: 4px;
    font-size: 14px;
  }
}

//图片上传区域样式
::v-deep .avatar-uploader .el-upload {
  display: inline-block;
  width: 100px;
  height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader {
  width: 100px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
  }
  p {
    margin: 0;
    height: 59px;
    line-height: 59px;
    font-size: 14px;
  }
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep .ql-editor {
  height: 200px;
}

.el-icon-circle-close {
  position: absolute;
  top: -9px;
  right: -9px;
  width: 18px;
  height: 18px;
  background: #fff;
  font-size: 18px;
  color: #999;
  cursor: pointer;
}

::v-deep .province .el-form-item {
  display: inline-block;
}
</style>
