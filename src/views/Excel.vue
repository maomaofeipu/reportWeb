<template>
  <div class="excel">
    <LuckySheet />
  </div>
</template>

<script setup>
  import LuckySheet from '@/components/LuckySheet.vue'
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
</style>
