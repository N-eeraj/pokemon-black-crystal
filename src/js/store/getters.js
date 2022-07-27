export default {
	getPlayerInfo: state => {
		return state.playerInfo
	},
	getPartyPokemon: state => {
		return state.playerPokemonData.filter(pokemon => pokemon.isParty)
	},
	getPCPokemon: state => {
		return state.playerPokemonData.filter(pokemon => !pokemon.isParty)
	},
}