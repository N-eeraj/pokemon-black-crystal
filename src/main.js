import { createApp } from 'vue'
import App from './js/App.vue'
import router from './js/router'
import store from './js/store'

createApp(App).use(store).use(router).mount('#app')
