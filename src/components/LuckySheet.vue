<template>
  <n-message-provider>
    <div class="cover">
      <div id="luckysheet" ></div>
    </div>
  </n-message-provider>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick } from 'vue'

let luckysheetInstance = null

// 初始化LuckySheet的函数
const initLuckysheet = async () => {
  try {
    // 确保DOM已经渲染
    await nextTick()
    // 初始化配置
    const options = {
      container: 'luckysheet',
      showinfobar: false
    }
    
    // 创建新实例
    luckysheetInstance = luckysheet.create(options)
  } catch (e) {
    console.error('Error initializing luckysheet:', e)
  }
}

onMounted(() => {
  
  // 组件挂载后初始化
  initLuckysheet()
})

onBeforeUnmount(() => {
  // 组件卸载前清理
  if (luckysheetInstance) {
    try {
      window.luckysheet.destroy()
    } catch (e) {
      console.error('Error destroying luckysheet:', e)
    }
    luckysheetInstance = null
  }
})
</script>

<style scoped>
.cover {
  height: 100%;
  width: 1500px;
  position: relative;
}
:deep(.luckysheet){
    width: 100% !important;
    height: 100% !important;
  }
  :deep(luckysheet-cell-main ){
    width:100% !important
  }

#luckysheet {
    position: relative;
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 98%;
    top: 0;
    bottom: 0;
  }
  :deep(.luckysheet-cell-sheettable){
    width: 100% !important;
  }
  :deep( .luckysheet-cell-flow ){
    width: 100% !important;
  }
  :deep(.luckysheetsheetchange){
    width: 100% !important;
  }
</style>
