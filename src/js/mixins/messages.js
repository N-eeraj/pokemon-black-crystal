export default {
    moveMessage(attacker, defender, move, isFoe = false) {
        let message = isFoe ? 'Foe ' : 'Your '

        message += `${attacker.name} used ${move.name}.`

        const moveDamageRate = defender.getDamageRate(move.type)
        if (moveDamageRate > 1)
            message += ' It is very effective.'
        else if (moveDamageRate < 1)
            message += ' It is not very effective.'

        return message
    }
}