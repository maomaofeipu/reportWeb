<template>
  <div class="excel">
    <div class="layout">
        <div class="content">
          <Tree />
          <LuckySheet />
        </div>
    </div>

  </div>
</template>

<script setup>
  import LuckySheet from '@/components/LuckySheet.vue'
    import Tree from '@/views/Tree.vue'
</script>

<style lang="less" scoped>
  .excel {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-flow: column nowrap;
    // background: rgba(133, 120, 120, 0.534);
  }
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  

  .content {
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    overflow: hidden;
    height: 100%;
    // width: 100%;
  }
</style>
