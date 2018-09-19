<template>
  <div class="top">
    <el-row class="fitersLine">
      <el-col :span="24">
        <el-form :inline="true">
          <!--{{getExecutorList}}-->
          <el-form-item label="执行器">
            <el-select v-model="queryParams.jobGroup" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="(item) in groups"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务描述">
            <el-input v-model="queryParams.jobDesc" placeholder="请输入任务描述"></el-input>
          </el-form-item>

          <el-form-item label="JobHandler">
            <el-input v-model="queryParams.executorHandler" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDataByFilter">查询</el-button>
          </el-form-item>
          <el-button class="filter-item" style="margin-left: 10px;" @click="jobCreate"
                     :type="pageBoolean.addColor" icon="el-icon-plus">{{ pageBoolean.addText }}
          </el-button>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      :key='tableKey'
      :data="list"
      :default-sort="{prop: 'inTime', order: 'descending'}"
      v-loading="listLoading"
      element-loading-text="数据加载中，请稍后"
      border
      fit
      :highlight-current-row='false'
      style="width: 100%">
      <el-table-column label="任务ID" align="center" min-width="30" prop="id">
        <template slot-scope="scope"> {{scope.row.id}}</template>
      </el-table-column>
      <el-table-column align="center" prop="jobDesc" label="任务描述" min-width="100">
        <template slot-scope="scope"> {{scope.row.jobDesc}}</template>
      </el-table-column>
      <el-table-column align="center" prop="gulueType" label="运行模式" min-width="100">
        <template slot-scope="scope"> {{scope.row.glueType}}:{{scope.row.executorHandler}}</template>
      </el-table-column>
      <el-table-column align="center" prop="jobCron" label="Cron" min-width="60">
        <template slot-scope="scope"> {{scope.row.jobCron}}</template>
      </el-table-column>
      <el-table-column align="center" prop="author" label="负责人" min-width="50">
        <template slot-scope="scope"> {{scope.row.author}}</template>
      </el-table-column>
      <el-table-column align="center" prop="author" label="状态" min-width="40">
        <template slot-scope="scope">
          <span v-html="formatJobStatus(scope.row.jobStatus)"></span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="操作" show-overflow-tooltip min-width="60">
        <template slot-scope="scope">
          <div style="margin-bottom: 5px">
            <el-button size="mini" type="success" @click="warnBeforeOperate(0,scope.row.id)">执行</el-button>
            <el-button size="mini" type="warning" @click="justifyIfAllow(scope.row.jobStatus,scope.row.id)">
              {{scope.row.jobStatus==='PAUSED'?'恢复':'暂停'}}
            </el-button>
          </div>
          <div>
            <el-button size="mini" type="primary" @click="editJob(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="warnBeforeOperate(1,scope.row.id)">删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="60%" :title="dialogType=='create' ? '新增作业' : '编辑作业'" :visible.sync="dialogFormVisible" center>
      <el-form :model="jobForm" :rules="rules" ref="jobForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行器" prop="jobGroup">
              <el-select v-model="jobForm.jobGroup" placeholder="请选择">
                <el-option v-for="item in groups"
                           :key="item.id"
                           :label="item.title"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="路由策略" prop="executorRouteStrategy">
              <el-select v-model="jobForm.executorRouteStrategy" placeholder="请选择">
                <el-option v-for="(item,index) in routeStrategies"
                           :key="index"
                           :label="item.msg"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运行模式" prop="glueType">
              <el-select v-model="jobForm.glueType" placeholder="请选择">
                <el-option v-for="(item,index) in glueTypes"
                           :key="index"
                           :label="item.msg"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="阻塞策略" prop="executorBlockStrategy">
              <el-select v-model="jobForm.executorBlockStrategy" placeholder="请选择">
                <el-option v-for="(item,index) in blockStrategies"
                           :key="index"
                           :label="item.msg"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="失败处理策略" prop="executorFailStrategy">
              <el-select v-model="jobForm.executorFailStrategy" placeholder="请选择">
                <el-option v-for="(item,index) in failStrategies"
                           :key="index"
                           :label="item.msg"
                           :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报警邮件" prop="alarmEmail">
              <el-input v-model="jobForm.alarmEmail" label="请输入报警邮件,如果存在多个则逗号分隔"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务描述" prop="jobDesc">
              <el-input v-model="jobForm.jobDesc" label="请输入任务描述"></el-input>
            </el-form-item>
            <el-form-item label="Cron" prop="jobCron">
              <el-input v-model="jobForm.jobCron" label="请输入Cron"></el-input>
            </el-form-item>
            <el-form-item label="JobHandler" prop="executorHandler">
              <el-input v-model="jobForm.executorHandler" label="executorHandler"></el-input>
            </el-form-item>
            <el-form-item label="任务参数" prop="executorParam">
              <el-input v-model="jobForm.executorParam" label="请输入任务参数"></el-input>
            </el-form-item>
            <el-form-item label="子任务ID" prop="childJobId">
              <el-input v-model.number="jobForm.childJobId" label="请输入子任务的ID,如果存在多个则逗号分隔"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="author">
              <el-input v-model="jobForm.author" label="请输入负责人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogType=='create'" type="primary" @click="addForm">提 交</el-button>
        <el-button v-else type="primary" @click="updateForm">更 新</el-button>
      </div>
    </el-dialog>

    <el-row type="flex" justify="space-between" style="padding-top:20px;">
      <el-col style="text-align:right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryParams.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import {getToken} from '../../utils/auth' // 验权
  import {create, getJobPageList, jobPause, jobResume, jobTrigger, remove, update} from "../../api/jobs";

  export default {
    name: 'JobsList',
    data() {
      return {
        dialogType: '',
        groups: [],
        routeStrategies: [],
        glueTypes: [],
        blockStrategies: [],
        failStrategies: [],
        headers: {},
        tableKey: 0,
        total: null,
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        queryParams: {
          jobGroup: null,
          jobDesc: '',
          executorHandler: '',
          pageNo: 1,
          pageSize: 10,
        },
        jobForm: {
          id: null,
          jobGroup: null,
          executorRouteStrategy: '',
          glueType: null,
          executorParam: '',
          executorBlockStrategy: '',
          author: '',
          jobDesc: '',
          jobCron: '',
          executorHandler: '',
          childJobId: null,
          executorFailStrategy: '',
          alarmEmail: ''
        },
        rules: {
          jobGroup: [{required: true, message: '请选择执行器', trigger: 'blur'}],
          executorRouteStrategy: [{required: true, message: '请选择路由策略', trigger: 'blur'}],
          executorHandler: [{required: true, message: '请输入执行器BEAN名称', trigger: 'blur'}],
          glueType: [{required: true, message: '请选择运行模式', trigger: 'blur'}],
          author: [{required: true, message: '请输入负责人', trigger: 'blur'}],
          jobDesc: [{required: true, message: '请输入任务描述', trigger: 'blur'}],
          jobCron: [{required: true, message: '请输入Cron表达式', trigger: 'blur'}],
          executorFailStrategy: [{required: true, message: '请选择失败策略', trigger: 'blur'}],
          alarmEmail: [{required: false, message: '请输入邮箱地址', trigger: 'blur'}, {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }],
          executorBlockStrategy: [{required: true, message: '请选择阻塞策略', trigger: 'blur'}],
          executorFailStrategy: [{required: true, message: '请选择失败策略', trigger: 'blur'}],
        },
        operateJobId: null,
        pageBoolean: {
          delColor: 'primary',
          delText: '批量删除',
          addColor: 'success',
          addText: '添加作业'
        },
        operateText: ['执行', '暂停', '删除'],
      };
    },
    created() {
      this.headers = {accessToken: getToken()};
      this.getJobsList();
    },
    methods: {
      addForm() {
        this.$refs['jobForm'].validate((valid) => {
          if (valid) {
            create(this.jobForm).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  message: "新增成功",
                  type: 'success'
                })
                this.getJobsList()
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
        this.$refs['jobForm'].validate((valid) => {
          if (valid) {
            update(this.jobForm).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false
                this.$message({
                  message: "更新成功",
                  type: 'success'

                })
                this.getJobsList()
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
      getJobsList() {
        getJobPageList(this.queryParams).then(res => {
          const {code, msg, content: {recordsTotal, data, blockStrategies, glueTypes, groups, routeStrategies, failStrategies}} = res
          if (code === 200) {
            this.total = recordsTotal
            this.list = data
            this.groups = groups
            this.routeStrategies = routeStrategies
            this.glueTypes = glueTypes
            this.blockStrategies = blockStrategies
            this.failStrategies = failStrategies
            if (recordsTotal === 0) {
              this.$message({
                message: '未找到符合条件的作业任务',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: msg,
              type: 'warning'
            })
          }
          this.listLoading = false
        }).catch(reject => {
          this.listLoading = false;
        });
      },
      getDataByFilter() {
        this.queryParams.pageNo = 1
        this.getJobsList()
      },
      jobCreate() {
        this.jobForm = {
          id: null,
          jobGroup: null,
          executorRouteStrategy: '',
          glueType: null,
          executorParam: '',
          executorBlockStrategy: '',
          author: '',
          jobDesc: '',
          jobCron: '',
          executorHandler: '',
          childJobId: null,
          executorFailStrategy: '',
          alarmEmail: ''
        }
        this.dialogFormVisible = true
        this.dialogType = 'create'
      },
      warnBeforeOperate(type, id) {
        this.$confirm(
          '确认' + this.operateText[type] + '该作业？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        ).then(res => {
          if (type === 0) {
            this.exeJob(id)
          } else if (type === 1) {
            this.deleteJob(id)
          }
        }).catch(reject => console.log(reject))
      },
      justifyIfAllow(status, id) {
        if (status === 'NORMAL' || status === 'PAUSED') {
          this.warnBeforePauseAndBack(status, id)
        } else {
          this.$message({
            message: '该状态的作业不允许操作',
            type: 'warning'
          })
        }
      },
      warnBeforePauseAndBack(status, id) {
        let statusDesc = status === 'PAUSED' ? '恢复' : '暂停'
        this.$confirm(
          '确认' + statusDesc + '该作业？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
          }
        ).then(res => {
          if (status === 'PAUSED') {
            this.resumeJob(id)
          } else if (status === 'NORMAL') {
            this.pauseJob(id)
          }
        }).catch(reject => console.log(reject))
      },
      exeJob(id) {
        jobTrigger(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "触发成功",
              type: 'success'
            })
            this.getJobsList()
          } else {
            this.$message(res.msg)
          }
        }).catch(function (err) {
          this.$message(err)
        })
      },
      pauseJob(id) {
        jobPause(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "暂停成功",
              type: 'success'
            })
            this.getJobsList()
          } else {
            this.$message(res.msg)
          }
        }).catch(function (err) {
          this.$message(err)
        })
      },
      resumeJob(id) {
        jobResume(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "恢复成功",
              type: 'success'
            })
            this.getJobsList()
          } else {
            this.$message(res.msg)
          }
        }).catch(function (err) {
          this.$message(err)
        })
      },
      deleteJob(id) {
        remove(id).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: 'success'
            })
            this.getJobsList()
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(function (err) {
          this.$message(err)
        })
      },
      //NONE, NORMAL, PAUSED, COMPLETE, ERROR, BLOCKED
      formatJobStatus(jobStatus) {
        switch (jobStatus) {
          case 'NORMAL':
            return '<span style="color: seagreen;font-style: oblique;text-decoration:underline">NORMAL</span>'
          case 'NONE':
            return '<span style="color: darkgoldenrod;font-style: oblique;text-decoration:underline">NONE</span>'
          case 'PAUSED':
            return '<span style="color: grey;font-style: oblique;text-decoration:underline">PAUSED</span>'
          case 'ERROR':
            return '<span style="color: red;font-style: oblique;text-decoration:underline">ERROR</span>'
          case 'COMPLETE':
            return '<span style="color: green;font-style: oblique;text-decoration:underline">ERROR</span>'
          case 'BLOCKED':
            return '<span style="color: goldenrod;font-style: oblique;text-decoration:underline">ERROR</span>'
          default:
            return null
        }
      },
      editJob(row) {
        this.dialogFormVisible = true
        this.operateJobId = row.id
        this.dialogType = 'update'
        this.jobForm = row
      },
      editCompleted(state) {
        this.dialogFormVisible = false
        if (state) {
          this.getJobsList()
        }
      },
      formateNumber(value) {
        console.log(value)
      },
      handleSizeChange(val) {
        this.queryParams.pageSize = val
        this.getGoodsData()
      },
      handleCurrentChange(val) {
        this.queryParams.pageNo = val
        this.getGoodsData()
      }
    },
    computed: {
      getExecutorList() {
        axios.get('').then(res => {
          const {code, data} = res
          if (code === '0') {
            this.gradeList = data
          }
        })
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .top {
    padding: 10px;
  }

</style>
<style rel="stylesheet/scss" lang="scss">


  .el-button--mini {
    padding: 7px 10px;
  }

  .el-button + .el-button {
    margin-left: 1px;
  }

  .el-upload {
    text-align: left
  }

  .el-dialog__body {
    line-height: 0;
    padding: 0 0 20px;
  }

  .el-dialog__header {
    padding-bottom: 0;
  }

  .el-steps--simple {
    margin: 10px 0;
  }

  .border-none {
    input {
      border: none;
      padding: 0;
      text-align: center;
      &:focus {
        border: 1px solid #dcdfe6
      }
    }
  }

  .el-table--enable-row-hover {
    .el-table__body {
      tr:hover > td {
        background: transparent;
      }
    }
  }

  .fitersLine {
    .el-form-item__content {
      margin-left: 0 !important
    }
    .el-form-item__label {
      min-width: auto !important;
    }
  }

  .el-table .cell {
    line-height: 1;
    padding: 0 3px;
  }
</style>
