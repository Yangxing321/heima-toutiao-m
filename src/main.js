import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './utils/dayjs'

// 引入字体图标
import '@/styles/index.less'
import '@/styles/iconfont/iconfont.css'
import '@/styles/iconfont/iconfont.js'
// 引入vant  @latest-v2
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入amfe-flexible 动态设置 REM 基准值
import 'amfe-flexible'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
