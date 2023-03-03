import ArcadeMode from '@/js/views/modes/arcade/index.vue'
import ArcadeBattle from '@/js/views/modes/arcade/battle.vue'
import ArcadeTent from '@/js/views/modes/arcade/tent.vue'
import ArcadeTower from '@/js/views/modes/arcade/tower.vue'

export default [
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
    }
]