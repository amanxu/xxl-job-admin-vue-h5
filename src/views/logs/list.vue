<template>
  <div class="top">
    <el-row class="fitersLine">
      <el-col :span="24">
        <el-form :inline="true">
          <el-select size="small" v-model="queryParams.jobGroup" @change="groupChange" placeholder="请选择执行器">
            <el-option
              v-for="item in executors"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="queryParams.jobId" placeholder="请选择作业">
            <el-option
              v-for="item in jobs"
              :key="item.id"
              :label="item.jobDesc"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select size="small" v-model="queryParams.logStatus" placeholder="请选择日志状态">
            <el-option
              v-for="item in statusEnum"
              :key="item.code"
              :label="item.msg"
              :value="item.code">
            </el-option>
          </el-select>
          <el-form-item>
            <el-date-picker
              size="small"
              v-model="queryParams.filterTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="clearFilterParam">清除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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

      <el-table-column align="center" label="任务ID" min-width="60">
        <template scope="scope">
          <span class="link-type">{{scope.row.jobId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务名称" min-width="80">
        <template scope="scope">
          <span class="link-type">{{scope.row.jobName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="调度时间" min-width="120">
        <template scope="scope">
          <span class="link-type">{{scope.row.triggerTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="40" align="center" label="调度结果" show-overflow-tooltip>
        <template scope="scope">
          <span :class="{'sucColor':scope.row.triggerCode===200,'failColor':scope.row.triggerCode===500}">
            {{scope.row.triggerCode===200?'成功':(scope.row.triggerCode===500?'失败':'')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100" align="center" label="执行时间" show-overflow-tooltip>
        <template scope="scope">
          <span>{{scope.row.handleTime===null?'':scope.row.handleTime|dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="40" align="center" label="执行结果" show-overflow-tooltip>
        <template scope="scope">
          <span :class="{'sucColor':scope.row.handleCode===200,'failColor':scope.row.handleCode===500}">
            {{scope.row.handleCode===200?'成功':(scope.row.handleCode===500?'失败':'')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="60">
        <template scope="scope">
          <el-button size="mini" type="primary" @click="jobLog(scope.row.id)">日志详情</el-button>
          <el-button size="mini" type="danger" v-show="scope.row.triggerCode===200 && scope.row.handleCode===0"
                     @click="stopJob(scope.row.id)">终止
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="queryParams.start"
                     :page-sizes="[10,20,30,50]" :page-size="queryParams.length"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog class="dialog-detail-view" title="调度详情" :visible.sync="dialogFormVisible" center>
      <el-form :model="jobLogDetail">
        <el-form-item label="触发结果：" label-width="80px" prop="realName">
          <span>{{jobLogDetail.triggerCode===0?null:(jobLogDetail.triggerCode===200?'成功':'失败')}}</span>
        </el-form-item>
        <el-form-item label="执行结果：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.handleCode===0?null:(jobLogDetail.handleCode===200?'成功':'失败')}}</span>
        </el-form-item>
        <el-form-item label="执行器地址：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.executorAddress}}</span>
        </el-form-item>
        <el-form-item label="执行参数：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.executorParam}}</span>
        </el-form-item>
        <el-form-item label="调度类型：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.glueType}}</span>
        </el-form-item>
        <el-form-item label="作业描述：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.jobDesc}}</span>
        </el-form-item>
        <el-form-item label="执行日志：" label-width="80px" prop="phone">
          <span>{{jobLogDetail.handleMsg}}</span>
        </el-form-item>
        <el-form-item label="调度信息：" label-width="80px" prop="userName">
          <span v-html="jobLogDetail.triggerMsg"></span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getToken} from '@/utils/auth' // 验权
  import {getGroupListAll} from "../../api/group";
  import {getJobDetail, getLogsList, stopJob} from "../../api/logs";
  import {getJobsByGroup} from "../../api/jobs";

  export default {
    name: 'list',
    props: {},
    components: {},
    data() {
      return {
        statusEnum: [{code: 1, msg: '成功'}, {code: 2, msg: '失败'}, {code: 3, msg: '进行中'}],
        executors: [],
        jobs: [],
        dialogStatus: 'create',
        dialogFormVisible: false,
        headers: {},
        modifyData: '',
        list: null,
        total: null,
        listLoading: true,
        queryParams: {
          jobGroup: null,
          jobId: null,
          start: 1,
          length: 10,
          logStatus: null,
          filterTime: [] //[new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        },
        tableKey: 0,
        jobLogDetail: {
          triggerCode: null,
          handleCode: null,
          executorAddress: '',
          executorParam: '',
          glueType: '',
          handleMsg: '',
          jobDesc: '',
          author: '',
          triggerMsg: '',
        }
      }
    },
    created() {
    },
    mounted() {
      this.headers = {accessToken: getToken()}
      this.getList()
      this.getExecutors()
    },
    watch: {},
    methods: {
      getList() {
        getLogsList(this.queryParams).then(res => {
          const {code, content: {data, recordsTotal}} = res
          this.listLoading = false
          if (code === 200) {
            this.list = data
            this.total = recordsTotal
            if (this.total === 0) {
              this.$message({
                message: '检索结果为空',
                type: 'warning'
              })
            }
          } else {
            this.$message(res.msg)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      getExecutors() { //查询执行器
        getGroupListAll().then(res => {
          const {code, content} = res
          if (code === 200) {
            this.executors = content
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      groupChange() {
        this.queryParams.jobId = null
        if (this.queryParams.jobGroup !== null) {
          getJobsByGroup(this.queryParams.jobGroup).then(res => {
            const {code, content} = res
            if (res.code === 200) {
              this.jobs = content
            }
          }).catch(function (err) {
            console.log(err.message)
          })
        }
      },
      stopJob(id) {
        stopJob(id).then(res => {
          const {code, msg} = res
          if (code === 200) {
            this.$message({
              message: '终止成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '终止失败',
              type: 'warning',
            })
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      jobLog(id) {
        getJobDetail(id).then(res => {
          this.jobLogDetail = res.content
          if (res.code === 200) {
            this.dialogFormVisible = true
          } else {
            this.$message({
              message: '查询失败',
              type: 'warning',
            })
          }
        }).catch(function (err) {
          console.log(err.message)
        })
      },
      clearFilterParam() {
        this.queryParams.jobId = null
        this.queryParams.jobGroup = null
        this.queryParams.logStatus = null
        this.queryParams.filterTime = []
      },
      handleFilter() {
        this.queryParams.start = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.queryParams.length = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryParams.start = val
        this.getList()
      },
      handleRefresh() {
        this.list = null
        this.total = null
        this.queryParams.start = 1
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
  .sucColor {
    color: seagreen;
  }

  .failColor {
    color: #f56c6c;
  }

  .top {
    padding: 10px;
  }

  .el-button--mini {
    padding: 7px 10px;
  }

  .el-button + .el-button {
    margin-left: 1px;
  }

  .dialog-detail-view {
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-form-item__content {
      line-height: 30px;
    }
    .el-form-item__label {
      line-height: 30px;
    }
  }

  .el-dialog__header {
    padding-bottom: 0;
  }

  .el-dialog__body {
    padding: 0
  }

  .createPost-main-container {
    padding: 20px 0 !important;
  }

  .fitersLine {
    .el-form-item__content {
      margin-left: 0 !important
    }
    .el-form-item__label {
      min-width: auto !important;
    }
    .el-select {
      margin-top: 3px;
    }
  }
</style>
