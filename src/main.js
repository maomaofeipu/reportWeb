import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import Router from './router/index'
import Print from 'vue3-print-nb'
import $ from 'jquery'

//引入
const app = createApp(App)
app.use(Print)
app.use(naive).use(Router).mount('#app')
window.$ = $
window.jQuery = $

