import { toTitleCase } from '@/js/mixins/common'

export const changePokemon = (isFoe = false) => `${isFoe ? 'Opponent' : 'You'} changed pokemon`

export const moveMessage = (attacker, defender, move, isFoe = false) => {
    if (!move) return null // skip move

    let message = isFoe ? 'Foe' : 'Your'

    message += ` ${toTitleCase(attacker.name)} used ${move.name}.`

    const moveDamageRate = defender.getDamageRate(move.type)
    if (moveDamageRate > 1)
        message += ' It is supper effective.'
    else if (moveDamageRate === 0)
        message += ` It doesn't effect ${toTitleCase(defender.name)}.`
    else if (moveDamageRate < 1)
        message += ' It is not very effective.'

    return message
}

export const faintMessage = (pokemon, isFoe = false) => {
    let message = isFoe ? 'Foe' : 'Your'
    message += ` ${toTitleCase(pokemon.name)} fainted.`
    return message
}

export const missedMove = (pokemon, isFoe) => {
    let message = isFoe ? 'Foe' : 'Your'
    message += ` ${toTitleCase(pokemon.name)} missed the attack.`
    return message
}

export const useItem = (itemName) => `You used ${itemName}.`

export const caughtPokemon = (pokemon) => `You caught a ${toTitleCase(pokemon.name)}.`

export const pokemonBrokeFree = (pokemon) => `${toTitleCase(pokemon.name)} broke free.`