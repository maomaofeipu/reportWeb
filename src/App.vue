<template>
  <div class="main">
    <n-dialog-provider>
      <n-message-provider>
        <Tree />
        <Excel />
      </n-message-provider>
    </n-dialog-provider>

  </div>
</template>
<script setup>
  import Tree from '@/views/Tree.vue'
  import Excel from '@/views/Excel.vue'
</script>
<style scoped>
  .main {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: hidden;
  }
</style>
