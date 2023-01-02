import calculations from "@/js/mixins/calculations"

export default {
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

	useMoveBattleDataUpdate(state, data) {
		const { moveData, inCommingAttack } = data
		// console.log(state.battle)
		// console.log(moveData)

		const attacker = state.battle[inCommingAttack ? 'foe' : 'trainer']
		const defener = state.battle[inCommingAttack ? 'trainer' : 'foe']

		const damage = calculations.moveDamage(moveData, attacker.partyList[attacker.currentPokemonIndex], defener.partyList[defener.currentPokemonIndex])

		defener.partyList[defener.currentPokemonIndex].currentHp -= damage
		attacker.partyList[attacker.currentPokemonIndex].movesList.find(move => move.name === moveData.name).pp -= 1
	}
}