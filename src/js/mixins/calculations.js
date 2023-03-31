function getAttackDefenseRatio(damageClass, attacker, defender) {
    if (damageClass === 'physical') return attacker.stat.attack / defender.stat.defense
    return attacker.stat['special-attack'] / defender.stat['special-defense']
}

export const moveDamage = (move, attacker, defender) => {
    let damage = 0
    for (let time = 0; time < move.times; time++) {
        const STAB = attacker.types.includes(move.type) ? 1.5 : 1 // same type attack bonus
        const level = attacker.level // level of attacking pokemon
        const power = move.power // power of the move
        // ratio between attacking pokemon's offence & defening pokemon's defense
        const attackDefenseRatio = getAttackDefenseRatio(move.damageClass, attacker, defender)

        damage += STAB * (2 + (0.4 * level + 2) * power * attackDefenseRatio * 0.02) * move.randomFactor.damage
    }
    // apply damage rate base on defending pokemon & move type
    damage *= defender.getDamageRate(move.type)

    return Math.floor(damage)
}

export const getCaptureRate = (pokemon, ballId) => {
    const ballSuccessRate = {
        1: 1,
        2: 1.5,
        3: 2,
        13: Infinity
    }

    const maxHp = pokemon.stat.hp
    const currentHp = pokemon.currentHp
    const pokemonCaptureRate = pokemon.captureRate
    const successRate = ballSuccessRate[ballId]

    const captureRate = ((3 * maxHp - 2 * currentHp) * pokemonCaptureRate * successRate) / (765 * maxHp)
    return captureRate > Math.random()
}