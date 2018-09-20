<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container" style="margin-bottom:20px">
      <span style="margin-right:10px">AppName</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-left: 10px" class="filter-item"
                placeholder="AppName" v-model="listQuery.appName">
      </el-input>
      <span style="margin-right:10px">名称</span>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-left: 10px" class="filter-item"
                placeholder="名称" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search"
                 @click="handleFilter">搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="executorCreate"
                 :type="pageBoolean.addColor" icon="el-icon-plus">{{ pageBoolean.addText }}
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

      <el-table-column align="center" label="ID" min-width="30">
        <template scope="scope">
          <span class="link-type">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="AppName" min-width="100">
        <template scope="scope">
          <span class="link-type">{{scope.row.appName}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100" align="center" label="名称" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序" min-width="40">
        <template scope="scope">
          <span class="link-type">{{scope.row.order}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="60" align="center" label="注册方式" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.addressTypeDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120" align="center" label="OnLine机器地址" show-overflow-tooltip>
        <template scope="scope">
          <span style="color: seagreen" v-html="formatAddressList(scope.row.addressList)"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="80">
        <template scope="scope">
          <el-button size="small" type="primary" @click="executorModify(scope.row)">编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="warnBeforeDelete(scope.$index, scope.row)">删除
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

    <el-dialog :title="dialogStatus=='create' ? '新增执行器' : '编辑执行器'" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="AppName" label-width="80px" prop="appName">
          <el-input v-model="form.appName" auto-complete="off" maxlength="180"
                    placeholder="请输入AppName"></el-input>
        </el-form-item>
        <el-form-item label="名称" label-width="80px" prop="title">
          <el-input v-model="form.title" auto-complete="off" maxlength="180"
                    placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="80px" prop="order">
          <!--<el-input v-model="form.order" auto-complete="off" maxlength="180"
                    placeholder="请输入排列顺序"></el-input>-->
          <el-input-number v-model="form.order" :min="1" placeholder="请输入排列顺序"></el-input-number>
        </el-form-item>

        <el-form-item label="注册方式" prop="addressType">
          <el-select v-model="form.addressType" placeholder="请选择">
            <el-option v-for="item of addressTypeEnum"
                       :key="item.code"
                       :label="item.msg"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地址列表" label-width="80px" prop="addressList">
          <el-input v-model="form.addressList" auto-complete="off" maxlength="180" type="textarea"
                    placeholder="请输入执行器地址，多个地址用逗号分隔"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="addForm">确 定</el-button>
        <el-button v-else type="primary" @click="updateForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth' // 验权
  import {create, getGroupList, remove, update} from "../../api/group";

  export default {
    name: 'list',
    props: {},
    components: {},
    data() {
      return {
        addressTypeEnum: [{code: 0, msg: '自动注册'}, {code: 1, msg: "手动输入"}],
        dialogStatus: 'create',
        dialogFormVisible: false,
        userTypeCode: null,
        userTypes: [{code: 0, msg: '超级管理员'}, {code: 1, msg: '普通用户'}],
        headers: {},
        modifyData: '',
        form: {
          id: null, appName: '', title: '', order: null, addressType: null, addressList: ''
        },
        rules: {
          appName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          title: [{required: true, message: '请选择用户类型', trigger: 'blur'}],
          order: [{required: true, message: '请输入排列顺序', trigger: 'blur'}],
          addressType: [{required: true, message: '请选择注册类型', trigger: 'blur'}]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          appName: '',
          title: '',
          pageNo: 1,
          pageSize: 10
        },
        tableKey: 0,
        pageBoolean: {
          delColor: 'primary',
          delText: '批量删除',
          addColor: 'success',
          addText: '添加执行器'
        },
      }
    },
    created() {
    },
    mounted() {
      this.headers = {accessToken: getToken()}
      this.getList()
    },
    watch: {},
    methods: {
      addForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            create(this.form).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  message: "新增成功",
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message(res.msg)
              }
              this.listLoading = false
            }).catch(function (err) {
              console.log(err.message)
            })
          } else {
            return false;
          }
        });
      },
      updateForm() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            update(this.form).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  message: "更新成功",
                  type: 'success'
                })
                this.getList()
              } else {
                this.$message(res.msg)
              }
            }).catch(function (err) {
              console.log(err.message)
            })
          } else {
            return false;
          }
        });
      },
      executorCreate() {
        this.form = {
          id: null, appName: '', title: '', order: null, addressType: null, addressList: ''
        }
        this.dialogFormVisible = true
        this.dialogStatus = 'create'
      },
      getList() {
        getGroupList(this.listQuery).then(res => {
          this.listLoading = false
          const {code, content: {list, total}} = res
          if (code === 200) {
            this.list = list
            this.total = total
            if (this.total === 0) {
              this.$message({
                message: '执行器列表为空',
                type: 'warning'
              })
            }
          } else {
            this.$message(res.msg)
          }
        })
      },
      executorModify(row) { // 修改执行器信息
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
        this.form = row
      },
      modifyComplete(data) {
        if (!data) return false
        this.getList()
        this.dialogFormVisible = false
      },
      warnBeforeDelete(idx, row) {
        this.$confirm(
          '确认删除当前执行器？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        ).then(response => {
          this.batchDelete(idx, row)
        }).catch(reject => console.log(reject))
      },
      batchDelete(idx, row) {
        remove(row.id).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(idx)
              this.list.splice(idx, 1)
              this.total--
            } else {
              this.$message({
                message: '删除失败',
                type: 'error',
                duration: 2000
              })
            }
          }
        ).catch(function (err) {
          console.log(err.message)
        })
      },
      formatAddressList(addressList) {
        if (addressList != null && addressList != '') {
          let addressArr = addressList.split(",")
          let showAddress = ''
          addressArr.forEach(function (val) {
            showAddress += val + '<br>'
          })
          return showAddress
        }
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
