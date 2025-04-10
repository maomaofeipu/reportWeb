// 模拟数据
export function initCurveObjSelList() {
  return [
    { objName: 'transformer1', objDesc: '变压器1' },
    { objName: 'transformer2', objDesc: '变压器2' },
    { objName: 'transformer3', objDesc: '变压器3' },
    { objName: 'transformer4', objDesc: '变压器4' },
    { objName: 'transformer5', objDesc: '变压器5' },
    { objName: 'transformer6', objDesc: '变压器6' },
    { objName: 'transformer7', objDesc: '变压器7' },
    { objName: 'transformer8', objDesc: '变压器8' },
    { objName: 'transformer9', objDesc: '变压器9' },
    { objName: 'transformer10', objDesc: '变压器10' }
  ]
}

// 模拟曲线数据
export function mockLineData() {
  const data = []
  const now = new Date()
  
  // 生成24小时的数据点
  for (let i = 0; i < 24; i++) {
    data.push({
      dfValue: Math.random() * 100 + 50, // 50-150之间的随机值
      time: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        wday: now.getDay(),
        hour: i,
        minute: 0,
        second: 0,
        msecond: 0
      }
    })
  }
  
  return data
}