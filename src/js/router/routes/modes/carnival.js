import CarnivalMode from '@/js/views/modes/carnival/index.vue'
import CarnivalWhosThatPokemon from '@/js/views/modes/carnival/WhosThatPokemon.vue'
import CarnivalFindingDitto from '@/js/views/modes/carnival/FindingDitto.vue'
import CarnivalBerryCrusher from '@/js/views/modes/carnival/BerryCrusher.vue'
import CarnivalPokemonRoulette from '@/js/views/modes/carnival/PokemonRoulette.vue'
import CarnivalPokemonDash from '@/js/views/modes/carnival/PokemonDash.vue'
import CarnivalBlockSmash from '@/js/views/modes/carnival/BlockSmash.vue'

export default [
    {
        path: '/mode/carnival',
        name: 'CarnivalMode',
        component: CarnivalMode,
        meta: {
            title: 'Carnival Mode'
        }
    },
    {
        path: '/mode/carnival/whos-that-pokemon',
        name: 'CarnivalWhosThatPokemon',
        component: CarnivalWhosThatPokemon,
        meta: {
            title: "Who's that Pokémon"
        }
    },
    {
        path: '/mode/carnival/finding-ditto',
        name: 'CarnivalFindingDitto',
        component: CarnivalFindingDitto,
        meta: {
            title: 'Finding Ditto'
        }
    },
    {
        path: '/mode/carnival/berry-crusher',
        name: 'CarnivalBerryCrusher',
        component: CarnivalBerryCrusher,
        meta: {
            title: 'Berry Crusher'
        }
    },
    {
        path: '/mode/carnival/pokemon-roulette',
        name: 'CarnivalPokemonRoulette',
        component: CarnivalPokemonRoulette,
        meta: {
            title: 'Pokémon Roulette'
        }
    },
    {
        path: '/mode/carnival/pokemon-dash',
        name: 'CarnivalPokemonDash',
        component: CarnivalPokemonDash,
        meta: {
            title: 'Pokémon Dash'
        }
    },
    {
        path: '/mode/carnival/block-smash',
        name: 'CarnivalBlockSmash',
        component: CarnivalBlockSmash,
        meta: {
            title: 'Block Smash'
        }
    }
]