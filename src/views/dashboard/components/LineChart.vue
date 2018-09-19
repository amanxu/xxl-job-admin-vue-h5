<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  import {debounce} from '@/utils'

  require('echarts/theme/macarons') // echarts theme

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.initChart()
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }

      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHanlder)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

      this.chart.dispose()
      this.chart = null
    },
    methods: {
      setOptions({successData, failData, runningData, lineCharDates} = {}) {
        this.chart.setOption({
          xAxis: {
            data: lineCharDates,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: ['成功', '失败', '进行中']
          },
          series: [{
            name: '成功',
            itemStyle: {
              normal: {
                color: '#9ACD32',
                lineStyle: {
                  color: '#9ACD32',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: successData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
            {
              name: '失败',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  },
                  /*areaStyle: {
                    color: '#FF005A'
                  }*/
                }
              },
              data: failData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }, {
              name: '进行中',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#FFD700',
                  lineStyle: {
                    color: '#FFD700',
                    width: 2
                  },
                  /*areaStyle: {
                    color: '#FFD700'
                  }*/
                }
              },
              data: runningData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }
    }
  }
</script>
