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

	useMoveBattleDataUpdate(state, moveData) {
		// console.log(state.battle)
		// console.log(moveData)
		const trainer = state.battle.trainer
		const foe = state.battle.foe

		const damage = calculations.moveDamage(moveData, trainer.partyList[trainer.currentPokemonIndex], foe.partyList[foe.currentPokemonIndex])
		
		foe.partyList[foe.currentPokemonIndex].currentHp -= damage
		trainer.partyList[trainer.currentPokemonIndex].movesList.find(move => move.name === moveData.name).pp -= 1
	}
}