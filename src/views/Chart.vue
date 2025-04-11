<template>
  <div class="chart">
    <div class="operation">
      <n-select v-model:value="lineKey" @update:value="lineChange" style="width: 150px" :options="lineTypeOptions" />
      <n-date-picker
        v-if="lineKey === 0"
        v-model:value="pickerValue"
        type="date"
        format="yyyy-MM-dd"
        @update:value="pickerChange"
        placeholder="请选择日期"
      />
      <n-date-picker
        v-if="lineKey === 1"
        v-model:value="pickerValue"
        type="month"
        format="yyyy年MM月"
        @update:value="pickerChange"
        placeholder="请选择月份"
      />
      <n-date-picker
        v-if="lineKey === 2"
        v-model:value="pickerValue"
        type="year"
        format="yyyy年"
        @update:value="pickerChange"
        placeholder="请选择年份"
      />
      <n-date-picker
        v-if="[3, 4, 5].includes(lineKey)"
        v-model:value="rangeValue"
        type="daterange"
        :format="rangeType[lineKey]?.format"
        @update:value="handleChange"
      />
      <n-select
        v-if="valueType[lineKey].length > 0"
        v-model:value="sDataType"
        style="width: 150px"
        :options="valueTypeOptions"
      />
    </div>
    <div class="line">
      <div class="list">
        <n-select v-model:value="ucDbType" @update:value="seachTransformer" style="width: 100%" :options="dbTypeOptions" />
        <n-select
          v-model:value="stationSelect"
          @update:value="seachTransformer"
          style="width: 100%"
          :options="stationOptions"
        />
        <div class="tree" :style="{ height: [0, 4].includes(-1) ? '480px' : '520px' }">
          <n-tree
            block-line
            checkable
            :checked-keys="selectedKeys"
            @update:checked-keys="selectLeaf"
            :data="treeDataFormatted"
          />
        </div>
        <n-button type="primary" @click="add">增加曲线</n-button>
        <n-button type="error" @click="del">删除全部曲线</n-button>
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
  <!-- <div>
    123
  </div> -->
</template>

<script setup>
import { ref, reactive, onMounted, computed,nextTick } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { initCurveObjSelList, mockLineData } from '/mock/mock-data.js'

// echarts配置
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

// 图表相关数据
const selectLine = ref(0)
const chartData = ref([])
const chartTime = ref([])
const chartTemp = ref(null)
const chartColor = [
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
]

// 曲线类型
const lineKey = ref(0)
const pickerValue = ref(1183135260000)
const mode = ref(['month', 'month'])
const rangeValue = ref([dayjs(), dayjs()])
const ucDbType = ref(0)
const sDataType = ref(0)
const stationList = ref([])
const stationSelect = ref('')

// 曲线类型选项
const lineType = ['日曲线', '月曲线', '年曲线', '趋势曲线', '多日曲线', '多月曲线']
const lineTypeOptions = lineType.map((label, value) => ({ label, value }))

// 数据类型选项
const valueType = [
  ['采样值', '最大值', '最小值'],
  ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值'],
  ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值'],
  [],
  ['采样值', '最大值', '最小值'],
  ['平均值', '最大值', '最小值', '实际平均值', '实际最大值', '实际最小值']
]

const valueTypeOptions = computed(() => {
  return valueType[lineKey.value].map((label, value) => ({ label, value }))
})

// 数据库类型选项
const dbTypeOptions = [
  { label: '遥测', value: 0 },
  { label: '电度', value: 1 }
]

// 站点选项
const stationOptions = computed(() => {
  return stationList.value.map(item => ({
    label: item.subStationDesc,
    value: item.subStationName
  }))
})

// 日期范围类型
const rangeType = {
  3: {
    showTime: true,
    format: 'yyyy-MM-dd HH:mm:ss'
  },
  4: {
    showTime: false,
    format: 'yyyy-MM-dd'
  },
  5: {
    showTime: false,
    format: 'yyyy年MM月'
  }
}

// 树形结构数据
const selectIndex = ref([])
const selectedKeys = ref([])
const treeData = ref([])
const chart = ref(null)

// 格式化树形数据以适配NaiveUI
const treeDataFormatted = computed(() => {
  return treeData.value.map(item => ({
    key: item.key,
    label: item.title,
    disabled: item.isSelect
  }))
})

// 选择树节点
function selectLeaf(keys) {
  selectIndex.value = []
  selectedKeys.value = []
  keys.forEach((key) => {
    const index = treeData.value.findIndex((v) => v.key === key && !v.isSelect)
    if (index !== -1) {
      selectIndex.value.push(index)
      selectedKeys.value.push(key)
    }
  })
}

// 添加曲线
function add() {
  const changeDatetime = (time) => {
    const formatArr = ['HH:mm:ss', 'MM月DD日', 'MM月', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD', 'YYYY年MM月']
    const date = dayjs()
      .year(time.year)
      .month(time.month - 1)
      .date(time.day)
      .hour(time.hour)
      .minute(time.minute)
      .second(time.second)
      .millisecond(time.msecond)
    return date.format(formatArr[lineKey.value])
  }
  
  selectIndex.value.forEach((index) => {
    const select = treeData.value[index]
    const type = valueType[lineKey.value][sDataType.value]
    if (option.series.findIndex((v) => v.name === select.title + '-' + type) === -1 && option.series.length < 12) {
      // 使用模拟数据替代GRPC请求
      const res = mockLineData()
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
      console.log(timeArr, series)
      option.xAxis.data = timeArr
      option.series = [...option.series, ...series]
      console.log("添加曲线chart.value297",chartTemp.value)
      console.log("添加曲线chart.value29",chartTemp.value)
      option && chartTemp.value.setOption(option)
      selectIndex.value = []
      selectedKeys.value = []
      chartData.value = option.series
      chartTime.value = timeArr
    }
  })
}

// 删除所有曲线
function del() {
  treeData.value.forEach((v) => {
    v.isSelect = false
  })
  option.xAxis.data = []
  option.series = []
  console.log("删除:chart.value314",chartTemp.value)
  option && chartTemp.value.setOption(option, true)
  selectIndex.value = []
  selectedKeys.value = []
  selectLine.value = 0
  chartData.value = []
}

// 初始化图表
async function initChart() {
  await nextTick() // 保证 DOM 已挂载

  const chartDom = document.getElementById('chart')
  if (!chartDom) {
    console.warn("Chart DOM not found!")
    return
  }

  const chartOption = JSON.parse(JSON.stringify(option)) // 深拷贝
  chartOption.tooltip.formatter = (data) => {
    console.log(data)
    selectLine.value = data[0].dataIndex
    return ''
  }
  chartOption.color = chartColor

  chartTemp.value = echarts.init(chartDom)
  chartTemp.value = chartTemp.value
  console.log("初始化:chart.value341", chartTemp.value)

  chartTemp.value.setOption(chartOption)
  console.log("chartValue344",chartTemp.value)

  // ResizeObserver 自动调整图表大小
  const observer = new ResizeObserver(() => {
    chartTemp.value?.resize()
    console.log("chartValue349",chartTemp.value)
  })
  observer.observe(chartDom)
}

// 曲线类型变更
function lineChange(val) {
  del()
  sDataType.value = 0
  if ([3, 4].includes(val)) {
    mode.value = ['date', 'date']
  }
  if (val === 5) {
    mode.value = ['month', 'month']
  }
}

// 日期范围变更
function handleChange(value) {
  console.log(value)
  rangeValue.value = value
}

// 日期选择变更
function pickerChange(val) {
  console.log(val)
  pickerValue.value = val
  if (val === null) {
    pickerValue.value = dayjs()
  }
}

// 初始化站点数据
function initStation() {
  // 使用模拟数据
  stationList.value = [
    { subStationName: 'aa', subStationDesc: '变电站A' },
    { subStationName: 'bbb', subStationDesc: '变电站B' },
    { subStationName: 'ccc', subStationDesc: '变电站C' }
  ]
  stationSelect.value = stationList.value[0].subStationName
  seachTransformer()
}

// 搜索变压器
function seachTransformer() {
  selectedKeys.value = []
  // 使用模拟数据
  const data = initCurveObjSelList()
  treeData.value = []
  data.forEach((v) => {
    const obj = { title: v.objDesc, key: v.objName, isSelect: false, data: [] }
    treeData.value.push(obj)
  })
}

onMounted(() => {
  initStation()
  initChart()
})
</script>

<style lang="less" scoped>
  .chart {
    padding: 16px;
    display: flex;
    flex-flow: column nowrap;
    gap: 16px;
    width: 100%;
    min-height: 525px;
    
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
          overflow: auto;
          max-height: 150px;
          min-width: 100px;
          width:1100px;
          status-line {
            display: flex;
            flex-flow: row nowrap;
            gap: 8px;
          }
        }
      }
    }
  }
</style>