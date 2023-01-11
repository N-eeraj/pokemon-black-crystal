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
        // to-do: return available types of balls
        if (!state.gameData) return {}
        return state.gameData.progress.bag
    },

    getMovesByName: (state) => (name) => {
        return state.movesData[name]
    },

    getAvatar(state) {
        return state.gameData.playerInfo.avatar
    }
}