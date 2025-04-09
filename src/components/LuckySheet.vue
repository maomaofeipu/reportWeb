<template>
  <n-message-provider>
    <div class="cover">
      <div id="luckysheet" ></div>
    </div>
  </n-message-provider>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const options = {
    container: 'luckysheet',
    showinfobar: false
  }
  window.luckysheet.create(options)
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
