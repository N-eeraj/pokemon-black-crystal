export default {
    isOffline(state) {
        return state.isOffline
    },

    currentAudio(state) {
        return state.audio
    },

    dailyRewardsStreak(state) {
        return state.gameData.dailyRewards.streak
    },

    getPokemon(state) {
        return state.pokemonData
    },

    battleData(state) {
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
        return state.gameData.settings.sound
    },

    vibrationsStatus(state) {
        return state.gameData.settings.vibrations
    },

    fullScreenStatus(state) {
        return state.gameData?.settings?.fullScreen
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

    strongestPartyPokemon(state) {
        const pokemonData = state.gameData.pokemon
        const caughtPokemonDetails = pokemonData.party.map(pokemon => state.gameData.pokemon.caught[pokemon])
        return caughtPokemonDetails.sort((first, second) => first.exp - second.exp)[caughtPokemonDetails.length - 1]
    },

    partyPokemon(state) {
        return state.gameData.pokemon.party
    },

    partyPokemonData(state, getters) {
        return state.gameData.pokemon.party.map(id => {
            const pokemon = getters.getCaughtPokemon(id)
            return {
                pokemon: pokemon.id,
                exp: pokemon.exp,
                happiness: pokemon.happiness,
                encounterId: id
            }
        })
    },

    pcPokemon(state) {
        return state.gameData.pokemon.pc
    },

    playerLevel(state) {
        return state.gameData.progress.level
    },

    playerAchievements(state) {
        const caughtList = state.gameData.pokemon.caughtList
        const currentLevel = state.gameData.progress.level

        const region = {
            kanto: 0,
            johto: 0,
            hoenn: 0
        }
        let ownedPokemon = 0

        caughtList.forEach((pokemonId, index) => {
            // check for duplicate pokemonId
            if (caughtList.indexOf(pokemonId) !== index) return
            ++ownedPokemon
            if (pokemonId <= 151)
                ++region.kanto
            else if (pokemonId <= 251)
                ++region.johto
            else
                ++region.hoenn
        })

        return {
            ownedPokemon,
            region,
            currentLevel,
            ...state.gameData.achievements
        }
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
    },

    currentCarnivalEntry(state) {
        return state.carnivalEntry
    },

    achievementUnlocked(state) {
        return state.achievementUnlocked
    }
}