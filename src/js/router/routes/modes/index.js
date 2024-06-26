import StoryMode from '@/js/views/modes/StoryMode.vue'
import ExplorationMode from '@/js/views/modes/exploration/index.vue'
import SafariZone from '@/js/views/modes/exploration/SafariZone.vue'
import PVPMode from '@/js/views/modes/PVPMode.vue'
import TradeMode from '@/js/views/modes/TradeMode.vue'

import arcade from '@/js/router/routes/modes/arcade'
import carnival from '@/js/router/routes/modes/carnival'

export default [
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
        path: '/mode/exploration/safari-zone',
        name: 'SafariZone',
        component: SafariZone,
        meta: {
            title: 'Safari Zone'
        }
    },
    ...arcade,
    {
        path: '/mode/pvp',
        name: 'PVPMode',
        component: PVPMode,
        meta: {
            title: 'PVP'
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
    ...carnival
]