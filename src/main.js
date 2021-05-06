import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
import {resetForm} from './utils/james'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Avue);

Vue.prototype.resetForm = resetForm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
