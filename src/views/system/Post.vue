<template>
  <div>
    <el-form :inline="true" :model="queryParams" ref="queryForm" size="small">
      <el-form-item label="岗位编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入岗位编码" clearable
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="岗位名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入岗位名称" clearable
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
          <el-option v-for="e in statusOptions" :key="e.value" :label="e.label" :value="e.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain @click="handleAdd" icon="el-icon-plus" size="small">新增</el-button>
      </el-col>
      <!--<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table :data="dataList" v-loading="loading" row-key="id" size="small" border stripe style="margin: 10px 0px">
      <!--<el-table-column prop="id" label="岗位编号"></el-table-column>-->
      <el-table-column prop="code" label="岗位编码"></el-table-column>
      <el-table-column prop="name" label="岗位名称"></el-table-column>
      <el-table-column prop="sort" label="岗位排序"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="pageNum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background style="text-align: right">
    </el-pagination>

    <!--以下是弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="dialogData" ref="dialogForm" :rules="dialogFormRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="岗位名称" prop="name">
              <el-input v-model="dialogData.name" autocomplete="off" placeholder="请输入岗位名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位编码" prop="code">
              <el-input v-model="dialogData.code" autocomplete="off" placeholder="请输入岗位编码" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位顺序" prop="sort">
              <el-input-number v-model="dialogData.sort" controls-position="right" :min="0" :max="255"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位状态" prop="status">
              <el-radio-group v-model="dialogData.status">
                <el-radio v-for="e in statusOptions" :key="e.value" :label="e.value">{{e.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="dialogData.remark" :rows="3" placeholder="请输入内容"
                        maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from '@/utils/axios'

  const url = '/system/sys-post'
  const getList = data => axios.get(url, {params: data})
  const getOne = id => axios.get(`${url}/${id}`)
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)
  const getDict = type => axios.get(`/system/dict/data/${type}`)

  export default {
    name: "Post",
    data() {
      return {
        loading: false,
        queryParams: {},
        statusOptions: [],

        dataList: [],

        dialogVisible: false,
        dialogTitle: undefined,
        dialogData: {},
        dialogFormRules: {
          name: [{required: true, message: "岗位名称不能为空", trigger: "blur"}],
          code: [{required: true, message: "岗位编码不能为空", trigger: "blur"}]
        },

        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    },
    created() {
      getDict('common_status').then(res => this.statusOptions = res.data.data)
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        let params = Object.assign({}, this.queryParams, {pageNum: this.pageNum, pageSize: this.pageSize})
        getList(params)
          .then(value => {
            this.dataList = value.data.data.records
            this.pageNum = value.data.data.current
            this.pageSize = value.data.data.size
            this.total = value.data.data.total
          })
          .finally(() => this.loading = false)
      },
      handleQuery() {
        this.getList()
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleAdd() {
        this.resetForm('dialogForm')
        this.dialogData = {sort: 0, status: 'NORMAL'}
        this.dialogTitle = '添加岗位'
        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.resetForm('dialogForm')
        getOne(row.id).then(res => {
          this.dialogData = res.data.data
          this.dialogTitle = '修改岗位'
          this.dialogVisible = true
        })
        // update(row).then(_ => this.$message.success('操作成功'))
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {type: 'warning', closeOnClickModal: false})
          .then(() => del(row.id))
          .then(() => {
            this.$message.success('删除成功!')
            this.getList()
          })
      },
      submitForm() {
        this.$refs['dialogForm'].validate()
          .then(valid => this.dialogData.id ? update(this.dialogData) : add(this.dialogData))
          .then(res => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.resetForm('dialogForm')
            this.getList()
          })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getList()
      },
      statusFormat(row) {
        for (const option of this.statusOptions) {
          if (option.value === row.status) {
            return option.label
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
