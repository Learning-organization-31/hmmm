<template>
  <div>
    <el-card shadow="never">
      <!-- form表单 -->
      <el-form ref="form" :model="form" label-width="80px" class="formDate">
        <el-form-item label="标签名称" size="small">
          <el-input
            v-model="form.tags"
            placeholder="请输入"
            @keydown.enter.native="searchList"
          ></el-input>
        </el-form-item>
        <el-form-item label="城市" size="small">
          <el-select
            v-model="form.province"
            @keyup.enter="handleFilter"
            @change="handleProvince"
            filterable
          >
            <el-option
              v-for="item in citySelect.province"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" size="small">
          <el-select v-model="form.city" @keyup.enter="handleFilter" filterable>
            <el-option
              v-for="item in citySelect.cityDate"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业简称" size="small">
          <el-input
            v-model="form.shortName"
            @keydown.enter.native="searchList"
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
          <el-button type="primary" size="small" @click="searchList"
            >搜索</el-button
          >
        </div>
        <div class="addBtn">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="onServe"
            >新增用户</el-button
          >
        </div>
      </el-form>

      <!-- 提示文本 -->
      <el-alert
        :title="`共 ${companysList.counts} 条记录`"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 表格 -->
      <el-table
        :data="companysList.items"
        style="margin-top: 20px"
        fit
        v-loading="tableLoading"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          :index="indexMethod"
        >
        </el-table-column>
        <el-table-column prop="number" label="企业编号" align="center">
        </el-table-column>
        <el-table-column prop="shortName" label="企业简称  " align="center">
        </el-table-column>
        <el-table-column prop="tags" label="标签" align="center">
        </el-table-column>
        <el-table-column prop="creatorID" label="创建者" align="center">
        </el-table-column>
        <el-table-column label="创建日期" align="center">
          <template v-slot="{ row }">
            {{ row.addDate | parseTimeByString }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          align="center"
          :formatter="formatterState"
        >
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              @click="edit(row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-button
                type="warning"
                icon="el-icon-close"
                circle
                plain
                v-if="row.state == 0"
                @click="state(row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top">
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                plain
                v-if="row.state == 1"
                @click="state(row)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="deleteNext(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页脚 -->
      <div style="margin-top: 20px; display: flex; flex-direction: row-reverse">
        <el-pagination
          background
          layout="prev, pager, next,sizes, jumper"
          :page-size="pagesize"
          :current-page="page"
          :total="companysList.counts"
          :page-sizes="[10, 20, 30, 50]"
          @current-change="currentChange"
          @size-change="sizeChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <!--增加弹窗 -->
    <CompanysAdd
      ref="companysAdd"
      :titleInfo="titleInfo"
      :formBase="companysListEdit"
      @newDataes="emitRequest"
    ></CompanysAdd>
  </div>
</template>

<script>
import { disabled, remove } from '@/api/hmmm/companys.js'
import { provinces, citys } from '@/api/hmmm/citys.js'
import { mapActions, mapGetters } from 'vuex'
import CompanysAdd from '../components/companys-add.vue'
import baseApi from '@/api/base/baseApi'
export default {
  name: 'company',
  data() {
    return {
      citySelect: {
        province: [],
        cityDate: [],
      },
      form: {},
      tableLoading: false,
      page: 1,
      pagesize: 10,
      titleInfo: {
        text: '',
        pageTitle: '',
      },
    }
  },
  components: {
    CompanysAdd,
  },

  created() {
    this.getCompanysListInit()
    this.getCityData()
  },

  methods: {
    ...mapActions('companys', ['getCompanysList', 'editCompanysList']),
    onClose() {
      this.$refs.companysAdd.dialogFormH()
    },
    onServe() {
      this.titleInfo = {}
      this.titleInfo.text = '创建用户'
      this.$refs.companysAdd.dialogFormV()
    },
    formatterState(row, coLumn, cellValue, index) {
      const findItem = baseApi.status.find((item) => item.id == cellValue)
      return findItem ? findItem.value : '未知'
    },
    searchList() {
      this.page = 1
      this.getCompanysListInit()
    },

    async getCompanysListInit() {
      this.tableLoading = true
      await this.getCompanysList({
        page: this.page,
        pagesize: this.pagesize,
        ...this.form,
      })
      this.tableLoading = false
    },
    currentChange(val) {
      this.page = val
      this.getCompanysListInit()
    },
    sizeChange(val) {
      this.pagesize = val
      this.getCompanysListInit()
    },
    // 获取省
    getCityData: function () {
      this.citySelect.province = provinces()
    },
    handleProvince(e) {
      this.citySelect.cityDate = citys(e)
      this.form.city = this.citySelect.cityDate[0]
    },
    edit(id) {
      this.titleInfo = {}
      this.editCompanysList({ id: id })
      this.titleInfo.pageTitle = '编辑用户'
      this.$refs.companysAdd.dialogFormV()
    },
    indexMethod(index) {
      if (this.companysList.page == 1) return index + 1
      else return index + 1 + this.companysList.page * 10 - 10
    },
    emitRequest(data) {
      console.log(data, this.companysListEdit)
    },
    state(row) {
      this.$confirm('此操作将改变其状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        roundButton: false,
      })
        .then(async () => {
          if (row.state == 1) row.state = 0
          else row.state = 1
          await disabled({ id: row.id, state: row.state })
          this.$message({
            type: 'success',
            message: '改变成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
    async deleteNext(id) {
      this.$confirm('此操作将永久删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        roundButton: false,
      })
        .then(async () => {
          await remove({ id: id })
          this.page = 1
          this.searchList()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.searchList()
          this.$message({
            type: 'info',
            message: '已取消',
          })
        })
    },
  },
  computed: {
    ...mapGetters(['companysList', 'companysListEdit']),
  },
}
</script>

<style scoped lang="less">
.formDate {
  display: flex;
  // justify-content: space-evenly;
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
</style>
