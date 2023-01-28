import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/js/router/routes'
import { setPageTitle } from '@/js/router/metaSetter'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(({ meta }) => {
    const { title } = meta
    setPageTitle(title)
})

export default router