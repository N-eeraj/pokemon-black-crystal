import { createApp } from 'vue'
import App from '@/js/App.vue'
import router from '@/js/router'
import store from '@/js/store/store'

import { toTitleCase } from '@/js/mixins/common'

const app = createApp(App)

app.config.globalProperties.$filters = { toTitleCase }

app.use(store).use(router).mount('#app')