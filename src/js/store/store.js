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
            audio: null,
            battle: null,
            checkEvolution: false,
            carnivalEntry: null,
            achievementUnlocked: {
                show: false,
                achievemet: null
            }
        }
    },
    getters,
    mutations,
    actions
})