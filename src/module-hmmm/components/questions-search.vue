<template>
  <div>
    <div class="title">
      <span>说明：目前支持学科和关键字条件筛选</span>
      <el-button
        type="success"
        size="small"
        icon="el-icon-edit"
        @click="$router.push('/questions/new')"
        >新增试题
      </el-button>
    </div>
    <el-form ref="form" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学科">
            <el-select
              v-model="params.subjectID"
              placeholder="请选择"
              style="width: 100%"
              @change="subjectChange"
            >
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.subjectName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="二级目录">
            <el-select
              v-model="params.catalogID"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in catalogList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签">
            <el-select
              v-model="params.tags"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in tagsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字">
            <el-input
              placeholder="根据题干搜索"
              v-model="params.keyword"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="试题类型">
            <el-select
              v-model="params.questionType"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in questionType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="难度">
            <el-select
              v-model="params.difficulty"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in difficulty"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="方向">
            <el-select
              v-model="params.direction"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in direction"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人">
            <el-select
              v-model="params.creatorID"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="题目备注">
            <el-input placeholder="" v-model="params.remarks"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业简称">
            <el-input placeholder="" v-model="params.shortName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市">
            <el-select
              v-model="params.province"
              placeholder="请选择"
              style="width: 49%"
              @change="provincesChange"
            >
              <el-option
                v-for="item in provinces"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-select
              v-model="params.city"
              style="margin-left: 5px; width: 49%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in citys"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="twoBtn">
            <el-button size="small" @click="initParams">清除</el-button>
            <el-button type="primary" size="small" @click="searchFn"
              >搜索</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { questionType, difficulty, direction } from "@/api/hmmm/constants";
import { provinces, citys } from "@/api/hmmm/citys";
import { simple } from "@/api/hmmm/directorys";
import { simple as tagsSimple } from "@/api/hmmm/tags";
import { simple as userSimple } from "@/api/base/users";
export default {
  name: "QuestionsSearch",
  data() {
    return {
      questionType,
      difficulty,
      direction,
      provinces: provinces(),
      citys,
      catalogList: [], //目录列表
      tagsList: [], //标签列表
      userList: [],
      params: {
        subjectID: "", //学科id
        difficulty: "", //难度
        questionType: "", //试题类型
        tags: "", //标签名称
        province: "", //企业所在地省份
        city: "", //企业所在城市
        keyword: "", //关键字
        remarks: "", //	题目备注
        shortName: "", //企业简称
        direction: "", //方向
        creatorID: "", //录入人
        catalogID: "", //目录
      },
    };
  },

  created() {
    //获取录入人列表
    this.getUserSimple();
  },

  methods: {
    //通过第一级城市获取第二级城市
    provincesChange(val) {
      this.citys = citys(val);
    },

    //点击搜索触发
    searchFn() {
      this.$emit("search", this.params);
    },

    //通过点击学科获取二级目录和标签数据
    async subjectChange(id) {
      this.catalogList = (await simple({ subjectID: id })).data;
      this.tagsList = (await tagsSimple({ subjectID: id })).data;
    },

    //获取录入人列表
    async getUserSimple() {
      this.userList = (await userSimple()).data;
    },

    //点击清除将数据清空
    initParams() {
      for (let key in this.params) {
        this.params[key] = "";
      }
    },
  },

  props: {
    list: {
      type: Array,
    },
  },

  computed: {},
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 12px;
    color: pink;
  }
}

.el-form {
  margin-top: 16px;
}

.twoBtn {
  display: flex;
  justify-content: end;
}
</style>
