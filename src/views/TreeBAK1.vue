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
        <!-- <n-input autofocus="true"></n-input> -->
        <!-- <div class="rightHover" v-show="rightClick" :style="{ top: `${popoverTop}px`, left: `${popoverLeft}px` }">
          <div class="rightHoverBtn" @click="reNameBtn"><span>重命名</span></div>
          <div class="rightHoverBtn"><span>123</span></div>
        </div> -->
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
      <!-- <n-button class="controlBtn" v-show="controlShow" @click="searchReport">配置数据库</n-button> -->
      <n-button class="templateBtn" @click="changeControlShow">地址配置</n-button>
      <n-button class="searchBtn" v-show="controlShow" @click="searchReport">查询</n-button>
    </div>
    <n-drawer v-model:show="active" :width="702" placement="right">
      <n-drawer-content title="地址配置">
        <div class="setting-drawer">
          <n-tabs type="segment" v-model:value="dataType" animated>
            <!-- <n-tab-pane name="mysql" tab="MySQL数据库配置">
              <div>
                <div class="setting">
                  <div class="content">
                    <div class="controlPart">
                      <div class="conTitle">数据库名</div>
                      <n-input v-model:value="jsonControl.database" type="text" placeholder="请输入数据库名" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">地址</div>
                      <n-input v-model:value="jsonControl.host" type="text" placeholder="请输入数据库地址" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">端口</div>
                      <n-input v-model:value="jsonControl.port" type="text" placeholder="请输入数据库端口" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">用户名</div>
                      <n-input v-model:value="jsonControl.user" type="text" placeholder="请输入数据库用户名" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">密码</div>
                      <n-input v-model:value="jsonControl.password" type="text" placeholder="请输入数据库密码" />
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane> -->
            <!-- <n-tab-pane name="oracle" tab="Oracle数据库配置">
              <div>
                <div class="setting">
                  <div class="content">
                    <div class="controlPart">
                      <div class="conTitle">连接地址</div>
                      <n-input v-model:value="jsonControl.oracleAddress" type="text" placeholder="请输入数据库地址" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">Oracle客户端路径</div>
                      <n-input v-model:value="jsonControl.oracleLocal" type="text" placeholder="请输入数据库地址" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">用户名</div>
                      <n-input v-model:value="jsonControl.oracleUser" type="text" placeholder="请输入数据库用户名" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">密码</div>
                      <n-input v-model:value="jsonControl.oraclePassword" type="text" placeholder="请输入数据库密码" />
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane> -->

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

            <!-- <n-tab-pane name="kb" tab="人大金仓数据库配置">
              <div>
                <div class="setting">
                  <div class="content">
                    <div class="controlPart">
                      <div class="conTitle">连接地址</div>
                      <n-input v-model:value="jsonControl.kbHost" type="text" placeholder="请输入数据库地址" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">端口号</div>
                      <n-input v-model:value="jsonControl.kbPort" type="text" placeholder="请输入数据库端口号" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">数据库名称</div>
                      <n-input v-model:value="jsonControl.kbDatabase" type="text" placeholder="请输入数据库名称" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">用户名</div>
                      <n-input v-model:value="jsonControl.kbUser" type="text" placeholder="请输入数据库用户名" />
                    </div>
                    <div class="controlPart">
                      <div class="conTitle">密码</div>
                      <n-input v-model:value="jsonControl.kbPassword" type="text" placeholder="请输入数据库密码" />
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane> -->
          </n-tabs>
          <!-- <div class="setting">
            <div class="title">实时库配置</div>
            <div class="content">
              <div class="controlPart">
                <div class="conTitle">地址</div>
                <n-input v-model:value="jsonControl.grpcHost" type="text" placeholder="请输入实时库地址" />
              </div>
              <div class="controlPart">
                <div class="conTitle">端口</div>
                <n-input v-model:value="jsonControl.grpcPort" type="text" placeholder="请输入实时库端口" />
              </div>
            </div>
          </div> -->
          <div class="footerBtn">
            <div class="Btn">
              <n-button class="footChange" v-if="dataType === 'mysql'" type="primary" @click="changeConfig">
                更新并启用MySQL
              </n-button>
              <n-button class="footChange" v-if="dataType === 'oracle'" type="primary" @click="changeOracleConfig">
                更新并启用Oracle
              </n-button>
              <n-button class="footChange" v-if="dataType === 'dm'" type="primary" @click="changeDMConfig">
                更新并启用达梦
              </n-button>
              <n-button class="footChange" v-if="dataType === 'kb'" type="primary" @click="changeKBConfig">
                更新并启用人大金仓
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
  import { ref, reactive, onMounted, watch, onBeforeMount, computed, onUpdated, nextTick } from 'vue'
  import { ipc } from '@/utils/ipcRenderer'
  import { defineComponent, h } from 'vue'
  import cloneDeep from 'lodash/cloneDeep'
  import { useMessage, NIcon, NInput, NButton, useDialog } from 'naive-ui'
  import { Folder, FolderOpenOutline, FileTrayFullOutline } from '@vicons/ionicons5'
  import { FileExcelFilled } from '@vicons/antd'
  import mitts from '../utils/bus'

  // 读取配置数据
  const jsonControl = reactive({
    database: '',
    host: '',
    password: '',
    port: '',
    user: '',
    grpcHost: '',
    grpcPort: '',
    oracleUser: '',
    oraclePassword: '',
    oracleAddress: '',
    oracleLocal: '',
    dmPort: '',
    dmHost: '',
    dmUser: '',
    dmPassword: '',
    kbHost: '',
    kbPort: '',
    kbDatabase: '',
    kbUser: '',
    kbPassword: ''
  })
  // 加载配置
  const loadJsonControl = () => {
    try {
      ipc.send('sqlConfigSend')
      ipc.once('sqlConfigOn', (e, arg) => {
        console.log('Patharg', arg)
        Object.assign(jsonControl, arg)
      })
    } catch (e) {
      console.error('Error fetchingeeeee data:', e)
    }
    console.log('jsonControl', jsonControl)
  }
  // 配置初始化
  onBeforeMount(async () => {
    loadJsonControl()
  })
  onMounted(() => {
    console.log('mounted')
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
      // {
      //   value: 'realData',
      //   label: '实时值'
      // },
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
    (newValue, oldValue) => {
      console.log(`You selected ${newValue}.`)
      const activeObj = {
        yearreport: [true, false, true, true, true, 'year'],
        monthreport: [true, false, false, true, true, 'month'],
        dayreport: [true, false, false, false, true, 'day'],
        realdata: [true, true, true, true, true, 'realData'],
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

  // 日期
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
    (newValue, oldValue) => {
      countEndDay(newValue)
    }
  )
  //计算二月有多少天
  const countDay = (value) => {
    //将传入数据转为数字类型 方便下面判断
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
    //将传入数据转为数字类型 方便下面判断
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
    (newValue, oldValue) => {
      countDay(newValue)
    }
  )
  watch(
    () => start.year,
    (newValue, oldValue) => {
      countDay(end.month)
    }
  )

  // 初始化时间
  const getNowTime = () => {
    const dt = new Date()
    const y = dt.getFullYear()
    const mt = dt.getMonth() + 1
    const day = dt.getDate()
    const h = dt.getHours()
    const m = dt.getMinutes()
    const s = dt.getSeconds()
    //   nowtime.value = y + '-' + mt + '-' + day + ' ' + h + ':' + m
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
    // testTime()
  }

  const testTime = () => {
    start.year = 2025
    end.year = 2025
    start.month = parseInt(2)
    end.month = parseInt(2)
    start.day = parseInt(1)
    end.day = parseInt(3)
    start.hour = parseInt(0)
    end.hour = parseInt(23)
    start.min = parseInt(0)
    end.min = parseInt(59)
    start.sec = parseInt(0)
    end.sec = parseInt(59)
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
      // 返回只包含年报表的数据
      return treeData.data[0]
    } else if (showReportType.value == 'year') {
      return fliterTreeData('年报表')
    } else if (showReportType.value == 'month') {
      return fliterTreeData('月报表')
    } else if (showReportType.value == 'day') {
      return fliterTreeData('日报表')
    } else if (showReportType.value == 'realData') {
      return fliterTreeData('实时统计')
    } else if (showReportType.value == 'customize') {
      return fliterTreeData('customize')
    }
  })

  const fliterTreeData = (name) => {
    const dt = new Date()
    const y = dt.getFullYear()
    const mt = dt.getMonth() + 1
    const day = dt.getDate()

    const ynow = dt.getFullYear() - 1
    const mtnow = dt.getMonth()
    const daynow = dt.getDate() - 1
    console.log('xuanze')
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
    // 返回完整的树数据
    // 过滤树数据
    copyTreeData.forEach((element) => {
      if (name == '实时统计') {
        element.children = element.children.filter((m) => {
          return m.label.includes(name)
        })
      } else if (name == 'customize') {
        copyTreeData = copyTreeData.filter((n) => {
          if (n.label !== '自定义') {
            n.children.forEach((b) => {
              b.children = ''
            })
          }
          return n
        })
      } else {
        element.children.forEach((i) => {
          if (i.children !== undefined) {
            if (name == 'customize') {
              i.children = ''
            } else {
              i.children = i.children.filter((temp) => {
                return temp.label.includes(name)
              })
            }
          }
        })
      }
    })
    return copyTreeData
  }

  //节点内容渲染函数
  let inputRef = ref()
  let nodelabel = (option) => {
    return h(
      'div',
      { class: 'node' },
      option.option.isedit == true && !option.option.children
        ? h(NInput, {
            autofocus: true,
            ref: inputRef,
            size: 'small',
            value: option?.option?.label,
            placeholder: '请输入文件名称',
            onVnodeBeforeMount: () => {
              // 获取当前有焦点的元素
              let focusedElement = document.activeElement
              if (focusedElement) {
                focusedElement.blur()
              }
            },
            onVnodeMounted: () => {
              inputRef.value.focus()
            },
            onUpdateValue: (v) => {
              option.option.label = v
            },
            onChange: (v) => {
              ipc.send('changeFileNameSend', { filePath: option.option.key, newFileName: v })
              option.option.isedit = false
            },
            onBlur: () => {
              option.option.isedit = false
            }
          })
        : option.option.label
    )
  }

  //节点后缀渲染
  const nodesuffix = (option) => {
    if (!option.option.children) {
      return h(
        NButton,
        {
          text: true,
          type: 'info',
          // color: '#007293',
          size: 'tiny',
          onClick: (e) => {
            deltree(option.option.key), e.stopPropagation() //自定义节点删除函数
          }
        },
        { default: () => '删除' }
      )
    } else if (option.option?.children && !option.option?.children[0]?.children) {
      return h(
        NButton,
        {
          text: true,
          type: 'info',
          color: '#007220',
          size: 'tiny',
          textcolor: '#CFFBFF',
          onClick: (e) => addnode(e, option.option.key) //自定义新增节点函数
        },
        { default: () => '+新增' }
      )
    }
  }

  const dialog = useDialog()

  const deltree = (option) => {
    dialog.warning({
      title: '删除',
      content: '你确定删除此文件？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        ipc.send('deleteNodeSend', option)
        message.success('文件已删除')
        ipc.send('getFileList')
        ipc.on('sendFileList', (e, arg) => {
          console.log('sendFileList出发了')
          treeData.data = []
          treeData.data.push(convertToTreeFormat(arg))
        })
      },
      onNegativeClick: () => {
        message.info('删除取消')
      }
    })
    // ipc.send('deleteNodeSend', option)
  }
  let fileConfig = reactive({
    addFileName: null,
    path: ''
  })
  let addFileName = ''
  const addnode = (e, option) => {
    fileConfig.path = option
    dialog.warning({
      title: '提示',
      showIcon: false,
      content: () =>
        h(
          'div',
          {
            class: 'flex flex-col justify-center items-center text-14px'
          },
          [
            // icon
            h('p', '请输入新建文件名称'),
            h(NInput, {
              autofocus: true,
              ref: inputRef,
              size: 'small',
              value: addFileName.value,
              placeholder: '请输入',
              onChange: (v) => {
                addFileName = v
                fileConfig.addFileName = addFileName
              }
            })
          ]
        ),
      positiveText: '新建xlsx文件',
      negativeText: '取消',
      // 弹窗的按钮的属性领用对象的形式可以使用所有按钮属性
      positiveButtonProps: { type: 'primary' },
      onPositiveClick: () => {
        console.log('fileConfig', fileConfig)
        ipc.send('addNodeSend', { addFileName: fileConfig.addFileName, path: fileConfig.path })
        message.success('创建成功')
        ipc.send('getFileList')
        ipc.on('sendFileList', (e, arg) => {
          console.log('sendFileList出发了')
          treeData.data = []
          treeData.data.push(convertToTreeFormat(arg))
        })
      }
    })
    e.stopPropagation()
    // ipcRenderer.send('addNodeSend', option)
  }

  // let dialogVisible = ref('false')
  // let inputValue = ref('')

  // const handleConfirm = () => {
  //   console.log('You entered:', this.inputValue)
  //   dialogVisible = false
  // }
  // const handleCancel = () => {
  //   dialogVisible = false
  // }

  const key = ref()
  // let rightClick = ref(false)
  // let spaceOption = ref({})
  // const popoverTop = ref(0)
  // const popoverLeft = ref(0)
  const nodeProps = ({ option }) => {
    return {
      onClick() {
        // rightClick.value = false
        if (!option.children && !option.disabled) {
          console.log(option)
          mitts.emit('filePath', option.key)
          ipc.send('readExcel', option.key)
          key.value = option.key
        }
      },
      async onContextmenu(event) {
        option.isedit = !option.isedit
        console.log('option', option)
        // rightClick.value = !rightClick.value
        // spaceOption.value = option
        // popoverTop.value = event.clientY
        // popoverLeft.value = event.clientX
        inputRef.value = option
        // console.log('e', e)
      }
    }
  }

  // 树形结构赋值
  const convertToTreeFormat = (dirList) => {
    const result = []
    const convertNode = (node) => {
      const convertedNode = {
        key: node.path, // 使用节点的路径作为 key
        label: node.name, // 使用节点的名称作为 label
        prefix: () => h(NIcon, null, { default: () => h(Folder) })
      }

      if (node.children && node.children.length > 0) {
        convertedNode.children = node.children.map(convertNode)
      } else if (node.name?.includes('.xls')) {
        convertedNode.prefix = () =>
          h(NIcon, null, {
            default: () => h(FileExcelFilled)
          })
      } else {
        convertedNode.disabled = true
      }

      return convertedNode
    }

    dirList.forEach((element) => {
      if (element.path) {
        result.push({
          key: element.path,
          label: element.name,
          //   disabled: true,
          prefix: () => h(NIcon, null, { default: () => h(Folder) }),
          children: element.children.map(convertNode)
        })
      }
    })

    return result
  }

  // 系统配置
  const active = ref(false)
  const changeControlShow = async () => {
    // 重新加载配置
    loadJsonControl()
    dataType.value = localStorage.getItem('dataBaseType')
    active.value = true
    try {
      ipc.send('sqlConfigSend')
      ipc.once('sqlConfigOn', (e, arg) => {
        console.log('Patharg', arg)
        // mysqlConfigData = arg
        Object.assign(jsonControl, arg)
      })
    } catch (e) {
      console.error('Error fetchingeeeee data:', e)
    }
  }
  const cancelChange = () => {
    active.value = false
  }
  // sql切换状态
  const dataType = ref(localStorage.getItem('dataBaseType'))
  console.log('dataType', dataType)
  //将修改的信息发送给主进程 让其更改本地文件
  const changeConfig = () => {
    let sendControl = {
      ...jsonControl
    }
    localStorage.setItem('dataBaseType', 'mysql')
    console.log("localStorage.getItem('dataBaseType')", localStorage.getItem('dataBaseType'))
    ipc.send('dataBaseTypeSend', 'mysql')
    try {
      ipc.send('setDatabaseSend', sendControl)
      ipc.once('setDatabaseOn', (e, arg) => {
        console.log('arg', arg)
        message.success('请重启报表系统')
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }
  }
  const changeDMConfig = () => {
    localStorage.setItem('dataBaseType', 'dm')
    ipc.send('dataBaseTypeSend', 'dm')
    try {
      console.log('进入DM的TRY', localStorage.getItem('dataBaseType'))
      ipc.send('dmTestSend', 'select * from SYSDBA.ats_storedoor')
      // ipc.send('dmTestSend', 'select * from DAT_HisEvent')
      ipc.once('dmTestOn', (e, arg) => {
        console.log('dmTestOn', arg)
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }

    let sendControl = {
      ...jsonControl
    }
    localStorage.setItem('dataBaseType', 'dm')
    console.log("localStorage.getItem('dataBaseType')", localStorage.getItem('dataBaseType'))
    ipc.send('dataBaseTypeSend', 'dm')
    try {
      ipc.send('setDatabaseSend', sendControl)
      ipc.once('setDatabaseOn', (e, arg) => {
        console.log('arg', arg)
        message.success('请重启报表系统')
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }
  }
  const changeKBConfig = () => {
    localStorage.setItem('dataBaseType', 'kb')
    ipc.send('dataBaseTypeSend', 'kb')
    try {
      console.log('进入KB的TRY', localStorage.getItem('dataBaseType'))
      ipc.send('kbTestSend', 'select * from ats_storedoor')
      // ipc.send('dmTestSend', 'select * from DAT_HisEvent')
      ipc.once('kbTestOn', (e, arg) => {
        console.log('kbTestOn', arg)
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }

    let sendControl = {
      ...jsonControl
    }
    localStorage.setItem('dataBaseType', 'kb')
    console.log("localStorage.getItem('dataBaseType')", localStorage.getItem('dataBaseType'))
    ipc.send('dataBaseTypeSend', 'kb')
    try {
      ipc.send('setDatabaseSend', sendControl)
      ipc.once('setDatabaseOn', (e, arg) => {
        console.log('arg', arg)
        message.success('请重启报表系统')
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }
  }

  const changeOracleConfig = () => {
    let sendControl = {
      ...jsonControl
    }
    localStorage.setItem('dataBaseType', 'oracle')
    console.log("localStorage.getItem('dataBaseType')", localStorage.getItem('dataBaseType'))
    ipc.send('dataBaseTypeSend', 'oracle')
    try {
      ipc.send('setDatabaseSend', sendControl)
      ipc.once('setDatabaseOn', (e, arg) => {
        console.log('arg', arg)
        message.success('请重启报表系统')
      })
    } catch (e) {
      console.log(e)
      message.error('更新数据库失败')
    }
  }
  ipc.once('setDatabaseOn', (e, arg) => {
    if (arg.success) {
      console.log('File write successful.')
    } else {
      console.error('File write failed:', arg.error)
    }
  })

  // 获取文件列表
  ipc.send('getFileList')
  ipc.on('sendFileList', (e, arg) => {
    treeData.data = []
    treeData.data.push(convertToTreeFormat(arg))
  })

  // 搜索文件列表
  const searchContent = ref('')
  const pattern = ref('')
  const searchTree = () => {
    searchContent.value = pattern.value
  }

  const searchReport = () => {
    console.log('searchReport')
    localStorage.setItem('startYear', start.year)
    localStorage.setItem('startMonth', parseInt(start.month) >= 10 ? start.month : '0' + start.month)
    localStorage.setItem('startDay', parseInt(start.day) >= 10 ? start.day : '0' + start.day)
    console.log("localStorage.getItem('startDay')tree", localStorage.getItem('startDay'))
    localStorage.setItem('startHour', parseInt(start.hour) >= 10 ? start.hour : '0' + start.hour)
    localStorage.setItem('startMinu', parseInt(start.min) >= 10 ? start.min : '0' + start.min)
    localStorage.setItem('startSec', parseInt(start.sec) >= 10 ? start.sec : '0' + start.sec)
    localStorage.setItem('endYear', end.year)
    localStorage.setItem('endMonth', parseInt(end.month) >= 10 ? end.month : '0' + end.month)
    localStorage.setItem('endDay', parseInt(end.day) >= 10 ? end.day : '0' + end.day)
    localStorage.setItem('endHour', parseInt(end.hour) >= 10 ? end.hour : '0' + end.hour)
    localStorage.setItem('endMinu', parseInt(end.min) >= 10 ? end.min : '0' + end.min)
    localStorage.setItem('endSec', parseInt(end.sec) >= 10 ? end.sec : '0' + end.sec)
    console.log('end.day', end.day)
    console.log('start.day', start.day)
    if (end.day - start.day !== 0) {
      let days = end.day - start.day
      localStorage.setItem('batchNum', days)
      console.log("localStorage.setItem('batchNum', days)", localStorage.getItem('batchNum'))
      localStorage.setItem('batchFlag', 1)
    } else {
      localStorage.setItem('batchFlag', 0)
    }
    mitts.emit('callSearchCell')
  }
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
    @media only screen and (min-width: 1920px) and (min-height: 1080px) {
      .tree {
        overflow: hidden;
        width: 500px;
        min-width: 320px;
        height: calc(100vh - 320px);
        border: 1px solid rgb(171, 173, 179);
        margin-left: 80px;
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
        bottom: 16px;
        left: 20px;
        border: 1px solid rgb(171, 173, 179);
      }
      .searchBtn {
        width: 55px;
        height: 24px;
        border: 1px solid rgb(171, 173, 179);
        position: relative;
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
      // background: red;
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
