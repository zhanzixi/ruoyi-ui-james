<template>
  <div>
    <el-form :inline="true" :model="queryParams" ref="queryForm" size="small">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入菜单名称" clearable
                  @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>
          <el-option v-for="item in dictStatus" :key="item.value" :label="item.label" :value="item.value"/>
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

    <el-table :data="dataList" v-loading="loading" row-key="id" default-expand-all size="small" border stripe
              style="margin: 10px 0px">
      <el-table-column prop="name" label="菜单名称"></el-table-column>
      <el-table-column prop="icon" label="图标" width="60" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.icon" style="font-size: 18px"></i>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识"></el-table-column>
      <el-table-column prop="path" label="路由地址"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="60"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="140"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--以下是弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px">
      <el-form :model="dialogData" ref="dialogForm" :rules="dialogFormRules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="nickname">
              <avue-input-tree default-expand-all v-model="dialogData.parentId" placeholder="请选择归属部门"
                               type="tree" :dic="dataList" :props="{label: 'name', value: 'id'}"></avue-input-tree>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="dialogData.type">
                <el-radio v-for="e in dictType" :key="e.value" :label="e.value">{{e.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <avue-input-icon v-model="dialogData.icon" placeholder="请选择图标" :icon-list="iconList"></avue-input-icon>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="dialogData.name" autocomplete="off" placeholder="请输入菜单名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="dialogData.sort" controls-position="right" :min="0" :max="255"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否外链" prop="isFrame">
              <el-radio-group v-model="dialogData.isFrame">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="dialogData.path" autocomplete="off" placeholder="请输入路由地址" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示状态" prop="visible">
              <el-radio-group v-model="dialogData.visible">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="dialogData.status">
                <el-radio v-for="e in dictStatus" :key="e.value" :label="e.value">{{e.label}}</el-radio>
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

  const url = '/system/sys-menu'
  const getList = data => axios.get(url, {params: data})
  const getOne = id => axios.get(`${url}/${id}`)
  const del = id => axios.delete(`${url}/${id}`)
  const add = data => axios.post(url, data)
  const update = data => axios.put(url, data)
  const getDict = type => axios.get(`/system/dict/data/${type}`)

  export default {
    name: "Menu",
    data() {
      return {
        //搜索表单
        queryParams: {},
        dictStatus: [],
        dictType: [],
        iconList: [{
          label: 'Element 图标',
          list: ['el-icon-platform-eleme', 'el-icon-eleme', 'el-icon-delete-solid', 'el-icon-delete', 'el-icon-s-tools', 'el-icon-setting', 'el-icon-user-solid', 'el-icon-user', 'el-icon-phone', 'el-icon-phone-outline', 'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on', 'el-icon-star-off', 'el-icon-s-goods', 'el-icon-goods', 'el-icon-warning', 'el-icon-warning-outline', 'el-icon-question', 'el-icon-info', 'el-icon-remove', 'el-icon-circle-plus', 'el-icon-success', 'el-icon-error', 'el-icon-zoom-in', 'el-icon-zoom-out', 'el-icon-remove-outline', 'el-icon-circle-plus-outline', 'el-icon-circle-check', 'el-icon-circle-close', 'el-icon-s-help', 'el-icon-help', 'el-icon-minus', 'el-icon-plus', 'el-icon-check', 'el-icon-close', 'el-icon-picture', 'el-icon-picture-outline', 'el-icon-picture-outline-round', 'el-icon-upload', 'el-icon-upload2', 'el-icon-download', 'el-icon-camera-solid', 'el-icon-camera', 'el-icon-video-camera-solid', 'el-icon-video-camera', 'el-icon-message-solid', 'el-icon-bell', 'el-icon-s-cooperation', 'el-icon-s-order', 'el-icon-s-platform', 'el-icon-s-fold', 'el-icon-s-unfold', 'el-icon-s-operation', 'el-icon-s-promotion', 'el-icon-s-home', 'el-icon-s-release', 'el-icon-s-ticket', 'el-icon-s-management', 'el-icon-s-open', 'el-icon-s-shop', 'el-icon-s-marketing', 'el-icon-s-flag', 'el-icon-s-comment', 'el-icon-s-finance', 'el-icon-s-claim', 'el-icon-s-custom', 'el-icon-s-opportunity', 'el-icon-s-data', 'el-icon-s-check', 'el-icon-s-grid', 'el-icon-menu', 'el-icon-share', 'el-icon-d-caret', 'el-icon-caret-left', 'el-icon-caret-right', 'el-icon-caret-bottom', 'el-icon-caret-top', 'el-icon-bottom-left', 'el-icon-bottom-right', 'el-icon-back', 'el-icon-right', 'el-icon-bottom', 'el-icon-top', 'el-icon-top-left', 'el-icon-top-right', 'el-icon-arrow-left', 'el-icon-arrow-right', 'el-icon-arrow-down', 'el-icon-arrow-up', 'el-icon-d-arrow-left', 'el-icon-d-arrow-right', 'el-icon-video-pause', 'el-icon-video-play', 'el-icon-refresh', 'el-icon-refresh-right', 'el-icon-refresh-left', 'el-icon-finished', 'el-icon-sort', 'el-icon-sort-up', 'el-icon-sort-down', 'el-icon-rank', 'el-icon-loading', 'el-icon-view', 'el-icon-c-scale-to-original', 'el-icon-date', 'el-icon-edit', 'el-icon-edit-outline', 'el-icon-folder', 'el-icon-folder-opened', 'el-icon-folder-add', 'el-icon-folder-remove', 'el-icon-folder-delete', 'el-icon-folder-checked', 'el-icon-tickets', 'el-icon-document-remove', 'el-icon-document-delete', 'el-icon-document-copy', 'el-icon-document-checked', 'el-icon-document', 'el-icon-document-add', 'el-icon-printer', 'el-icon-paperclip', 'el-icon-takeaway-box', 'el-icon-search', 'el-icon-monitor', 'el-icon-attract', 'el-icon-mobile', 'el-icon-scissors', 'el-icon-umbrella', 'el-icon-headset', 'el-icon-brush', 'el-icon-mouse', 'el-icon-coordinate', 'el-icon-magic-stick', 'el-icon-reading', 'el-icon-data-line', 'el-icon-data-board', 'el-icon-pie-chart', 'el-icon-data-analysis', 'el-icon-collection-tag', 'el-icon-film', 'el-icon-suitcase', 'el-icon-suitcase-1', 'el-icon-receiving', 'el-icon-collection', 'el-icon-files', 'el-icon-notebook-1', 'el-icon-notebook-2', 'el-icon-toilet-paper', 'el-icon-office-building', 'el-icon-school', 'el-icon-table-lamp', 'el-icon-house', 'el-icon-no-smoking', 'el-icon-smoking', 'el-icon-shopping-cart-full', 'el-icon-shopping-cart-1', 'el-icon-shopping-cart-2', 'el-icon-shopping-bag-1', 'el-icon-shopping-bag-2', 'el-icon-sold-out', 'el-icon-sell', 'el-icon-present', 'el-icon-box', 'el-icon-bank-card', 'el-icon-money', 'el-icon-coin', 'el-icon-wallet', 'el-icon-discount', 'el-icon-price-tag', 'el-icon-news', 'el-icon-guide', 'el-icon-male', 'el-icon-female', 'el-icon-thumb', 'el-icon-cpu', 'el-icon-link', 'el-icon-connection', 'el-icon-open', 'el-icon-turn-off', 'el-icon-set-up', 'el-icon-chat-round', 'el-icon-chat-line-round', 'el-icon-chat-square', 'el-icon-chat-dot-round', 'el-icon-chat-dot-square', 'el-icon-chat-line-square', 'el-icon-message', 'el-icon-postcard', 'el-icon-position', 'el-icon-turn-off-microphone', 'el-icon-microphone', 'el-icon-close-notification', 'el-icon-bangzhu', 'el-icon-time', 'el-icon-odometer', 'el-icon-crop', 'el-icon-aim', 'el-icon-switch-button', 'el-icon-full-screen', 'el-icon-copy-document', 'el-icon-mic', 'el-icon-stopwatch', 'el-icon-medal-1', 'el-icon-medal', 'el-icon-trophy', 'el-icon-trophy-1', 'el-icon-first-aid-kit', 'el-icon-discover', 'el-icon-place', 'el-icon-location', 'el-icon-location-outline', 'el-icon-location-information', 'el-icon-add-location', 'el-icon-delete-location', 'el-icon-map-location', 'el-icon-alarm-clock', 'el-icon-timer', 'el-icon-watch-1', 'el-icon-watch', 'el-icon-lock', 'el-icon-unlock', 'el-icon-key', 'el-icon-service', 'el-icon-mobile-phone', 'el-icon-bicycle', 'el-icon-truck', 'el-icon-ship', 'el-icon-basketball', 'el-icon-football', 'el-icon-soccer', 'el-icon-baseball', 'el-icon-wind-power', 'el-icon-light-rain', 'el-icon-lightning', 'el-icon-heavy-rain', 'el-icon-sunrise', 'el-icon-sunrise-1', 'el-icon-sunset', 'el-icon-sunny', 'el-icon-cloudy', 'el-icon-partly-cloudy', 'el-icon-cloudy-and-sunny', 'el-icon-moon', 'el-icon-moon-night', 'el-icon-dish', 'el-icon-dish-1', 'el-icon-food', 'el-icon-chicken', 'el-icon-fork-spoon', 'el-icon-knife-fork', 'el-icon-burger', 'el-icon-tableware', 'el-icon-sugar', 'el-icon-dessert', 'el-icon-ice-cream', 'el-icon-hot-water', 'el-icon-water-cup', 'el-icon-coffee-cup', 'el-icon-cold-drink', 'el-icon-goblet', 'el-icon-goblet-full', 'el-icon-goblet-square', 'el-icon-goblet-square-full', 'el-icon-refrigerator', 'el-icon-grape', 'el-icon-watermelon', 'el-icon-cherry', 'el-icon-apple', 'el-icon-pear', 'el-icon-orange', 'el-icon-coffee', 'el-icon-ice-tea', 'el-icon-ice-drink', 'el-icon-milk-tea', 'el-icon-potato-strips', 'el-icon-lollipop', 'el-icon-ice-cream-square', 'el-icon-ice-cream-round']
        }],
        //数据列表
        loading: false,
        dataList: [],
        //弹框
        dialogVisible: false,
        dialogTitle: undefined,
        dialogData: {},
        dialogFormRules: {
          name: [{required: true, message: "菜单名称不能为空", trigger: "blur"}],
          type: [{required: true, message: "菜单类型不能为空", trigger: "blur"}],
          path: [{required: true, message: "路由地址不能为空", trigger: "blur"}]
        }
      }
    },
    created() {
      getDict('common_status').then(res => this.dictStatus = res.data.data)
      getDict('sys_menu_type').then(res => this.dictType = res.data.data)
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        getList(this.queryParams)
          .then(res => this.dataList = buildTree(res.data.data))
          .finally(() => this.loading = false)
      },
      handleQuery() {
        this.getList()
      },
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      handleAdd(row) {
        this.resetForm('dialogForm')
        this.dialogTitle = '添加菜单'
        this.dialogData = {type: 'MENU', isFrame: 0, visible: 1, status: 'NORMAL', sort: 0}
        if (row && row.id) {
          this.dialogData.parentId = row.id
        }
        this.dialogVisible = true
      },
      statusFormat(row) {
        for (const item of this.dictStatus) {
          if (item.value == row.status) {
            return item.label
          }
        }
      },
      handleUpdate(row) {
        this.resetForm('dialogForm')
        getOne(row.id).then(res => {
          this.dialogTitle = '修改菜单'
          this.dialogData = res.data.data
          this.dialogVisible = true
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {type: 'warning', closeOnClickModal: false})
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
      }
    }
  }
</script>

<style scoped>

</style>
