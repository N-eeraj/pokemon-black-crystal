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
import ArcadeMode from '@/js/views/modes/arcade/index.vue'
import ArcadeBattle from '@/js/views/modes/arcade/battle.vue'
import ArcadeTent from '@/js/views/modes/arcade/tent.vue'
import ArcadeTower from '@/js/views/modes/arcade/tower.vue'
import TradeMode from '@/js/views/modes/TradeMode.vue'
import ShopView from '@/js/views/items/ShopView.vue'
import BagView from '@/js/views/items/BagView.vue'

export const routes = [
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
        component: PokedexView,
        meta: {
            title: 'Pokedex'
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
    },
    {
        path: '/pokemon/details/:type/:id',
        name: 'PokemonDetails',
        component: PokemonDetails,
        meta: {
            title: 'Pokémon'
        }
    },
    {
        path: '/mode/story',
        name: 'StoryMode',
        component: StoryMode,
        meta: {
            title: 'Story Mode'
        }
    },
    {
        path: '/mode/exploration',
        name: 'ExplorationMode',
        component: ExplorationMode,
        meta: {
            title: 'Exploration Mode'
        }
    },
    {
        path: '/mode/arcade',
        name: 'ArcadeMode',
        component: ArcadeMode,
        meta: {
            title: 'Arcade Mode'
        }
    },
    {
        path: '/mode/arcade/battle',
        name: 'ArcadeBattle',
        component: ArcadeBattle,
        meta: {
            title: 'Arcade Battle'
        }
    },
    {
        path: '/mode/arcade/tent',
        name: 'ArcadeTent',
        component: ArcadeTent,
        meta: {
            title: 'Arcade Tent'
        }
    },
    {
        path: '/mode/arcade/tower',
        name: 'ArcadeTower',
        component: ArcadeTower,
        meta: {
            title: 'Arcade Tower'
        }
    },
    {
        path: '/mode/trade',
        name: 'TradeMode',
        component: TradeMode,
        meta: {
            title: 'Trade'
        }
    },
    {
        path: '/shop',
        name: 'ShopView',
        component: ShopView,
        meta: {
            title: 'Shop'
        }
    },
    {
        path: '/bag',
        name: 'BagView',
        component: BagView,
        meta: {
            title: 'Bag'
        }
    },
    {
        path: '/page-not-found',
        name: 'NotFound',
        component: PageNotFound,
        meta: {
            title: 'Page Not Found'
        }
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/page-not-found',
    },
]