import { createRouter, createWebHistory } from 'vue-router'

import OnboardingView from '@/js/views/OnboardingView.vue'
import PageNotFound from '@/js/views/PageNotFound.vue'
import HomeView from '@/js/views/HomeView.vue'
import PokedexView from '@/js/views/PokedexView.vue'
import GymBadges from '@/js/views/GymBadges.vue'
import AchievementsView from '@/js/views/AchievementsView.vue'
import PlayerPokemonList from '@/js/views/PlayerPokemonList.vue'
import PokemonDetails from '@/js/views/PokemonDetails.vue'
import StoreView from '@/js/views/StoreView.vue'
import BagView from '@/js/views/BagView.vue'

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
        path: '/pokemon/list/:type',
        name: 'PlayerPokemon',
        component: PlayerPokemonList
    },
    {
        path: '/pokemon/details/:type/:id',
        name: 'PokemonDetails',
        component: PokemonDetails
    },
    {
        path: '/store',
        name: 'StoreView',
        component: StoreView
    },
    {
        path: '/bag',
        name: 'BagView',
        component: BagView
    },
    {
        path: '/page-not-found',
        name: 'NotFound',
        component: PageNotFound
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/page-not-found',
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
