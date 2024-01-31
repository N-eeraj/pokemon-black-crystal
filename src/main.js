import { createApp } from 'vue'
import App from '@/js/App.vue'
import router from '@/js/router'
import store from '@/js/store/store'

import { toTitleCase, numberFormat } from '@/js/mixins/common'
import './registerServiceWorker'

const app = createApp(App)

app.config.globalProperties.$filters = { toTitleCase, numberFormat }

app.use(store).use(router).mount('#app')