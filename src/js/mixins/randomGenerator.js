export const getRandomMove = (pokemon) => {
    const moves = pokemon.movesList.filter(move => move.pp)
    return moves[Math.floor(Math.random() * moves.length)]
}

export const checkMoveAccuracy = (attack) => Math.random() * 100 < attack.moveData.accuracy

export const getInRange = (min, max) => Math.floor(Math.random() * (max - min) + min)

export const getRandomFromList = (list) => list[Math.floor(Math.random() * list.length)]