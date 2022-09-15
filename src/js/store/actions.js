export default {

    async cachePokemonData(context, data) {
        context.commit('cachePokemonData', data)
    },

    async cacheMovesData(context, data) {
        context.commit('cacheMovesData', data)
    },

    async getPokemonById(context, id) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(response => response.json())
            .then(data => data)
        return response
    },

    async fetchData(context) {
        const gameData = JSON.parse(window.atob(localStorage.gameData))
        context.commit('loadData', gameData)
        const caughtPokemon = [...new Set(Object.values(gameData.pokemon.caught).map(item => item.id))]
        for (let id of caughtPokemon) {
            const data = await context.dispatch('getPokemonById', id)
            context.dispatch('cachePokemonData', data)
        }
    }
}