import HomeView from '@/js/views/home/index.vue'
import PokedexView from '@/js/views/home/PokedexView.vue'
import GymBadges from '@/js/views/home/GymBadges.vue'
import AchievementsView from '@/js/views/home/AchievementsView.vue'
import PlayerPokemonList from '@/js/views/home/PlayerPokemonList.vue'

export default [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/pokedex',
        name: 'Pokedex',
        component: PokedexView,
        meta: {
            title: 'Pokédex'
        }
    },
    {
        path: '/gym-badges',
        name: 'Badges',
        component: GymBadges,
        meta: {
            title: 'Badges'
        }
    },
    {
        path: '/achievements',
        name: 'Achievements',
        component: AchievementsView,
        meta: {
            title: 'Achievements'
        }
    },
    {
        path: '/pokemon/list/:type',
        name: 'PlayerPokemon',
        component: PlayerPokemonList,
        meta: {
            title: 'Pokémon List'
        }
    }
]