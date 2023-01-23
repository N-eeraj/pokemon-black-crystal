import { getIdFromUrl, deepCopy, decryptAndLoad } from "@/js/mixins/common"
import { getInRange } from "@/js/mixins/randomGenerator"

import { getImageUrl, getSpriteUrl } from "@/js/mixins/imageAndSprites"

export default {
    async updateOfflineStats({ state, commit }) {
        let isOffline
        try {
            await fetch(`https://upload.wikimedia.org/wikipedia/commons/e/e6/1kb.png?${Date.now()}`)
            isOffline = false
        }
        catch {
            isOffline = true
        }
        if (state.isOffline === true && isOffline === false) {
            if (confirm('You seem to be back online, would you like to reconnect?')) {
                commit('updateOfflineStats', isOffline)
                location.reload()
            }
        }
        else commit('updateOfflineStats', isOffline)
    },

    async cachePokemonById({ state, commit }, id) {
        function getNextPokemon(evolvesTo) {
            if (getIdFromUrl(evolvesTo.species.url) === id) {
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
            image: getImageUrl(pokemonData.name),
            sprite: getSpriteUrl(pokemonData.name),
            height: pokemonData.height / 10,
            weight: pokemonData.weight / 10,
            baseStat: {},
            baseExp: pokemonData.base_experience,
            baseHappiness: pokemonSpeciesData.base_happiness,
            captureRate: pokemonSpeciesData.capture_rate,
            growthRate: pokemonSpeciesData.growth_rate.name,
            isLegendary: pokemonSpeciesData.is_legendary,
            evolution: null,
            getLevel(currentExp) {
                let level = 0
                Object.values(state.growthRateData[this.growthRate]).forEach(exp => {
                    if (currentExp >= exp) level++
                })
                return level
            },
            getExpGained(canCatch, user, exp) {
                const level = this.getLevel(exp)
                return Math.round(((!canCatch || user ==='trainer') ? 1.5 : 1) * this.baseExp * level / 7)
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
                let filteredMoves = this.moves.filter(move => move.level <= this.getLevel(exp))
                if (!filteredMoves.length) {
                    filteredMoves = [{
                        name: 'tackle',
                        level: 1
                    }]
                }
                return filteredMoves
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
            const evolvedPokemonId = getIdFromUrl(evolution.species.url)
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
                        itemName: evolutionObject.item.name,
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
            accuracy: response.accuracy || 100,
            priority: response.priority,
            category: response.meta.category.name,
            damageClass: response.damage_class.name,
            healing: response.meta.healing,
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

    async fetchMoves({ dispatch, commit }) {
        const requiredMoveCategories = ['ohko', 'heal', 'damage+heal', 'damage+ailment', 'damage+lower', 'damage+raise', 'damage']
        requiredMoveCategories.forEach(async category => {
            const moves = await dispatch('getMovesByCategory', category)
            moves.forEach(async move => {
                if (getIdFromUrl(move.url) <= 354) {
                    const moveDetails = await dispatch('getMoveByUrl', move.url)
                    if (moveDetails.power || ['ohko', 'heal'].includes(moveDetails.category))
                        commit('cacheMovesData', moveDetails)
                }
            })
        })
    },

    async fetchGrowthRates({ dispatch, commit }) {
        for (let id = 1; id < 7; id++) {
            const growthRate = await dispatch('getGrowthRateById', id)
            commit('cacheGrowthRateData', growthRate)
        }
    },

    async fetchTypes({ dispatch, commit }) {
        const allTypes = await dispatch('getAllTypes')
        allTypes.results.forEach(async type => {
            if (getIdFromUrl(type.url) > 1000) return
            const typeData = await dispatch('getTypeByUrl', type.url)
            commit('cacheTypeData', typeData)
        })
    },

    async saveGameData({ commit }, gameData) {
        commit('saveGameData', gameData)
    },

    async loadGameData({ dispatch }) {
        const gameData = decryptAndLoad()
        dispatch('saveGameData', gameData)
        const partyPokemon = gameData.pokemon.party.map(pokemon => gameData.pokemon.caught[pokemon].id)
        partyPokemon.forEach(async id => await dispatch('cachePokemonById', id))
    },

    async getPokemonById({ getters, dispatch }, id) {
        const data = getters.getPokemon[id]
        if (data) {
            data.id = id
            return deepCopy(data)
        }
        await dispatch('cachePokemonById', id)
        return await dispatch('getPokemonById', id)
    },

    setBattleData({ commit }, data) {
        commit('setBattleData', data)
    },

    reArrangePartyPokemon({ commit }, data) {
        commit('reArrangePartyPokemon', data)
    },
    
    switchBattlePokemon({ commit }, data) {
        commit('switchBattlePokemon', data)
    },

    useMoveBattleDataUpdate({ commit }, data) {
        if (data.moveData) commit('useMoveBattleDataUpdate', data)
    },
    
    pokemonFaintedBattleDataUpdate({ commit }, data) {
        commit('pokemonFaintedBattleDataUpdate', data)
    },
    
    savePlayerInfo({ commit }, playerInfo) {
        commit('savePlayerInfo', playerInfo)
    },
    
    toggleSound({ commit }) {
        commit('toggleSound')
    },

    rearrangePlayerPokemon({ commit }, data) {
        commit('rearrangePlayerPokemon', data)
    },

    movePokemon({ commit }, data) {
        commit('movePokemon', data)
    },

    releasePokemon({ commit }, data) {
        commit('releasePokemon', data)
    },

    updateBag({ commit }, data) {
        commit('updateBag', data)
    },

    updatePlayerCoins({ commit }, amount) {
        commit('updatePlayerCoins', amount)
    },

    async getWildPokemonByLocation({ dispatch }, location) {
        // get all pokemons in the location
        const response = await fetch(`https://pokeapi.co/api/v2/pal-park-area/${location}`)
        const data = await response.json()
        const encounterDetails = data.pokemon_encounters.map(pokemon => {
            return {
                id: getIdFromUrl(pokemon.pokemon_species.url),
                rate: pokemon.rate
            }
        })

        // filter out post gen 3 pokemon & create list of possible inividual pokemon
        const encounterPossibilities = []
        encounterDetails.forEach(pokemon => {
            if (pokemon.id > 386) return
            for (let i=0; i<pokemon.rate; i++)
                encounterPossibilities.push(pokemon.id)
        })

        const randomPokemon = encounterPossibilities[getInRange(0, encounterPossibilities.length)]
        const pokemonDetails = await dispatch('getPokemonById', randomPokemon)
        if (pokemonDetails.isLegendary) return dispatch('getWildPokemonByLocation', location)
        return pokemonDetails
    },

    async getLegendaryPokemon({ dispatch }) {
        const pokemonData = await dispatch('getPokemonById', getInRange(1, 387))
        if (pokemonData.isLegendary) return pokemonData
        return null
    },

    encounterPokemon({ commit }, pokemonId) {
        commit('enounterNewPokemon', pokemonId)
    },

    addCaughtPokemon({ commit }, data) {
        commit('addCaughtPokemon', data)
    },

    gainExperience({ commit }, data) {
        commit('gainExperience', data)
    },

    updatePokemonHappiness({ commit }, data) {
        commit('updatePokemonHappiness', data)
    }
}
