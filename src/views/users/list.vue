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
      <el-button class="filter-item" style="margin-left: 10px;" @click="userCreate"
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

      <el-table-column min-width="100" align="center" label="用户类型" show-overflow-tooltip>
        <template scope="scope">
          <span :class="{'adminColor':scope.row.userType===0,'normalColor':scope.row.userType===1}">{{scope.row.userTypeDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120" align="center" label="手机号" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100" align="center" label="创建时间" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.createTime|dateformat('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="200">
        <template scope="scope">
          <el-button size="small" type="primary" @click="userModify(scope.row)">编辑
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

    <el-dialog :title="dialogStatus=='create' ? '新增用户' : '编辑用户'" :visible.sync="dialogFormVisible" center>
      <el-form :model="userForm" :rules="rules" ref="userForm">
        <el-form-item label="用户名" label-width="80px" prop="userName">
          <el-input v-model="userForm.userName" auto-complete="off" maxlength="64"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" label-width="80px" prop="realName">
          <el-input v-model="userForm.realName" auto-complete="off" maxlength="12"
                    placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="80px" prop="phone">
          <el-input v-model.number="userForm.phone" auto-complete="off" maxlength="11"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>

        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="userForm.userType" placeholder="请选择">
            <el-option v-for="item in userTypes"
                       :key="item.code"
                       :label="item.msg"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" minlength="6" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="userForm.checkPass" minlength="6" auto-complete="off"></el-input>
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
  import {getToken} from '@/utils/auth'
  import {batchDel, create, detail, getUserList, update} from '@/api/user'

  export default {
    name: 'list',
    props: {},
    components: {},
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.userForm.checkPass !== '') {
            this.$refs.userForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dialogStatus: 'create',
        dialogFormVisible: false,
        userTypeCode: -1,
        userTypes: [{code: 0, msg: '超级管理员'}, {code: 1, msg: '普通用户'}],
        headers: {},
        modifyData: '',
        userForm: {
          id: '', userName: '', realName: '', phone: null, userType: null, password: '', checkPass: ''
        },
        rules: {
          userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          realName: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
          userType: [{required: true, message: '请选择用户类型', trigger: 'blur'}],
          phone: [{required: true, validator: checkPhone, trigger: 'blur'}],
          password: [
            {required: true, validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ],
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
        pageBoolean: {
          delColor: 'primary',
          delText: '批量删除',
          addColor: 'success',
          addText: '添加用户'
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
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            create(this.userForm).then(res => {
              const {code} = res
              if (code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  message: "新增成功",
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
      updateForm() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            update(this.userForm).then(res => {
              const {code} = res
              if (code === 200) {
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
      userCreate() {
        this.userForm = {id: '', userName: '', realName: '', phone: null, userType: null, password: '', checkPass: ''}
        this.dialogFormVisible = true
        this.dialogStatus = 'create'
        this.$refs['userForm'].resetFields()
      },
      getList() {
        getUserList(this.listQuery).then(res => {
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
            this.listLoading = false
          } else {
            this.listLoading = false
            this.$message(res.msg)
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      userModify(row) { // 修改用户信息
        detail(row.id).then(response => {
          const {code, content} = response
          if (code === 200) {
            this.userForm = content
            this.userForm.checkPass = content.password
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.$refs['userForm'].resetFields()
          }
        })
      },
      modifyComplete(data) {
        if (!data) return false
        this.getList()
        this.dialogFormVisible = false
      },
      warnBeforeDelete(idx, row) {
        this.$confirm(
          '确认删除当前用户？',
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
        batchDel(row.id).then(res => {
            const {code} = res
            if (code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              const index = this.list.indexOf(idx)
              this.list.splice(idx, 1)
              this.total--
            } else {
              this.$message({
                message: '删除失败',
                type: 'error',
              })
            }
          }
        ).catch(function (err) {
          console.log(err.message)
        })
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
  .adminColor {
    color: #67c23a;
  }

  .normalColor {
    color: #409EFF;
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
