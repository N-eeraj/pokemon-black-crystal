function getAttackDefenseRatio(damageClass, attacker, defender) {
    if (damageClass === "physical") return attacker.stat.attack / defender.stat.defense
    return attacker.stat['special-attack'] / defender.stat['special-defense']
}

export default {
	moveDamage(move, attacker, defender) {
        const STAB = attacker.types.includes(move.type) ? 1.5 : 1 // same type attack bonus
        const random = Math.random() * 0.2 + 0.8 // random number between 0.8 & 1
        const level = attacker.level // level of attacking pokemon
        const power = move.power // power of the move
        // ratio between attacking pokemon's offence & defening pokemon's defense
        const attackDefenseRatio = getAttackDefenseRatio(move.damageClass, attacker, defender)

        return Math.floor(STAB * random * (2 + (0.4 * level + 2) * power * attackDefenseRatio * 0.02))
	}
}