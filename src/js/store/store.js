import { createStore } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
    state() {
        return {
            isOffline: false,
            gameData: null,
            pokemonData: {},
            movesData: {},
            typesData: {},
            growthRateData: {},
            battle: null,
            checkEvolution: false
        }
    },
    getters,
    mutations,
    actions
})