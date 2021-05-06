<template>
  <div>
    <el-form :inline="true" :model="queryParams" ref="queryForm" size="small">
      <el-form-item label="归属部门" prop="deptId">
        <avue-input-tree default-expand-all v-model="queryParams.deptId" placeholder="请选择部门"
                         type="tree" :dic="treeDeptList" :props="{label: 'name', value: 'id'}"></avue-input-tree>
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="queryParams.name" clearable placeholder="请输入用户名称"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="queryParams.phoneNumber" clearable placeholder="请输入手机号码"
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="用户状态">
          <el-option v-for="item in dictStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
      <el-table-column prop="name" label="用户名称"></el-table-column>
      <el-table-column prop="nickname" label="用户昵称"></el-table-column>
      <el-table-column prop="deptId" label="部门" :formatter="deptFormat"></el-table-column>
      <el-table-column prop="phoneNumber" label="手机号码" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template v-slot="scope">
          <el-switch v-model="scope.row.status" active-value="NORMAL" inactive-value="DISABLED"
                     @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="160"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)">重置</el-button>
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
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="dialogData.nickname" autocomplete="off" placeholder="请输入用户昵称"
                        maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <avue-input-tree default-expand-all v-model="dialogData.deptId" placeholder="请选择归属部门"
                               type="tree" :dic="treeDeptList" :props="{label: 'name', value: 'id'}"></avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="dialogData.phoneNumber" autocomplete="off" placeholder="请输入手机号码"
                        maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="dialogData.email" autocomplete="off" placeholder="请输入邮箱" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="!dialogData.id">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="dialogData.name" autocomplete="off" placeholder="请输入用户名称" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="!dialogData.id">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="dialogData.password" autocomplete="off" placeholder="请输入用户密码"
                        maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogData.sex" clearable placeholder="请选择用户性别">
                <el-option v-for="item in dictSex" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="dialogData.status">
                <el-radio v-for="e in dictStatus" :key="e.value" :label="e.value">{{e.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="postIds">
              <el-select v-model="dialogData.postIdList" multiple placeholder="请选择">
                <el-option v-for="item in dictPost" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="postIds">
              <el-select v-model="dialogData.roleIdList" multiple clearable placeholder="请选择">
                <el-option v-for="item in dictRole" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="dialogData.remark" placeholder="请输入内容" maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>


    <!--以下是设置密码弹框-->
    <el-dialog :title="dialogTitle2" :visible.sync="dialogVisible2" :close-on-click-modal="false" width="600px">
      <el-form :model="dialogData2" ref="dialogForm2" :rules="dialogFormRules2" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="dialogData2.password" autocomplete="off" placeholder="请输入用户密码"
                        maxlength="100"></el-input>
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

  const url = '/system/sys-user'
  const getList = data => axios.get(url, {params: data})
  const getOne = id => axios.get(`${url}/${id}`)
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)
  const getDict = type => axios.get(`/system/dict/data/${type}`)
  const changeStatus = (id, status) => axios.put(`${url}/${id}/status`, null, {params: {status: status}})
  const changePassword = (id, password) => axios.put(`${url}/${id}/password`, null, {params: {password: password}})

  export default {
    name: "User",
    data() {
      return {
        //搜索表单
        queryParams: {},
        dictDept: [],
        dictStatus: [],
        dictSex: [{label: '男', value: 0}, {label: '女', value: 1}],
        dictPost: [],
        dictRole: [],
        //数据列表
        loading: false,
        dataList: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        //弹框
        dialogVisible: false,
        dialogTitle: undefined,
        dialogData: {},
        dialogFormRules: {
          nickname: [{required: true, message: "用户昵称不能为空", trigger: "blur"}],
          name: [{required: true, message: "用户名称不能为空", trigger: "blur"}],
          password: [{required: true, message: "用户密码不能为空", trigger: "blur"}]
        },

        dialogVisible2: false,
        dialogTitle2: undefined,
        dialogData2: {},
        dialogFormRules2: {
          password: [{required: true, message: "用户密码不能为空", trigger: "blur"}]
        }
      }
    },
    computed: {
      treeDeptList() {
        return buildTree(this.dictDept)
      }
    },
    created() {
      axios.get('/system/sys-dept').then(res => this.dictDept = res.data.data)
      getDict('common_status').then(res => this.dictStatus = res.data.data)
      axios.get('/system/sys-post', {params: {pageSize: 0x7fffffff}}).then(res => this.dictPost = res.data.data.records)
      axios.get('/system/sys-role', {params: {pageSize: 0x7fffffff}}).then(res => this.dictRole = res.data.data.records)
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
        this.resetForm('queryForm')
        this.handleQuery()
      },
      handleAdd() {
        this.resetForm('dialogForm')
        this.dialogData = {status: 'NORMAL', postIdList: [], roleIdList: []}
        this.dialogTitle = '添加用户'
        this.dialogVisible = true
      },
      handleStatusChange(row) {
        const action = row.status == 'NORMAL' ? '启用' : '停用'
        this.$confirm(`确认要${action}"${row.nickname}"用户吗?`, "警告", {type: "warning", closeOnClickModal: false})
          .then(() => changeStatus(row.id, row.status))
          .then(() => this.getList())
          .catch(() => row.status = row.status == 'NORMAL' ? 'DISABLED' : 'NORMAL')
      },
      handleUpdate(row) {
        this.resetForm('dialogForm')
        getOne(row.id).then(res => {
          this.dialogData = res.data.data
          this.dialogTitle = '修改用户'
          this.dialogVisible = true
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {type: 'warning', closeOnClickModal: false})
          .then(() => del(row.id))
          .then(() => {
            this.$message.success('删除成功!')
            this.getList()
          })
      },
      handleResetPwd(row) {
        this.dialogData2 = {id: row.id, password: undefined}
        this.dialogTitle2 = `请输入"${row.name}"的新密码`
        this.dialogVisible2 = true
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getList()
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
          .then(valid => changePassword(this.dialogData2.id, this.dialogData2.password))
          .then(res => {
            this.$message.success('操作成功')
            this.dialogVisible2 = false
            this.resetForm('dialogForm2')
            this.getList()
          })
      },
      deptFormat(row) {
        for (const item of this.dictDept) {
          if (item.id == row.deptId) {
            return item.name
          }
        }
      },
      statusFormat(row) {
        for (const item of this.dictStatus) {
          if (item.value == row.status) {
            return item.label
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
