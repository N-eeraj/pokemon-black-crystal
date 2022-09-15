export default {

	loadData(state, data) {
		state.gameData = data
	},

	cachePokemonData(state, data) {
		state.pokemonData[data.id] = data
	},

	cacheMovesData(state, data) {
		state.movesData[data.id] = data
	},
}