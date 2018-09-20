<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-bottom:20px">
      <span style="margin-right:10px">账户名</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-left: 10px" class="filter-item"
                placeholder="账户名/姓名" v-model="listQuery.userName">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
    </div>

    <el-table
      ref='list'
      :key='tableKey'
      :data="list"
      v-loading="listLoading"
      element-loading-text="数据加载中，请稍后"
      border
      fit
      highlight-current-row
      select-on-indeterminate
      style="width: 100%">

      <el-table-column align="center" label="ID" min-width="40">
        <template scope="scope">
          <span class="link-type">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" min-width="120">
        <template scope="scope">
          <span class="link-type">{{scope.row.userName}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120" align="center" label="姓名" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120" align="center" label="用户类型" show-overflow-tooltip>
        <template scope="scope">
          <span :class="{'adminColor':scope.row.userType===0,'normalColor':scope.row.userType===1}">{{scope.row.userTypeDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="40">
        <template scope="scope">
          <el-button size="small" type="success" @click="authOperate(scope.row)"
                     :disabled="scope.row.userType===0?true:false">权限管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="权限编辑" :visible.sync="dialogFormVisible" center>
      <el-transfer
        style="text-align: left; display: inline-block"
        v-model="transferData"
        filterable
        :left-default-checked="[]"
        :right-default-checked="[]"
        :titles="['未分配', '已分配']"
        :button-texts="['', '']"
        :format="{
        noChecked:'${total}',
        hasChecked: '${checked}/${total}'
        }"
        @change="handleChange"
        :data="transferModel">
        <span slot-scope="{ option }">{{ option.label }}</span>
        <!--<el-button class="transfer-footer" slot="left-footer" size="small"></el-button>
        <el-button class="transfer-footer" slot="right-footer" size="small"></el-button>-->
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getToken} from '../../utils/auth' // 验权
  import {authOperate, getAuthList} from "../../api/auth";
  import {getGroupListAll} from "../../api/group";

  export default {
    name: 'list',
    props: {},
    data() {
      return {
        dialogFormVisible: false,
        userTypeCode: -1,
        userTypes: [{code: 0, msg: '超级管理员'}, {code: 1, msg: '普通用户'}],
        headers: {},
        form: {
          id: '', userName: '', realName: '', phone: 0, userType: '',
        },
        rules: {
          appName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          userType: [{required: true, message: '请选择用户类型', trigger: 'blur'}]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          userName: '',
          pageNo: 1,
          pageSize: 10
        },
        tableKey: 0,
        transferModel: [],
        transferData: [],
        groupIds: [],
        addParams: {
          userId: null,
          groupIds: []
        }
      }
    },
    created() {
      this.getGroupList()
    },
    mounted() {
      this.headers = {accessToken: getToken()}
      this.getList()
    },
    watch: {},
    methods: {
      getInitData() {
        const data = [];
        const groupList = this.groups
        groupList.forEach((group) => {
          data.push({
            key: group.id,
            label: group.title
          })
        })
        return data;
      },

      getList() {
        getAuthList(this.listQuery).then(res => {
          const {code, content: {list, total}} = res
          if (code === 200) {
            this.list = list
            this.total = total
            if (this.total === 0) {
              this.$message({
                message: '用户列表为空',
                type: 'warning'
              })
            }
          }
          this.listLoading = false
        })
      },
      getGroupList() {
        this.$forceUpdate();
        getGroupListAll().then(res => {
          const {code, content} = res
          if (code === 200) {
            this.groups = content
            //初始化数据transfer数据
            this.transferModel = this.getInitData()
          } else {
            this.$message(res.msg)
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      submitForm() {
        this.addParams.groupIds = this.transferData
        authOperate(this.addParams).then(res => {
          const {code} = res
          if (code === 200) {
            this.$message({
              message: "操作成功",
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getList()
            this.getGroupList()
          }
        }).catch(function (err) {
          this.$message(err.message)
        })
      },
      authOperate(row) {
        // 初始化被选中数据
        this.transferData = row.selectedGroupIds
        this.addParams.userId = row.id
        this.dialogFormVisible = true
      },
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      handleRefresh() {
        this.list = null
        this.total = null
        this.listQuery.pageNo = 1
        this.getList()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

  .app-container {
    padding: 20px;
  }

  .pagination-container {
    margin-top: 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .el-transfer-panel__list.is-filterable {
    height: 320px;
  }

  .el-transfer-panel {
    width: 220px;
    height: 360px;
  }

  .dialogModifyLessonManage {
    .el-dialog__header {
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0
    }
    .createPost-main-container {
      padding: 20px 0 !important;
    }
  }
</style>
