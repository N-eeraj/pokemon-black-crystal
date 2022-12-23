import { createApp } from 'vue'
import App from './js/App.vue'
import router from './js/router'
import store from './js/store/store'

const app = createApp(App)

app.config.globalProperties.$filters = {
    toTitleCase: text => {
        return text
            .split(' ')
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(' ')
    }
}

app.use(store).use(router).mount('#app')