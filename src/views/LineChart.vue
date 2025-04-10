<template>
  <div class="line-chart">
    <div class="operation">
      <a-select v-model="lineKey" @change="lineChange" style="width: 150px">
        <a-select-option v-for="(val, key) in lineType" :value="key" :key="'line' + key">{{ val }}</a-select-option>
      </a-select>
      <a-date-picker
        v-if="lineKey === 0"
        :value="pickerValue"
        format="YYYY-MM-DD"
        @change="pickerChange"
        @panelChange="pickerChange"
        placeholder="请选择日期"
        :allowClear="false"
      />
      <a-month-picker
        v-if="lineKey === 1"
        :value="pickerValue"
        format="YYYY年MM月"
        @change="pickerChange"
        @panelChange="pickerChange"
        placeholder="请选择月份"
        :allowClear="false"
      />
      <a-date-picker
        v-if="lineKey === 2"
        :value="pickerValue"
        format="YYYY年"
        mode="year"
        placeholder="请选择年份"
        @change="pickerChange"
        @panelChange="pickerChange"
        :allowClear="false"
      />
      <a-range-picker
        v-if="[3, 4, 5].includes(lineKey)"
        :value="rangeValue"
        :mode="mode"
        :showTime="rangeType[lineKey].showTime"
        :format="rangeType[lineKey].format"
        @panelChange="handlePanelChange"
        @change="handleChange"
        :allowClear="false"
      />
      <a-select v-if="valueType[lineKey].length > 0" v-model="sDataType" style="width: 150px">
        <a-select-option v-for="(val, key) in valueType[lineKey]" :value="key" :key="'value' + key">
          {{ val }}
        </a-select-option>
      </a-select>
      <!-- <a-dropdown-button>
        读取数据
        <a-menu slot="overlay">
          <a-menu-item key="1">
            <a-icon type="setting" style="font-size: 16px" />
            设置远程数据中心
          </a-menu-item>
        </a-menu>
      </a-dropdown-button> -->
    </div>
    <div class="line">
      <div class="list">
        <a-select v-model="ucDbType" @change="seachTransformer" style="width: 100%">
          <a-select-option :value="0">遥测</a-select-option>
          <a-select-option :value="1">电度</a-select-option>
        </a-select>
        <a-select v-model="stationSelect" @change="seachTransformer" style="width: 100%">
          <a-select-option v-for="(val, key) in stationList" :value="val.subStationName" :key="'station' + key">
            {{ val.subStationDesc }}
          </a-select-option>
        </a-select>
        <div class="tree" :style="{ height: [0, 4].includes(-1) ? '480px' : '520px' }">
          <!-- <a-tree :tree-data="treeData" /> -->
          <a-directory-tree multiple default-expand-all :selected-keys="selectedKeys" @select="selectLeaf" :icon="null">
            <a-tree-node v-for="val in treeData" :key="val.key" :title="val.title" :disabled="val.isSelect" is-leaf />
          </a-directory-tree>
        </div>
        <!-- <a-select v-if="[0, 4].includes(lineKey)" v-model="planValue" style="width: 100%">
          <a-select-option v-for="(val, key) in planList" :value="key" :key="'plan' + key">
            {{ val }}
          </a-select-option>
        </a-select> -->
        <a-button type="primary" @click="add">增加曲线</a-button>
        <a-button type="danger" @click="del">删除全部曲线</a-button>
      </div>
      <div class="chart-box">
        <div class="chart" id="chart" ref="chart" :style="{ height: 670 - (chartData.length - 1) * 21 + 'px' }"></div>
        <div class="status" :style="{ height: chartData.length <= 0 ? 0 : (chartData.length - 1) * 21 + 'px' }">
          <div
            class="status-line"
            v-for="(val, index) in chartData"
            :style="{ color: chartColor[index] }"
            :key="'select-line' + index"
          >
            <span>
              {{ `${index + 1}. 【${val.name}${chartTime.length === 0 ? '' : '-' + chartTime[selectLine]}】` }}
            </span>
            <span>
              {{
                `最大：${val?.data.length === 0 ? '/' : Math.max(...val?.data)}（${
                  chartTime.length === 0 ? '/' : chartTime[0]
                } ~ ${chartTime.length === 0 ? '/' : chartTime[chartTime.length - 1]}）`
              }}
            </span>
            <span>
              {{
                `最小：${val?.data.length === 0 ? '/' : Math.min(...val?.data)}（${
                  chartTime.length === 0 ? '/' : chartTime[0]
                } ~ ${chartTime.length === 0 ? '/' : chartTime[chartTime.length - 1]}）`
              }}
            </span>
            <span>
              {{
                `平均：${
                  val?.data.length === 0
                    ? '/'
                    : (val?.data?.reduce((a, b) => parseInt(a) + parseInt(b)) / val?.data.length).toFixed(4)
                }`
              }}
            </span>
            <span>{{ '值：' + (val?.data.length === 0 ? '/' : val?.data[selectLine]) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/zh-cn'
  import * as echarts from 'echarts'
  import { initCurveObjSelList } from '/mock/mock-data.js'
  import { HisCurveServiceClient } from '@/plugin/grpc/protobuf-ts/grpc.client'
  import { CurvePara, SysClock, Empty, StringTypeData } from '@/plugin/grpc/protobuf-ts/grpc'
  import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
  import 'moment/locale/zh-cn'

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        snap: true,
        animation: false,
        triggerOn: 'none'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    axisPointer: {
      snap: true,
      triggerOn: 'click',
      lineStyle: {
        color: '#7581BD',
        width: 2
      },
      handle: {
        show: true,
        icon: 'image://'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: []
  }
  export default {
    data() {
      return {
        // chart
        selectLine: 0,
        chartData: [],
        chartTime: [],
        chartColor: [
          '#5470c6',
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#ea7ccc',
          '#2BFA2B',
          '#7b7bef',
          '#f04290'
        ],
        // 曲线类型
        lineKey: 0,
        pickerValue: moment(),
        mode: ['month', 'month'],
        rangeValue: [moment(), moment()],
        rangeMode: [],
        ucDbType: 0,
        sDataType: 0,
        stationList: [],
        stationSelect: '',
        // 曲线类型
        lineType: ['日曲线', '月曲线', '年曲线', '趋势曲线', '多日曲线', '多月曲线'],
        valueType: [
          ['采样值', '最大值', '最小值'],
          ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值'],
          ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值'],
          [],
          ['采样值', '最大值', '最小值'],
          ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值']
        ],
        rangeType: {
          3: {
            showTime: true,
            format: 'YYYY-MM-DD HH:mm:ss'
          },
          4: {
            showTime: false,
            format: 'YYYY-MM-DD'
          },
          5: {
            showTime: false,
            format: 'YYYY年MM月'
          }
        },
        planList: ['不显示计划', '显示计划', '显示通道', '显示计划及通道'],
        planValue: 0,
        // 存放数据的键值
        selectIndex: [],
        // 绑定变更树形结构状态
        selectedKeys: [],
        // 树形结构数据
        treeData: [],
        chart: null
      }
    },
    created() {},
    mounted() {
      // Array.from({ length: 30 }).forEach((v, k) => {
      //   const obj = { title: '变压器' + k, key: k.toString(), isSelect: false, data: [] }
      //   Array.from({ length: 12 }).forEach(() => {
      //     obj.data.push(faker.datatype.number({ min: 1, max: 500 }))
      //   })
      //   this.treeData.push(obj)
      // })
      this.initStation()
      this.initChart()
    },
    methods: {
      selectLeaf(keys) {
        this.selectIndex = []
        this.selectedKeys = []
        keys.forEach((key) => {
          const index = this.treeData.findIndex((v) => v.key === key && !v.isSelect)
          if (index !== -1) {
            this.selectIndex.push(index)
            this.selectedKeys.push(key)
          }
        })
      },
      add() {
        const changeDatetime = (time) => {
          const formatArr = ['HH:mm:ss', 'MM月DD日', 'MM月', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'YYYY年MM月']
          const date = moment()
            .year(time.year)
            .month(time.month - 1)
            .date(time.day)
            .hour(time.hour)
            .minute(time.minute)
            .second(time.second)
            .millisecond(time.msecond)
          return date.format(formatArr[this.lineKey])
        }
        this.selectIndex.forEach((index) => {
          const select = this.treeData[index]
          const type = this.valueType[this.lineKey][this.sDataType]
          if (option.series.findIndex((v) => v.name === select.title + '-' + type) === -1 && option.series.length < 12) {
            this.getLineData(select.key).then((res) => {
              if (option.series.length >= 12) {
                return
              }
              const series = []
              const valueArr = res.map((v) => v.dfValue.toFixed(4))
              const timeArr = res.map((v) => changeDatetime(v.time))
              const data = {
                name: select.title + '-' + type,
                data: valueArr,
                type: 'line',
                smooth: true
              }
              series.push(data)
              // select.isSelect = true
              console.log(timeArr, series)
              option.xAxis.data = timeArr
              option.series = [...option.series, ...series]
              option && this.chart.setOption(option)
              this.selectIndex = []
              this.selectedKeys = []
              this.chartData = option.series
              this.chartTime = timeArr
              console.log(this.chart.getModel().option.color)
            })
          }
        })
      },
      del() {
        this.treeData.forEach((v) => {
          v.isSelect = false
        })
        option.xAxis.data = []
        option.series = []
        console.log(option)
        option && this.chart.setOption(option, true)
        this.selectIndex = []
        this.selectedKeys = []
        this.selectLine = 0
        this.chartData = []
      },
      initChart() {
        option.tooltip.formatter = (data) => {
          console.log(data)
          this.selectLine = data[0].dataIndex
          return ''
        }
        option.color = this.chartColor
        const chartDom = document.getElementById('chart')
        this.chart = echarts.init(chartDom)
        option && this.chart.setOption(option)
        chartDom.addEventListener('resize', () => {
          this.chart.resize()
        })
        const observer = new ResizeObserver(() => {
          this.chart.resize()
        })
        observer.observe(chartDom)
      },
      lineChange(val) {
        this.del()
        this.sDataType = 0
        if ([3, 4].includes(val)) {
          this.mode = ['date', 'date']
        }
        if (val === 5) {
          this.mode = ['month', 'month']
        }
      },
      handleChange(value) {
        console.log(value)
        this.rangeValue = value
      },
      handlePanelChange(value, mode) {
        console.log(value, mode)
        this.rangeValue = value
      },
      pickerChange(val) {
        console.log(val)
        this.pickerValue = val
        if (val === null) {
          this.pickerValue = moment()
        }
      },
      initStation() {
        if (!import.meta.env.VITE_MOCK) {
          // 创建客户端
          const client = new HisCurveServiceClient(
            new GrpcWebFetchTransport({
              baseUrl: this.$config.gRPC_URL
            })
          )
          client
            .initSubstationList(Empty)
            .then((res) => {
              console.log('result', res.response.stringData)
              const data = JSON.parse(res.response.stringData)
              this.stationList = data
              this.stationSelect = data[0].subStationName
              this.seachTransformer()
            })
            .catch((err) => {
              console.log('error eccur.')
              console.log(err)
              console.log(err.code)
              console.log(err.message)
            })
        } else {
          this.stationList = [
            { subStationName: 'aa', subStationDesc: 'aaa' },
            { subStationName: 'bbb', subStationDesc: 'bb' }
          ]
          this.stationSelect = this.stationList[0].subStationName
        }
      },
      seachTransformer() {
        this.selectedKeys = []
        if (!import.meta.env.VITE_MOCK) {
          // 创建客户端
          const client = new HisCurveServiceClient(
            new GrpcWebFetchTransport({
              baseUrl: this.$config.gRPC_URL
            })
          )
          // 请求体对象赋值
          console.log({ objType: this.ucDbType, subStationName: this.stationSelect })
          const data = { objType: this.ucDbType, subStationName: this.stationSelect }
          const request = StringTypeData.fromJson({
            stringData: JSON.stringify(data)
          })
          console.log(request)
          client
            .initCurveObjSelList(request)
            .then((res) => {
              console.log('result', res.response.stringData)
              const data = JSON.parse(res.response.stringData)
              this.treeData = []
              data.forEach((v) => {
                const obj = { title: v.objDesc, key: v.objName, isSelect: false, data: [] }
                this.treeData.push(obj)
              })
            })
            .catch((err) => {
              console.log('error eccur.')
              console.log(err)
              console.log(err.code)
              console.log(err.message)
            })
        } else {
          const data = initCurveObjSelList()
          data.forEach((v) => {
            const obj = { title: v.objDesc, key: v.objName, isSelect: false, data: [] }
            this.treeData.push(obj)
          })
        }
      },
      getLineData(key) {
        const getClock = () => {
          const start = {
            year: 0,
            month: 0,
            day: 0,
            wday: 0,
            hour: 0,
            minute: 0,
            second: 0,
            msecond: 0
          }
          const end = {
            year: 0,
            month: 0,
            day: 0,
            wday: 0,
            hour: 0,
            minute: 0,
            second: 0,
            msecond: 0
          }
          const set = (startTime, endTime) => {
            console.log(startTime.format('YYYY-MM-DD HH:mm:ss:SSS'), endTime.format('YYYY-MM-DD HH:mm:ss:SSS'))
            start.year = startTime.year()
            start.month = startTime.month() + 1
            start.day = startTime.date()
            start.hour = startTime.hour()
            start.minute = startTime.minute()
            start.second = startTime.second()
            start.msecond = startTime.millisecond()
            end.year = endTime.year()
            end.month = endTime.month() + 1
            end.day = endTime.date()
            end.hour = endTime.hour()
            end.minute = endTime.minute()
            end.second = endTime.second()
            end.msecond = endTime.millisecond()
          }
          const unix = this.pickerValue.valueOf()
          const unixLeft = this.rangeValue[0].valueOf()
          const unixRight = this.rangeValue[1].valueOf()
          switch (this.lineKey) {
            case 0:
              set(
                moment(unix).hour(0).minute(0).second(0).millisecond(0),
                moment(unix).hour(23).minute(59).second(59).millisecond(999)
              )
              break
            case 1:
              set(
                moment(unix).date(1).hour(0).minute(0).second(0).millisecond(0),
                moment(unix).date(1).hour(23).minute(59).second(59).millisecond(999).add('month', 1).add('day', -1)
              )
              break
            case 2:
              set(
                moment(unix).month(0).date(1).hour(0).minute(0).second(0).millisecond(0),
                moment(unix).month(11).date(31).hour(23).minute(59).second(59).millisecond(999)
              )
              break
            case 3:
              set(moment(unixLeft).millisecond(0), moment(unixRight).millisecond(999))
              break
            case 4:
              set(
                moment(unixLeft).hour(0).minute(0).second(0).millisecond(0),
                moment(unixRight).hour(23).minute(59).second(59).millisecond(999)
              )
              break
            case 5:
              set(
                moment(unixLeft).date(1).hour(0).minute(0).second(0).millisecond(0),
                moment(unixRight).date(1).hour(23).minute(59).second(59).millisecond(999).add('month', 1).add('day', -1)
              )
              break
          }
          console.log({ start, end })
          return { start, end }
        }
        return new Promise((resolve, reject) => {
          if (!import.meta.env.VITE_MOCK) {
            // 创建客户端
            const client = new HisCurveServiceClient(
              new GrpcWebFetchTransport({
                baseUrl: this.$config.gRPC_URL
              })
            )
            const { start, end } = getClock()
            // 请求体对象赋值
            const startClock = SysClock.fromJson(start)
            const endClock = SysClock.fromJson(end)
            const CurveParaData = {
              // // 曲线的时间标志 0-实时 1-昨日 2-上月同日 3-去年同日
              // ucTimeFlag: 0,
              // // 显示计划曲线标志  0-不显示 1-显示
              // ucPlanFlag: 0,
              // 0遥测   1电度
              ucDbType: this.ucDbType,
              // 曲线类型  日曲线 月曲线 趋势曲线 多日曲线  多月曲线
              ucCurveType: this.lineKey,
              cObjectName: key,
              startClock,
              endClock
            }
            if (this.valueType[this.lineKey].length > 0) {
              CurveParaData.sDataType = this.sDataType
            }
            const request = CurvePara.fromJson(CurveParaData)
            console.log(request)
            client
              .queryCurveValue(request)
              .then((res) => {
                console.log('result', res.response.curveValueArray)
                const data = res.response.curveValueArray
                resolve(data)
              })
              .catch((err) => {
                console.log('error eccur.')
                console.log(err)
                console.log(err.code)
                console.log(err.message)
                reject()
              })
          } else {
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .line-chart {
    padding: 16px;
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;
    width: 100%;
    height: 100%;
    .operation {
      display: flex;
      flex-flow: row nowrap;
      gap: 16px;
      width: 100%;
      justify-content: center;
    }
    .line {
      display: flex;
      flex-flow: row nowrap;
      gap: 16px;
      flex: 1;
      .list {
        display: flex;
        flex-flow: column nowrap;
        gap: 8px;
        width: 300px;
        overflow: auto;
        .tree {
          height: 480px;
          border: 2px solid #6b6b6b;
          border-radius: 4px;
          overflow: auto;
        }
      }
      .chart-box {
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        .chart {
          // flex: 0;
        }
        .status {
          // flex: 1;
          .status-line {
            display: flex;
            flex-flow: row nowrap;
            gap: 8px;
          }
        }
      }
    }
  }
</style>
