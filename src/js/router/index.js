import { createRouter, createWebHistory } from 'vue-router'

import OnboardingView from '../views/OnboardingView.vue'
import PageNotFound from '../views/PageNotFound.vue'
import HomeView from '../views/HomeView.vue'
import PokedexView from '../views/PokedexView.vue'
import GymBadges from '../views/GymBadges.vue'
import AchievementsView from '../views/AchievementsView.vue'
import PlayerPokemonList from '../views/PlayerPokemonList.vue'

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
    {
        path: '/pokedex',
        name: 'Pokedex',
        component: PokedexView
    },
    {
        path: '/gym-badges',
        name: 'Badges',
        component: GymBadges
    },
    {
        path: '/achievements',
        name: 'Achievements',
        component: AchievementsView
    },
    {
        path: '/pokemon/:id',
        name: 'PlayerPokemon',
        component: PlayerPokemonList
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
