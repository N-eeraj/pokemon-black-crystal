import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import OnboardingView from '../views/OnboardingView.vue'
import PageNotFound from '../views/PageNotFound.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomeView
	},
	{
		path: '/welcome',
		name: 'Welcome',
		component: OnboardingView
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/page-not-found',
	},
	{
		path: '/page-not-found',
		name: 'NotFound',
		component: PageNotFound
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
