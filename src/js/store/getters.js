export default {
    isOffline(state) {
        return state.isOffline
    },

    getPokemon(state) {
        return state.pokemonData
    },

    getBattleData(state) {
        return state.battle
    },

    getAvailableBalls(state) {
        if (!state.gameData) return {}
        const ballIds = [1, 2, 3, 13]
        const availableBalls = {}
        Object.entries(state.gameData.progress.bag).forEach(([id, count]) => {
            if (ballIds.includes(Number(id)) && count)
                availableBalls[id] = count
        })
        return availableBalls
    },

    getMovesByName: (state) => (name) => {
        return state.movesData[name]
    },

    playerInfo(state) {
        return state.gameData.playerInfo
    },

    soundStatus(state) {
        return state.gameData.sound
    },

    playerCoins(state) {
        return state.gameData.progress.coins
    },

    getPokedexList(state) {
        const encountered = state.gameData.pokemon.encountered.list.sort((first, second) => first - second)
        const caught = state.gameData.pokemon.caughtList
        return encountered.map(pokemonId => {
            return {
                id: pokemonId,
                caught: caught.includes(pokemonId)
            }
        })
    },

    allTypes(state) {
        return Object.keys(state.typesData)
    },

    getCaughtPokemon: (state) => (id) => {
        return state.gameData.pokemon.caught[id]
    },

    getCaughtPokemonList(state) {
        return state.gameData.pokemon.caughtList
    },

    strongestPokemon(state) {
        const caughtPokemonDetails = Object.values(state.gameData.pokemon.caught)
        return caughtPokemonDetails.sort((first, second) => first.exp - second.exp)[caughtPokemonDetails.length - 1]
    },

    partyPokemon(state) {
        return state.gameData.pokemon.party
    },

    pcPokemon(state) {
        return state.gameData.pokemon.pc
    },

    playerLevel(state) {
        return state.gameData.progress.level
    },

    playerAchievements(state) {
        return state.gameData.progress.arcade
    },

    bagItems(state) {
        return state.gameData.progress.bag
    },

    checkEvolution(state) {
        return state.checkEvolution
    },

    lastEncountered(state) {
        return state.gameData.pokemon.encountered.last
    },

    getCoinAndBerry(state) {
        return {
            coin: state.gameData.progress.coins,
            berry: state.gameData.progress.bag[4]
        }
    }
}