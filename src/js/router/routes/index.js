import OnboardingView from '@/js/views/OnboardingView.vue'
import PageNotFound from '@/js/views/PageNotFound.vue'
import PokemonDetails from '@/js/views/PokemonDetails.vue'
import ShopView from '@/js/views/items/ShopView.vue'
import BagView from '@/js/views/items/BagView.vue'
import InfoView from '@/js/views/InfoView.vue'
import SettingsView from '@/js/views/SettingsView.vue'

import home from '@/js/router/routes/home'
import modes from '@/js/router/routes/modes'

export const routes = [
    ...home,
    {
        path: '/welcome',
        name: 'Welcome',
        component: OnboardingView
    },
    {
        path: '/pokemon/details/:type/:id',
        name: 'PokemonDetails',
        component: PokemonDetails,
        meta: {
            title: 'Pokémon'
        }
    },
    ...modes,
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
        path: '/settings',
        name: 'SettingsView',
        component: SettingsView,
        meta: {
            title: 'Settings'
        }
    },
    {
        path: '/info',
        name: 'InfoView',
        component: InfoView,
        meta: {
            title: 'Info'
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
    }
]