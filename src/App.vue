<template>
  <div class="main">
    <n-dialog-provider>
      <n-message-provider>
        <div class="layout">
          <div class="header">
            <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" @update:value="handleMenuClick" />
          </div>
          <div class="content">
            <Tree />
            <router-view />
          </div>
        </div>
      </n-message-provider>
    </n-dialog-provider>
  </div>
</template>

<script setup>
  import { h, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Tree from '@/views/Tree.vue'

  
  const router = useRouter()
  const activeKey = ref('excel')
  
  // function renderIcon(icon) {
  //   return () => h(NIcon, null, { default: () => h('i', { class: icon }) })
  // }
  
  const menuOptions = [
    {
      label: '表格',
      key: 'excel',
      // icon: renderIcon('icon-table')
    },
    {
      label: '图表',
      key: 'chart',
      // icon: renderIcon('icon-chart')
    }
  ]
  
  const handleMenuClick = (key) => {
    router.push(`/${key}`)
  }
</script>
<style scoped>
  .main {
    height: 100vh;
    width: 100vw;
    position: absolute;
    left: 0px;
    top: 0px;
    overflow: hidden;
  }
  
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  
  .header {
    width: 100%;
    z-index: 100;
  }
  
  .content {
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    overflow: hidden;
  }
</style>
