import calculations from "@/js/mixins/calculations"

export default {
	updateOfflineStats(state, status) {
		state.isOffline = status
	},
	
	loadData(state, data) {
		state.gameData = data
	},

	cachePokemonData(state, pokemonData) {
		const {id, ...data} = pokemonData
		state.pokemonData[id] = data
	},

	cacheMovesData(state, moveData) {
		const {name, ...data} = moveData
		state.movesData[name] = data
	},

	cacheTypeData(state, typeData) {
		const {name, ...data} = typeData
		state.typesData[name] = data
	},

	cacheGrowthRateData(state, growthRateData) {
		const {name, levels} = growthRateData
		const data = Object.values(levels).map(({experience}) => experience)
		state.growthRateData[name] = data
	},

	setBattleData(state, data) {
		state.battle = data
	},

	reArrangePartyPokemon(state, { currentIndex, newIndex, isOpponent }) {
		const user = state.battle[isOpponent ? 'foe' : 'trainer']

		if (newIndex < 0) newIndex = 0
		else if (newIndex > user.partyList.length) {
			newIndex = user.partyList.length - 1
		}

		[user.partyList[currentIndex], user.partyList[newIndex]] = [user.partyList[newIndex], user.partyList[currentIndex]]
		
		if (user.currentPokemonIndex === newIndex) user.currentPokemonIndex = currentIndex
		else if (user.currentPokemonIndex === currentIndex) user.currentPokemonIndex = newIndex
	},

	switchBattlePokemon(state, { newIndex, isOpponent }) {
		state.battle[isOpponent ? 'foe' : 'trainer'].currentPokemonIndex = newIndex
	},

	useMoveBattleDataUpdate(state, data) {
		const { moveData, inCommingAttack } = data

		const attacker = state.battle[inCommingAttack ? 'foe' : 'trainer']
		const defender = state.battle[inCommingAttack ? 'trainer' : 'foe']

		const damage = calculations.moveDamage(moveData, attacker.partyList[attacker.currentPokemonIndex], defender.partyList[defender.currentPokemonIndex])

		defender.partyList[defender.currentPokemonIndex].currentHp -= damage
		attacker.partyList[attacker.currentPokemonIndex].movesList.find(move => move.name === moveData.name).pp -= 1
	},

	pokemonFaintedBattleDataUpdate(state, user) {
		state.battle[user].partyList.splice(state.battle[user].currentPokemonIndex, 1)
	}
}