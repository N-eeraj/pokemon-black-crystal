import calculations from "@/js/mixins/calculations"
import randomGenerator from "@/js/mixins/randomGenerator"

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

	useMoveBattleDataUpdate(state, { moveData, inCommingAttack }) {

		const attacker = state.battle[inCommingAttack ? 'foe' : 'trainer']
		const defender = state.battle[inCommingAttack ? 'trainer' : 'foe']

		const attackingPokemon = attacker.partyList[attacker.currentPokemonIndex]
		const defendingPokemon = defender.partyList[defender.currentPokemonIndex]

		// if move category is ohko set damage as defending pokemon's hp else calculate damage
		let damage = 0
		if (moveData.category === 'ohko') damage = defendingPokemon.currentHp
		else {
			// set number of times the damage is dealt in case of multi times move, else set to one
			const times = randomGenerator.getInRange(moveData.min, moveData.max) || 1
			for (let time = 0; time < times; time++) {
				damage += calculations.moveDamage(moveData, attackingPokemon, defendingPokemon)
			}
		}

		// if move category is damage+heal set heal as half of the damage dealt else set use heal from move data as percentage
		let heal
		if (moveData.category === 'damage+heal') heal = Math.ceil(moveData.healing / 2)
		else heal = defendingPokemon.stat.hp * moveData.healing * 0.01

		defendingPokemon.currentHp -= damage
		attackingPokemon.currentHp += heal
		attackingPokemon.currentHp = Math.min(attackingPokemon.currentHp, attackingPokemon.stat.hp)
		attackingPokemon.movesList.find(move => move.name === moveData.name).pp -= 1
	},

	pokemonFaintedBattleDataUpdate(state, user) {
		state.battle[user].partyList.splice(state.battle[user].currentPokemonIndex, 1)
	}
}