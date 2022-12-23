export default {
	getPokemon(state) {
		return state.pokemonData
	},

	getAvailableBalls(state) {
		// to-do: return available types of balls
		if (!state.gameData) return {}
		return state.gameData.progress.bag
	},

	getMovesByName: (state) => (name) => {
		return state.movesData[name]
	}
}