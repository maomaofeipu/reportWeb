<template>
  <div class="back">
    <div class="tree">
      <n-scrollbar>
        <n-tree
          class="nTree"
          block-line
          expand-on-click
          :data="filteredTreeData"
          :pattern="searchContent"
          :node-props="nodeProps"
          :on-update:expanded-keys="updatePrefixWithExpaned"
          :render-label="nodelabel"
          :render-suffix="nodesuffix"
        />
      </n-scrollbar>
    </div>
    <div class="searchTree" v-show="controlShow">
      <n-input class="search" v-model:value="pattern" placeholder="" />
      <n-button class="searchBtn" @click="searchTree">搜索</n-button>
    </div>
    <div class="divider" v-show="controlShow">
      <n-divider />
    </div>
    <div class="radios" v-show="controlShow">
      <n-radio-group v-model:value="radioValue" name="radiogroup">
        <n-space>
          <n-radio v-for="song in songs" :key="'radio' + song.value" :value="song.value">
            {{ song.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </div>
    <div class="timePicker" v-show="controlShow">
      <div class="timeChoosen">
        <span class="timeChoosenText">开始</span>
        <div class="timeDiv">
          <n-input-number class="longInput" :default-value="1075" :disabled="yearDisable" v-model:value="start.year" />
          <span>年</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="3"
            :min="1"
            :max="12"
            :disabled="monthDisable"
            v-model:value="start.month"
          />
          <span>月</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="24"
            :min="1"
            :max="startMaxDay"
            :disabled="dayDisable"
            v-model:value="start.day"
          />
          <span>日</span>
        </div>
        <div class="hourDiv">
          <n-input-number
            class="longInput"
            :default-value="1075"
            :min="0"
            :max="23"
            :disabled="hmsDisable"
            v-model:value="start.hour"
          />
          <span>时</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="3"
            :min="0"
            :max="59"
            :disabled="hmsDisable"
            v-model:value="start.min"
          />
          <span>分</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="24"
            :min="0"
            :max="59"
            :disabled="hmsDisable"
            v-model:value="start.sec"
          />
          <span>秒</span>
        </div>
      </div>
      <div class="timeChoosen endTimeChoosen">
        <span class="timeChoosenText">结束</span>
        <div class="timeDiv">
          <n-input-number class="longInput" :default-value="1075" :disabled="endDisable" v-model:value="end.year" />
          <span>年</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="3"
            :min="1"
            :max="12"
            :disabled="endDisable"
            v-model:value="end.month"
          />
          <span>月</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="24"
            :min="1"
            :max="endMaxDay"
            :disabled="endDisable"
            v-model:value="end.day"
          />
          <span>日</span>
        </div>
        <div class="hourDiv">
          <n-input-number
            class="longInput"
            :default-value="1075"
            :min="0"
            :max="23"
            :disabled="endDisable"
            v-model:value="end.hour"
          />
          <span>时</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="3"
            :min="0"
            :max="59"
            :disabled="endDisable"
            v-model:value="end.min"
          />
          <span>分</span>
        </div>
        <div class="timeDiv">
          <n-input-number
            class="shortInput"
            :default-value="24"
            :min="0"
            :max="59"
            :disabled="endDisable"
            v-model:value="end.sec"
          />
          <span>秒</span>
        </div>
      </div>
    </div>

    <div class="bottomBtn">
      <n-button class="templateBtn" @click="changeControlShow">地址配置</n-button>
      <n-button class="searchBtn" v-show="controlShow" @click="searchReport">查询</n-button>
    </div>
    <n-drawer v-model:show="active" :width="702" placement="right">
      <n-drawer-content title="地址配置">
        <div class="setting-drawer">
          <n-tabs type="segment" v-model:value="dataType" animated>
            <n-tab-pane name="dm" tab="达梦数据库配置">
              <div>
                <div class="setting">
                  <div class="content">
                    <div class="controlPart">
                      <div class="conTitle">连接地址</div>
                      <n-input v-model:value="jsonControl.dmHost" type="text" placeholder="请输入数据库地址" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">端口号</div>
                      <n-input v-model:value="jsonControl.dmPort" type="text" placeholder="请输入数据库端口号" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">用户名</div>
                      <n-input v-model:value="jsonControl.dmUser" type="text" placeholder="请输入数据库用户名" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">密码</div>
                      <n-input v-model:value="jsonControl.dmPassword" type="text" placeholder="请输入数据库密码" />
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane>
          </n-tabs>
          <div class="footerBtn">
            <div class="Btn">
              <n-button class="footChange" v-if="dataType === 'dm'" type="primary" @click="changeDMConfig">
                更新并启用达梦
              </n-button>
              <n-button style="margin-left: -3px" @click="cancelChange" type="tertiary">取消</n-button>
            </div>
            <div class="msg">确认后请重启系统，确保数据库更新</div>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onBeforeMount, computed } from 'vue'
import { defineComponent, h } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { useMessage, NIcon } from 'naive-ui'
import { Folder, FolderOpenOutline } from '@vicons/ionicons5'

// 数据库配置
const jsonControl = reactive({
  dmPort: '',
  dmHost: '',
  dmUser: '',
  dmPassword: ''
})

// 加载配置
const loadJsonControl = async () => {
  try {
    const response = await fetch('/api/config')
    const data = await response.json()
    Object.assign(jsonControl, data)
  } catch (e) {
    console.error('Error fetching config:', e)
  }
}

// 配置初始化
onBeforeMount(async () => {
  // await loadJsonControl()
})

onMounted(() => {
  // 初始化时间
  getNowTime()
})

// radio定义
const radioValue = ref('all')
const songs = ref(
  [
    {
      value: 'yearReport',
      label: '年报表'
    },
    {
      value: 'monthReport',
      label: '月报表'
    },
    {
      value: 'dayReport',
      label: '日报表'
    },
    {
      value: 'customize',
      label: '自定义'
    },
    {
      value: 'all',
      label: '全部'
    }
  ].map((s) => {
    s.value = s.value.toLowerCase()
    return s
  })
)

// 监听radio变化，更新日期输入框状态
const showReportType = ref('all')
watch(
  () => radioValue.value,
  (newValue) => {
    const activeObj = {
      yearreport: [true, false, true, true, true, 'year'],
      monthreport: [true, false, false, true, true, 'month'],
      dayreport: [true, false, false, false, true, 'day'],
      customize: [false, false, false, false, false, 'customize'],
      all: [false, false, false, false, false, 'all']
    }
    const changeDisable = (arr) => {
      endDisable.value = arr[0]
      yearDisable.value = arr[1]
      monthDisable.value = arr[2]
      dayDisable.value = arr[3]
      hmsDisable.value = arr[4]
      showReportType.value = arr[5]
    }
    changeDisable(activeObj[newValue])
  }
)

// 日期相关
const endDisable = ref(false)
const yearDisable = ref(false)
const monthDisable = ref(false)
const dayDisable = ref(false)
const hmsDisable = ref(false)
const controlShow = ref(true)
const startMaxDay = ref('null')
const endMaxDay = ref('null')
const start = reactive({
  year: null,
  month: null,
  day: null,
  hour: null,
  min: null,
  sec: null
})
const end = reactive({
  year: null,
  month: null,
  day: null,
  hour: null,
  min: null,
  sec: null
})

watch(
  () => end.month,
  (newValue) => {
    countEndDay(newValue)
  }
)

//计算二月有多少天
const countDay = (value) => {
  if (typeof value === 'string') {
    value = parseInt(value)
  }
  if ([1, 3, 5, 7, 8, 10, 12].includes(value)) {
    startMaxDay.value = 31
  } else {
    startMaxDay.value = 30
  }
  if (value == 2) {
    if (start.year % 4 !== 0) {
      startMaxDay.value = 28
    } else {
      startMaxDay.value = 29
    }
  }
}

const countEndDay = (value) => {
  if (typeof value === 'string') {
    value = parseInt(value)
  }
  if ([1, 3, 5, 7, 8, 10, 12].includes(value)) {
    endMaxDay.value = 31
  } else {
    endMaxDay.value = 30
  }
  if (value == 2) {
    if (end.year % 4 !== 0) {
      endMaxDay.value = 28
    } else {
      endMaxDay.value = 29
    }
  }
}

watch(
  () => start.month,
  (newValue) => {
    countDay(newValue)
  }
)

watch(
  () => start.year,
  () => {
    countDay(end.month)
  }
)

// 初始化时间
const getNowTime = () => {
  const dt = new Date()
  const y = dt.getFullYear()
  const mt = dt.getMonth() + 1
  const day = dt.getDate()
  start.year = parseInt(y)
  end.year = parseInt(y)
  start.month = parseInt(mt)
  end.month = parseInt(mt)
  start.day = parseInt(day - 1)
  end.day = parseInt(day)
  start.hour = parseInt(20)
  end.hour = parseInt(20)
  start.min = parseInt(0)
  end.min = parseInt(0)
  start.sec = parseInt(0)
  end.sec = parseInt(0)
}

const message = useMessage()
const updatePrefixWithExpaned = (_keys, _option, meta) => {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline)
        })
      break
    case 'collapse':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder)
        })
      break
  }
}

// 树形结构逻辑
const treeData = reactive({
  data: []
})

const filteredTreeData = computed(() => {
  if (showReportType.value == 'all') {
    return treeData.data[0]
  } else if (showReportType.value == 'year') {
    return filterTreeData('年报表')
  } else if (showReportType.value == 'month') {
    return filterTreeData('月报表')
  } else if (showReportType.value == 'day') {
    return filterTreeData('日报表')
  } else if (showReportType.value == 'customize') {
    return filterTreeData('customize')
  }
})

const filterTreeData = (name) => {
  const dt = new Date()
  const y = dt.getFullYear()
  const mt = dt.getMonth() + 1
  const day = dt.getDate()

  const ynow = dt.getFullYear() - 1
  const mtnow = dt.getMonth()
  const daynow = dt.getDate() - 1

  if (name == '年报表') {
    start.year = parseInt(ynow)
    start.month = parseInt(mt)
    start.day = parseInt(day)
  } else if (name == '月报表') {
    start.year = parseInt(y)
    start.month = parseInt(mtnow)
    start.day = parseInt(day)
  } else if (name == '日报表') {
    start.year = parseInt(y)
    start.month = parseInt(mt)
    start.day = parseInt(daynow)
  }

  let copyTreeData = cloneDeep(treeData.data[0])
  return copyTreeData
}

// 节点属性
const nodeProps = ({ option }) => {
  return {
    onClick() {
      if (!option.children && !option.disabled) {
        console.log(option)
        // 这里需要改为发送HTTP请求获取数据
        fetch(`/api/excel?path=${option.key}`)
          .then(response => response.json())
          .then(data => {
            // 处理Excel数据
            console.log(data)
          })
          .catch(error => {
            console.error('Error:', error)
          })
      }
    },
    onContextmenu(event) {
      option.isedit = !option.isedit
      console.log('option', option)
    }
  }
}

// 获取文件列表
const getFileList = async () => {
  try {
    const response = await fetch('/api/files')
    const data = await response.json()
    treeData.data = []
    treeData.data.push(convertToTreeFormat(data))
  } catch (error) {
    console.error('Error fetching file list:', error)
  }
}

// 搜索相关
const searchContent = ref('')
const pattern = ref('')
const searchTree = () => {
  searchContent.value = pattern.value
}

// 搜索报表
const searchReport = async () => {
  const searchParams = {
    startYear: start.year,
    startMonth: parseInt(start.month) >= 10 ? start.month : '0' + start.month,
    startDay: parseInt(start.day) >= 10 ? start.day : '0' + start.day,
    startHour: parseInt(start.hour) >= 10 ? start.hour : '0' + start.hour,
    startMin: parseInt(start.min) >= 10 ? start.min : '0' + start.min,
    startSec: parseInt(start.sec) >= 10 ? start.sec : '0' + start.sec
  }

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchParams)
    })
    const data = await response.json()
    console.log('Search results:', data)
  } catch (error) {
    console.error('Error searching reports:', error)
    message.error('搜索失败')
  }
}

// 数据库配置相关
const active = ref(false)
const dataType = ref('dm')

const changeControlShow = () => {
  active.value = true
}

const cancelChange = () => {
  active.value = false
}

const changeDMConfig = async () => {
  try {
    const response = await fetch('/api/config/dm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonControl)
    })
    const data = await response.json()
    if (data.success) {
      message.success('配置更新成功，请重启系统')
    } else {
      message.error('更新数据库失败')
    }
  } catch (error) {
    console.error('Error updating config:', error)
    message.error('更新数据库失败')
  }
}

// 初始化获取文件列表
onMounted(() => {
  // getFileList()
})
</script>

<style lang="less" scoped>
  .back {
    width: 500px;
    min-width: 345px;
    display: flex;
    flex-direction: column;
    align-items: center;
    :deep(.n-scrollbar > .n-scrollbar-container) {
      background: rgb(255, 255, 255);
    }
    .tree {
      overflow: hidden;
      width: calc(50vh - 130px);
      min-width: 320px;
      height: calc(100vh - 320px);
      border: 1px solid rgb(171, 173, 179);
      .nTree {
        padding: 0 8px;
      }
    }
    .searchTree {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .search {
        width: 202px;
        height: 22px;
        border: 1px solid rgb(171, 173, 179);
        text-align: left;
      }
      :deep(.n-input .n-input__input-el) {
        height: 20px;
      }
      .searchBtn {
        width: 85px;
        height: 24px;
        border: 1px solid rgb(171, 173, 179);
      }
    }
    .updateBtn {
      width: 100px;
      height: 20px;
      border: 1px solid rgb(171, 173, 179);
      margin-top: 10px;
    }
    .divider {
      width: calc(50vh - 130px);
      min-width: 320px;
      height: 40px;
      margin-top: -20px;
      text-align: center;
      :deep(.n-divider .n-divider__line) {
        --n-color: rgb(160, 160, 160);
      }
    }
    .radios {
      width: 290px;
      position: relative;
      left: -16px;
      :deep(.n-radio .n-radio__dot-wrapper) {
        width: 12px;
      }
      :deep(.n-radio .n-radio__dot) {
        width: 12px;
        height: 12px;
        border: 1px solid rgb(171, 173, 179);
      }
      :deep(.n-radio .n-radio__label) {
        font-size: 12px;
        margin-top: 3px;
      }
    }
    .timePicker {
      padding: 0 8px;
      font-size: 12px;
      span {
        margin-top: 3px;
      }
      :deep(.n-input) {
        height: 22px;
      }
      .timeChoosen {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .timeDiv {
          display: flex;
          margin-left: 12px;
          margin-bottom: 3px;
        }
        .hourDiv {
          display: flex;
          margin-left: 36px;
        }
        .longInput {
          width: 85px;
          height: 22px;
          border: 1px solid rgb(171, 173, 179);
          margin-right: 3px;
        }
        .shortInput {
          width: 63px;
          height: 22px;
          border: 1px solid rgb(171, 173, 179);
          margin-right: 3px;
        }
        .n-input {
          height: 12px;
        }
        .timeChoosenText {
          position: relative;
          top: 3px;
        }
      }
      .endTimeChoosen {
        margin-top: 12px;
      }
      :deep(.n-input .n-input__input-el) {
        height: 22px;
        font-size: 12px;
      }
      :deep(.n-input .n-input__suffix) {
        margin-top: 3px;
        .n-button {
          width: 12px;
          height: 9px;
          .n-base-icon svg {
            height: 0.8rem;
            width: 0.8rem;
          }
        }
      }
    }
    .bottomBtn {
      width: 100%;
      margin-top: 6px;
      display: flex;
      .templateBtn {
        width: 155px;
        height: 24px;
        position: absolute;
        bottom: 3px;
        left: 20px;
        border: 1px solid rgb(171, 173, 179);
      }
      .searchBtn {
        width: 55px;
        height: 24px;
        border: 1px solid rgb(171, 173, 179);
        position: relative;
        bottom: 3px;
        left: 260px;
      }
    }
  }

  .tableTmep {
    width: 300px;
    height: 300px;
  }
  .setting-drawer {
    display: flex;
    flex-flow: column nowrap;
    gap: 24px;
    .setting {
      .title {
        font-size: 24px;
      }
      .content {
        padding-left: 16px;
        .controlPart {
          display: flex;
          margin-top: 20px;
          .conTitle {
            font-size: 16px;
            width: 200px;
          }
        }
      }
    }
  }

  .footerBtn {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    .Btn {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
      gap: 32px;
    }
    .msg {
      font-size: 12px;
      margin-top: 10px;
      color: rgb(121, 28, 28);
      margin-right: 5px;
    }
  }
  .rightHover {
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid rgb(171, 173, 179);
    width: 105px;
    background: rgb(243, 243, 243);
    z-index: 99999;
    opacity: 1;

    .rightHoverBtn {
      width: 100%;
      span {
        display: block;
        width: 100%;
      }
    }
    .rightHoverBtn :hover {
      background: rgb(231, 245, 238);
      cursor: pointer;
    }
  }
</style>