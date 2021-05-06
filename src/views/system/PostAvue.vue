<template>
  <avue-crud ref="crud"
             :option="option"
             :page.sync="page"
             :table-loading="loading"
             @on-load="getList"
             @row-update="rowUpdate"
             @row-save="rowSave"
             @row-del="rowDel"
             @refresh-change="refreshChange"
             @search-reset="searchChange"
             @search-change="searchChange"
             v-model="form"
             :data="data">
  </avue-crud>
</template>

<script>
  import axios from '@/utils/axios'

  window.axios = axios
  const url = '/system/sys-post'
  const getList = data => axios.get(url, {params: data})
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)

  const option = (safe) => {
    console.log(safe) //vue的this对象
    return {
      index: true,
      align: 'center',
      headerAlign: 'center',
      border: true,
      stripe: true,
      column: [
        /*{label: "岗位编码", prop: "id"},*/
        {label: "岗位编码", prop: "code", search: true, rules: [{required: true, message: "请输入岗位编码", trigger: "blur"}]},
        {label: "岗位名称", prop: "name", search: true, rules: [{required: true, message: "请输入岗位名称", trigger: "blur"}]},
        {label: '排序', prop: 'sort', type: 'number', minRows: 0},
        {label: '状态', prop: 'status', search: true, type: 'select', dicUrl: `/system/dict/data/sys_post_status`},
        {label: '备注', prop: 'remark', type: 'textarea'},
        {label: '创建时间', prop: 'gmtCreate', type: 'datetime', addDisplay: false, editDisplay: false}
      ],
      dialogClickModal: false
    }
  }

  export default {
    name: "Post",
    data() {
      return {
        page: {},
        form: {},
        params: {},
        loading: false,
        data: [],
        option: option(this)
      }
    },
    created() {

    },
    computed: {
      userInfo() {
        return {
          name: sessionStorage.getItem('user')
        }
      }
    },
    methods: {
      getList() {
        this.loading = true;
        const data = Object.assign({
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize,
        }, this.params)
        this.data = [];
        getList(data).then(res => {
          const data = res.data.data
          this.loading = false
          this.page.total = data.total
          this.data = data.records
        })
      },
      rowSave(row, done, loading) {
        add(Object.assign({
          createUser: this.userInfo.name
        }, row)).then(() => {
          this.$message.success('新增成功')
          done();
          this.getList();
        }).catch(() => {
          loading()
        })
      },
      rowUpdate(row, index, done, loading) {
        update(Object.assign({
          updateUser: this.userInfo.name
        }, row)).then(() => {
          this.$message.success('修改成功')
          done()
          this.getList();
        }).catch(() => {
          loading()
        })
      },
      rowDel(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          return del(row.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.getList();
        })
      },
      searchChange(params, done) {
        if (done) done();
        this.params = params;
        this.page.currentPage = 1;
        this.getList();
        this.$message.success('搜索成功')
      },
      refreshChange() {
        this.getList();
        this.$message.success('刷新成功')
      }
    }
  }
</script>

<style scoped>

</style>
