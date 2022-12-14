export const changePokemon = (isFoe = false) => `${isFoe ? 'Opponent' : 'You'} changed pokemon`

export const moveMessage = (attacker, defender, move, isFoe = false) => {
    if (!move) return null // skip move

    let message = isFoe ? 'Foe' : 'Your'

    message += ` ${attacker.name} used ${move.name}.`

    const moveDamageRate = defender.getDamageRate(move.type)
    if (moveDamageRate > 1)
        message += ' It is supper effective.'
    else if (moveDamageRate < 1)
        message += ' It is not very effective.'

    return message
}

export const faintMessage = (pokemon, isFoe = false) => {
    let message = isFoe ? 'Foe' : 'Your'
    message += ` ${pokemon.name} fainted.`
    return message
}

export const missedMove = (pokemon, isFoe = false) => {
    let message = isFoe ? 'Foe' : 'Your'
    message += ` ${pokemon.name} missed the attack.`
    return message
}