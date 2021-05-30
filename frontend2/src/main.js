import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router  from './router'
import store from '@/store' //To install Vuex to a Vue instance, pass the store instead of Vuex.

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')
