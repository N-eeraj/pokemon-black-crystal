import common from "@/js/mixins/common"
import imageAndSprites from "@/js/mixins/imageAndSprites"

export default {
	async cachePokemonById({ state, commit }, id) {
		function getNextPokemon(evolvesTo) {
			if (common.getIdFromUrl(evolvesTo.species.url) === id) {
				pokemonEvolutionData = evolvesTo
				return
			}
			evolvesTo.evolves_to.forEach(evolution => getNextPokemon(evolution))
		}

		const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
			.then(response => response.json())
			.then(data => data)
		const pokemonSpeciesData = await fetch(pokemonData.species.url)
			.then(response => response.json())
			.then(data => data)
		let pokemonEvolutionData = await fetch(pokemonSpeciesData.evolution_chain.url)
			.then(response => response.json())
			.then(data => data.chain)

		const data = {
			id: pokemonData.id,
			name: pokemonData.name,
			types: pokemonData.types.map(type => type.type.name),
			image: imageAndSprites.methods.getImageUrl(pokemonData.name),
			sprite: imageAndSprites.methods.getSpriteUrl(pokemonData.name),
			height: pokemonData.height * 10,
			weight: pokemonData.weight / 10,
			baseStat: {},
			baseExp: pokemonData.base_experience,
			baseHappiness: pokemonSpeciesData.base_happiness,
			captureRate: pokemonSpeciesData.capture_rate,
			growthRate: pokemonSpeciesData.growth_rate.name,
			evolution: null,
			getLevel(currenrExp) {
				let level = 0
				Object.values(state.growthRateData[this.growthRate]).forEach(exp => {
					if (currenrExp >= exp) level++
				})
				return level
			},
			getStat(exp) {
				const level = this.getLevel(exp)
				return {
					'hp': Math.round((0.02 * this.baseStat['hp'] * level) + 10 + level, 2),
					'attack': Math.round((0.02 * this.baseStat['attack'] * level) + 5, 2),
					'defense': Math.round((0.02 * this.baseStat['defense'] * level) + 5, 2),
					'special-attack': Math.round((0.02 * this.baseStat['special-attack'] * level) + 5, 2),
					'special-defense': Math.round((0.02 * this.baseStat['special-defense'] * level) + 5, 2),
					'speed': Math.round((0.02 * this.baseStat['speed'] * level) + 5, 2)
				}
			},
			getDamageRate(attackType) {
				let rate = 1
				this.types.forEach(type => {
					if (state.typesData[type].doubleDamage.includes(attackType)) rate *= 2
					if (state.typesData[type].halfDamage.includes(attackType)) rate *= 0.5
					if (state.typesData[type].noDamage.includes(attackType)) rate *= 0
				})
				return rate
			},
			getMovesByLevel(exp) {
				return this.moves.filter(move => move.level <= this.getLevel(exp))
			}
		}
		pokemonData.stats.forEach(stat => data.baseStat[stat.stat.name] = stat.base_stat)

		data.moves = pokemonData.moves
			.filter(move => Object.keys(state.movesData).includes(move.move.name) && move.version_group_details[0].level_learned_at)
			.map(move => {
				return {
					name: move.move.name,
					level: move.version_group_details[0].level_learned_at
				}
			})
	
		getNextPokemon(pokemonEvolutionData)
		const nextEvolutionObj = {
			levelUp: {
				minLevel: null,
				pokemon: []
			},
			happinessUp: {
				minLevel: null,
				pokemon: []
			},
			useItem: [],
			trade: [],
		}
		pokemonEvolutionData.evolves_to.forEach(evolution => {
			const evolvedPokemonId = common.getIdFromUrl(evolution.species.url)
			if (evolvedPokemonId > 386) return
			evolution.evolution_details.forEach(evolutionObject => {
				switch (evolutionObject.trigger.name) {
				case 'level-up':
				if (evolutionObject.min_level) {
					nextEvolutionObj.levelUp.minLevel = evolutionObject.min_level
					nextEvolutionObj.levelUp.pokemon.push(evolvedPokemonId)
				}
				else if (evolutionObject.min_happiness) {
					nextEvolutionObj.happinessUp.minLevel = evolutionObject.min_happiness
					nextEvolutionObj.happinessUp.pokemon.push(evolvedPokemonId)
				}
					break
				case 'use-item':
				if (evolutionObject.item.name)
					nextEvolutionObj.useItem.push({
						itemName: evolutionObject.item.name ,
						pokemon: evolvedPokemonId
					})
					break
				case 'trade':
					nextEvolutionObj.trade.push(evolvedPokemonId)
					break
				}
			})
		})
		data.evolution = nextEvolutionObj
		commit('cachePokemonData', data)
		return data
	},

	async getGrowthRateById(context, id) {
		const response = await fetch(`https://pokeapi.co/api/v2/growth-rate/${id}`)
			.then(response => response.json())
			.then(data => data)
		return response
	},

	async getAllTypes() {
		const response = await fetch('https://pokeapi.co/api/v2/type')
			.then(response => response.json())
			.then(data => data)
		return response
	},

	async getMoveByUrl(context, url) {
		const response = await fetch(url)
			.then(response => response.json())
			.then(data => data)
		const moveData = {
			name: response.name,
			type: response.type.name,
			power: response.power,
			pp: response.pp,
			accuracy: response.accuracy,
			priority: response.priority,
			category: response.meta.category.name,
			damageClass: response.damage_class.name,
		}
		if (response.meta.min_hits)
			moveData.hits = {
				min: response.meta.min_hits,
				max: response.meta.max_hits
			}
		return moveData
	},

	async getTypeByUrl(context, url) {
		const response = await fetch(url)
			.then(response => response.json())
			.then(data => data)
		return {
			name: response.name,
			doubleDamage: response.damage_relations.double_damage_from.map(type => type.name),
			halfDamage: response.damage_relations.half_damage_from.map(type => type.name),
			noDamage: response.damage_relations.no_damage_from.map(type => type.name)
		}
	},

	async getMovesByCategory(context, category) {
		const response = await fetch(`https://pokeapi.co/api/v2/move-category/${category}`)
			.then(response => response.json())
			.then(data => data)
		return response.moves
	},

	async fetchMoves(context) {
		const requiredMoveCategories = ['ohko', 'heal', 'damage+heal', 'damage+ailment', 'damage+lower', 'damage+raise', 'damage']
		requiredMoveCategories.forEach(async category => {
			const moves = await context.dispatch('getMovesByCategory', category)
			moves.forEach(async move => {
				if (common.getIdFromUrl(move.url) <= 354) {
					const moveDetails = await context.dispatch('getMoveByUrl', move.url)
					if (moveDetails.power || ['ohko', 'heal'].includes(moveDetails.category))
						context.commit('cacheMovesData', moveDetails)
				}
			})
		})
	},

	async fetchGrowthRates(context) {
		for (let id = 1; id < 7; id++) {
			const growthRate = await context.dispatch('getGrowthRateById', id)
			context.commit('cacheGrowthRateData', growthRate)
		}
	},

	async fetchTypes(context) {
		const allTypes = await context.dispatch('getAllTypes')
		allTypes.results.forEach(async type => {
			const typeData = await context.dispatch('getTypeByUrl', type.url)
			context.commit('cacheTypeData', typeData)
		})
	},

	async fetchData(context) {
		const gameData = JSON.parse(window.atob(localStorage.gameData))
		context.commit('loadData', gameData)
		const partyPokemon = gameData.pokemon.party.map(pokemon => gameData.pokemon.caught[pokemon].id)
		partyPokemon.forEach(async id => await context.dispatch('cachePokemonById', id))
	},
}
