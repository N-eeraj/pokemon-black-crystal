import { Pokemon, PokemonObject } from '@/js/mixins/Pokemon'

import { getIdFromUrl, deepCopy, clamp, decryptAndLoad } from '@/js/mixins/common'
import { getInRange } from '@/js/mixins/randomGenerator'

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

    updateAudio({ commit, state }, audio) {
        if (state.audio === audio) return
        commit('updateAudio', audio)
    },

    async checkDailyReward({ state, commit }) {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Santiago')
        const { unixtime } = await response.json()
        const { last, streak } = state.gameData.dailyRewards
        switch (Math.floor((unixtime - last) / 86_400)) {
            case 0:
                return false
            case 1:
                if (streak === 7)
                    commit('updateDailyRewards', { unixtime, streak: 1 })
                else
                    commit('updateDailyRewards', { unixtime, streak: streak + 1 })
                return true
            default:
                commit('updateDailyRewards', { unixtime, streak: 1 })
                return true
        }
    },

    async cachePokemonById({ commit }, id) {
        const pokemon = await Pokemon(id)
        commit('storePokemonDataByPokemon', pokemon)
        return pokemon
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
        try {
            const response = await fetch(url)
                .then(response => response.json())
                .then(data => data)
            const pp = clamp(5, Math.round(response.pp / 2), 20)
            const moveData = {
                name: response.name,
                type: response.type.name,
                power: response.power,
                pp,
                accuracy: response.accuracy || 100,
                priority: response.priority,
                category: response.meta.category.name,
                damageClass: response.damage_class.name,
                healing: response.meta.healing,
                min: response.meta.min_hits,
                max: response.meta.max_hits
            }
            return moveData
        }
        catch {
            return {}
        }
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
                    if (moveDetails?.power || ['ohko', 'heal'].includes(moveDetails?.category))
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

    setPokemonData({ commit }, data) {
        const pokemonData = {}
        Object.entries(data).forEach(([id, details]) => pokemonData[id] = PokemonObject(details))
        commit('setPokemonData', pokemonData)
    },

    async loadGameData({ dispatch }) {
        const { gameData, pokemonData } = decryptAndLoad()
        dispatch('setPokemonData', pokemonData)
        dispatch('saveGameData', gameData)
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

    toggleVibrations({ commit }) {
        commit('toggleVibrations')
    },

    toggleFullScreen({ commit }) {
        commit('toggleFullScreen')
    },

    rearrangePlayerPokemon({ commit }, data) {
        commit('rearrangePlayerPokemon', data)
    },

    moveToParty({ commit }, pokemon) {
        commit('moveToParty', pokemon)
    },

    moveToBox({ commit }, data) {
        commit('moveToBox', data)
    },

    createBox({ commit }, boxName) {
        commit('createBox', boxName)
    },

    updateBoxName({ commit }, data) {
        commit('updateBoxName', data)
    },

    deleteBox({ commit }, boxName) {
        commit('deleteBox', boxName)
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

    encounterNewPokemon({ commit }, count = 1) {
        commit('encounteredNewPokemon', count)
    },

    async getRandomPokemon({ dispatch }, { count, includeLegendary }) {
        const randomPokemon = []
        for (let i=0; i<count; i++) {
            const pokemonData = await dispatch('getPokemonById', getInRange(1, 387))
            if ((pokemonData.isLegendary && !includeLegendary) || randomPokemon.map(pokemon => pokemon.id).includes(pokemonData.id)) {
                --i
                continue
            }
            randomPokemon.push(pokemonData)
        }
        if (count === 1) return randomPokemon[0]
        return randomPokemon
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
                encounterPossibilities.splice(encounterPossibilities.length, 0, ...Array.from({length: 1000}, () => pokemon.id))
        })

        const randomPokemon = encounterPossibilities[getInRange(0, encounterPossibilities.length)]
        const pokemonDetails = await dispatch('getPokemonById', randomPokemon)
        if (pokemonDetails.isLegendary)
            return dispatch('getWildPokemonByLocation', location)
        return pokemonDetails
    },

    async getLegendaryPokemon({ dispatch, getters }) {
        const options = {
            count: 1,
            includeLegendary: true
        }
        const pokemonData = await dispatch('getRandomPokemon', options)
        if (pokemonData.isLegendary && !getters.getCaughtPokemonList.includes(pokemonData.id))
            return pokemonData
        return null
    },

    addCaughtPokemon({ commit }, data) {
        commit('addCaughtPokemon', data)
    },

    gainExperience({ commit }, data) {
        commit('gainExperience', data)
    },

    updatePokemonHappiness({ commit }, data) {
        commit('updatePokemonHappiness', data)
    },

    toggleEvolutionCheck({ commit }) {
        commit('toggleEvolutionCheck')
    },

    evolvePokemon({ commit }, data) {
        commit('evolvePokemon', data)
    },

    levelUp({ commit }) {
        commit('levelUp')
    },

    setLevel({ commit }, level) {
        commit('setLevel', level)
    },

    updateAchievement({ commit }, data) {
        commit('updateAchievement', data)
    },

    updateSafariZoneEntry({ commit }, { status, unixtime }) {
        commit('updateSafariZoneEntry', { status, unixtime })
    },

    async checkSafariZoneEntry({ state }) {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Santiago')
        const { unixtime } = await response.json()
        return {
            unixtime,
            canEnter: Math.floor((unixtime - state.gameData.lastSafariZone) / 86_400) >= 1
        }
    },

    async getCarnivalPokemon({ getters }, count) {
        const randomPokemon = []
        for (let i=0; i<count; i++) {
            const id = getInRange(1, 387)
            if (id === 212) {
                i--
                continue
            }
            const data = getters.getPokemon[id]
            if (data) {
                data.id = id
                randomPokemon.push(deepCopy(data))
                continue
            }
            const pokemonData = await Pokemon(id)
            if (pokemonData.isLegendary || randomPokemon.map(pokemon => pokemon.id).includes(pokemonData.id)) {
                --i
                continue
            }
            randomPokemon.push(pokemonData)
        }
        return randomPokemon
    },

    updateCarnivalEntry({ commit }, eventName) {
        commit('updateCarnivalEntry', eventName)
    },

    async getPokemonImageById({ state }, id) {
        try {
            const { image } = state.pokemonData[id]
            return image
        }
        catch {
            const { image } = await Pokemon(id)
            return image
        }
    },

    unlockAchievement({ commit }) {
        commit('unlockAchievement')
    }
}
