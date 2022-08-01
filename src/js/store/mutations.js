const saveData = state => {
	// eslint-disable-next-line no-unused-vars
	let {pokemonDetails, moveDetails, ...data} = state
	localStorage.setItem('gameData', window.btoa(JSON.stringify(data)))
}

export default {
	loadData: (state, data) => {
		state = JSON.parse(window.atob(data))
		state.pokemonDetails = {}
		state.moveDetails = {}
	},
	updatePlayerInfo: (state, data) => {
		state.playerInfo = data
		saveData(state)
	},
	toggleSound: state => {
		state.sound = !state.sound
		saveData(state)
	},
	updateEncountered: (state, pokemonId) => {
		++state.pokemon.encountered.last
		if (!state.pokemon.encountered.includes(pokemonId))
			state.pokemon.encountered.push(pokemonId)
		saveData(state)
	},
	updateCaughtPokemon: (state, pokemon) => {
		let {encounterId, data} = pokemon
		state.pokemon.caught[encounterId] = data
		saveData(state)
	},
	increasePokemonExp: (state, pokemon, expGained) => {
		state.pokemon.caught[pokemon].exp += expGained
		saveData(state)
	},
	updatePokemonJoy: (state, pokemon, joy) => {
		state.pokemon.caught[pokemon].joy += joy
		saveData(state)
	},
	playerLevelUp: state => {
		++state.progress.level
	},
	updateAchievements: (state, event, hasWon) => {
		++state.progress.arcade[event].attempts
		if (hasWon)
			++state.progress.arcade[event].victories
		saveData(state)
	},
	updateCoins: (state, coins) => {
		state.progress.coins += coins
		saveData(state)
	},
	updateBag: (state, item, count) => {
		if (state.progress.bag[item])
			state.progress.bag[item] += count
		else
			state.progress.bag[item] = count
	}
}