export default {
    getRandomMove(pokemon) {
        const moves = pokemon.movesList.filter(move => move.pp)
        return moves[Math.floor(Math.random() * moves.length)]
    }
}