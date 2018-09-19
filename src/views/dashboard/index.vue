<template>
  <div class="dashboard-editor-container">

    <panel-group :group-data="panelGroupData"/>

    <el-row style="margin-bottom: 10px">
      <el-col :span="12">
        <div>调度报表</div>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-date-picker
          size="small"
          v-model="dateDuring"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-button type="primary" size="small" @click="getDashBoardInfo">查询</el-button>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="chart-wrapper">
        <line-chart :chart-data="lineChartData"/>
      </div>
    </el-row>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import PieChart from './components/PieChart'
  import {getChartInfo} from "../../api/dashboard";

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      LineChart,
      PieChart,
    },
    data() {
      return {
        lineChartData: {
          successData: [],
          failData: [],
          runningData: [],
          lineCharDates: []
        },
        dateDuring: [],
        panelGroupData: {
          jboLogCount: null,
          jobInfoCount: null,
          executorCount: null
        },
        queryParams: {
          startDate: null,
          endDate: null
        }
      }
    },
    created() {
      this.getDashBoardInfo(this.queryParams)
    },
    methods: {
      getDashBoardInfo() {
        this.queryParams.startDate = this.dateDuring[0]
        this.queryParams.endDate = this.dateDuring[1]
        getChartInfo(this.queryParams).then(res => {
          const {
            code, content: {
              jobInfoCount, jobLogCount, executorCount, triggerCountRunningTotal, jobLogSuccessCount, triggerCountFailTotal,
              triggerDayList, triggerDayCountRunningList, triggerDayCountFailList, triggerDayCountSucList
            }
          } = res
          if (res.code === 200) {
            this.$nextTick(() => {
              this.lineChartData.lineCharDates = triggerDayList
              this.lineChartData.successData = triggerDayCountSucList
              this.lineChartData.failData = triggerDayCountFailList
              this.lineChartData.runningData = triggerDayCountRunningList
              this.panelGroupData.jboLogCount = jobLogCount
              this.panelGroupData.jobInfoCount = jobInfoCount
              this.panelGroupData.executorCount = executorCount
            })
          }
        }).catch(function (err) {
          console.log(err.message)
        })

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
    .panel-group {
      margin-top: 0px;
    }
  }
</style>
