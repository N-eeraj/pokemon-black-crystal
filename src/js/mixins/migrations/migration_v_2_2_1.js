const migration_v_2_2_1 = (version) => {
    if (!version || version > '2.2.10') return

    const unique = items => [...new Set(items)]
    const pokemonData = JSON.parse(localStorage.pokemonData)

    Object.entries(pokemonData).forEach(([id, {evolution, ...data}]) => {
        const {levelUp, happinessUp, trade} = evolution
        levelUp.pokemon = unique(levelUp.pokemon)
        happinessUp.pokemon = unique(happinessUp.pokemon)
        evolution.trade = unique(trade)
        pokemonData[id] = {evolution, ...data}
    })
    localStorage.setItem('pokemonData', JSON.stringify(pokemonData))
}

export default migration_v_2_2_1