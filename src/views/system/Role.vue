<template>
  <div>
    <el-form :inline="true" :model="queryParams" ref="queryForm" size="small">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>

      <el-form-item label="角色编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入角色编码" clearable
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
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
    </el-row>

    <el-table :data="dataList" v-loading="loading" row-key="id" size="small" border stripe style="margin: 10px 0px">
      <!--<el-table-column prop="id" label="岗位编号"></el-table-column>-->
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="code" label="角色编码"></el-table-column>
      <el-table-column prop="sort" label="角色排序"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleDataScope(scope.row)">数据权限
          </el-button>
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
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="dialogData.name" autocomplete="off" placeholder="请输入角色名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="dialogData.code" autocomplete="off" placeholder="请输入角色编码" maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色顺序" prop="sort">
              <el-input-number v-model="dialogData.sort" controls-position="right" :min="0" :max="255"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="dialogData.status">
                <el-radio v-for="e in dictStatus" :key="e.value" :label="e.value">{{e.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单权限" prop="menuIdList">
              <el-tree ref="treeMenu" :data="treeMenuList" :props="{label: 'name', children: 'children'}" show-checkbox
                       node-key="id" check-strictly default-expand-all @check-change="handleCheckChange"></el-tree>
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

    <!--以下是数据权限弹框-->
    <el-dialog :title="dialogTitle2" :visible.sync="dialogVisible2" :close-on-click-modal="false" width="600px">
      <el-form :model="dialogData2" ref="dialogForm2" :rules="dialogFormRules2"
               label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="dialogData2.name" autocomplete="off" placeholder="请输入角色名称" maxlength="50"
                        readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色编码" prop="code">
              <el-input v-model="dialogData2.code" autocomplete="off" placeholder="请输入角色编码" maxlength="64"
                        readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限范围" prop="dataScope">
              <el-select v-model="dialogData2.dataScope">
                <el-option v-for="item in dictDataScope" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="dialogData2.dataScope == 'CUSTOM'">
            <el-form-item label="数据权限" prop="menuIdList">
              <el-tree ref="treeDept" :data="treeDeptList" :props="{label: 'name', children: 'children'}" show-checkbox
                       node-key="id" check-strictly default-expand-all @check-change="handleCheckChange2"></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitForm2">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import axios from '@/utils/axios'
  import {buildTree} from '@/utils/james'

  const url = '/system/sys-role'
  const getList = data => axios.get(url, {params: data})
  const getOne = id => axios.get(`${url}/${id}`)
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)
  const getDict = type => axios.get(`/system/dict/data/${type}`)

  const getMenuList = data => axios.get('/system/sys-menu', {params: data})
  const getDeptList = data => axios.get('/system/sys-dept', {params: data})

  export default {
    name: "Role",
    data() {
      return {
        queryParams: {},
        dictStatus: [],
        dictDataScope: [],

        loading: false,
        dataList: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,

        dialogVisible: false,
        dialogTitle: undefined,
        dialogData: {},
        dialogFormRules: {
          name: [{required: true, message: "角色名称不能为空", trigger: "blur"}],
          code: [{required: true, message: "角色编码不能为空", trigger: "blur"}]
        },
        treeMenuList: [],


        dialogVisible2: false,
        dialogTitle2: undefined,
        dialogData2: {},
        dialogFormRules2: {
          dataScope: [{required: true, message: "数据权限不能为空", trigger: "blur"}]
        },
        treeDeptList: []
      }
    },
    created() {
      getDict('common_status').then(res => this.dictStatus = res.data.data)
      getDict('sys_role_data_scope').then(res => this.dictDataScope = res.data.data)
      getMenuList().then(res => this.treeMenuList = buildTree(res.data.data))
      getDeptList().then(res => this.treeDeptList = buildTree(res.data.data))
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
        this.dialogData = {sort: 0, status: 'NORMAL', menuIdList: []}
        this.$nextTick(() => this.$refs['treeMenu'].setCheckedKeys(this.dialogData.menuIdList))
        this.dialogTitle = '添加角色'
        this.dialogVisible = true
      },
      handleUpdate(row) {
        this.resetForm('dialogForm')
        getOne(row.id).then(res => {
          this.dialogData = res.data.data
          this.$nextTick(() => this.$refs['treeMenu'].setCheckedKeys(this.dialogData.menuIdList))
          this.dialogTitle = '修改角色'
          this.dialogVisible = true
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {type: 'warning', closeOnClickModal: false})
          .then(() => del(row.id))
          .then(() => {
            this.$message.success('删除成功!')
            this.getList()
          })
      },
      handleDataScope(row) {
        this.resetForm('dialogForm2')
        getOne(row.id).then(res => {
          this.dialogData2 = res.data.data
          this.$nextTick(() => this.$refs['treeDept'].setCheckedKeys(this.dialogData2.deptIdList))
          this.dialogTitle2 = '分配数据权限'
          this.dialogVisible2 = true
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
      handleCheckChange() {
        this.dialogData.menuIdList = this.$refs['treeMenu'].getCheckedKeys()
      },
      handleCheckChange2() {
        this.dialogData2.deptIdList = this.$refs['treeDept'].getCheckedKeys()
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
      submitForm2() {
        this.$refs['dialogForm2'].validate()
          .then(valid => axios.put(`${url}/${this.dialogData2.id}/data-scope`, this.dialogData2))
          .then(res => {
            this.$message.success('操作成功')
            this.dialogVisible2 = false
            this.resetForm('dialogForm2')
            this.getList()
          })
      },
      statusFormat(row) {
        for (const option of this.dictStatus) {
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
