import { createRouter, createWebHistory } from 'vue-router'

import OnboardingView from '@/js/views/OnboardingView.vue'
import PageNotFound from '@/js/views/PageNotFound.vue'
import HomeView from '@/js/views/home/index.vue'
import PokedexView from '@/js/views/home/PokedexView.vue'
import GymBadges from '@/js/views/home/GymBadges.vue'
import AchievementsView from '@/js/views/home/AchievementsView.vue'
import PlayerPokemonList from '@/js/views/home/PlayerPokemonList.vue'
import PokemonDetails from '@/js/views/PokemonDetails.vue'
import StoryMode from '@/js/views/modes/StoryMode.vue'
import ExplorationMode from '@/js/views/modes/ExplorationMode.vue'
import ShopView from '@/js/views/items/ShopView.vue'
import BagView from '@/js/views/items/BagView.vue'

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
        path: '/mode/story',
        name: 'StoryMode',
        component: StoryMode
    },
    {
        path: '/mode/exploration',
        name: 'ExplorationMode',
        component: ExplorationMode
    },
    {
        path: '/shop',
        name: 'ShopView',
        component: ShopView
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
