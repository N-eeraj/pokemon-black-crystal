import { createStore } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
	state() {
		return {
			gameData: null,
			pokemonData: {},
			movesData: {}
		}
	},
	getters,
	mutations,
	actions
})