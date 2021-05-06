<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" size="small">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option v-for="e in dictStatus" :key="e.value" :label="e.label" :value="e.value"/>
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

    <el-table v-loading="loading" :data="dataList" row-key="id" default-expand-all size="small" style="margin: 10px 0px"
              border stripe>
      <el-table-column prop="name" label="部门名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="gmtCreate"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <template v-if="scope.row.children.length === 0">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!--以下是弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="dialogData" ref="dialogForm" :rules="dialogFormRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <avue-input-tree default-expand-all v-model="dialogData.parentId"
                               placeholder="请选择上级部门" type="tree" :dic="dataList" :props="{label: 'name', value: 'id'}"
                               style="width: 100%">
              </avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="dialogData.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="dialogData.sort" controls-position="right" :min="0" :max="255"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="dialogData.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="dialogData.phone" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="dialogData.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="dialogData.status">
                <el-radio v-for="item in dictStatus" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
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
  import {buildTree} from '@/utils/james'

  const url = '/system/sys-dept'
  const getList = data => axios.get(url, {params: data})
  const getOne = id => axios.get(`${url}/${id}`)
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)
  const getDict = type => axios.get(`/system/dict/data/${type}`)

  export default {
    name: "Dept",
    data() {
      return {
        queryParams: {},
        dictStatus: [],

        loading: false,
        dataList: [],

        dialogTitle: undefined,
        dialogVisible: false,
        dialogData: {},
        dialogFormRules: {
          name: [
            {required: true, message: "部门名称不能为空", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      getDict('common_status').then(res => this.dictStatus = res.data.data)
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        getList(this.queryParams).then(resp => {
          this.dataList = buildTree(resp.data.data)
        }).finally(() => this.loading = false)
      },
      handleQuery() {
        this.getList()
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleAdd(row) {
        this.resetForm('dialogForm')
        this.dialogTitle = '添加部门'
        this.dialogData = {sort: 0, status: 'NORMAL'}
        if (row && row.id) {
          this.dialogData.parentId = row.id
        }
        this.dialogVisible = true
      },
      statusFormat(row) {
        for (const option of this.dictStatus) {
          if (option.value === row.status) {
            return option.label
          }
        }
      },
      handleUpdate(row) {
        this.resetForm('dialogForm')
        getOne(row.id).then(res => {
          this.dialogTitle = '修改部门'
          this.dialogData = res.data.data
          this.dialogVisible = true
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {type: 'warning', closeOnClickModal: false})
          .then(() => del(row.id))
          .then(res => {
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
      }
    }
  }
</script>

<style scoped>

</style>
