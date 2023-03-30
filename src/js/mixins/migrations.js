const migration_v_1_8_0 = version => {
    if (localStorage.pokemonData && (!version || version < '1.8.0')) {
        const gameData = localStorage.getItem('gameData')
        localStorage.removeItem('gameData')
        localStorage.removeItem('pokemonData')
        localStorage.setItem('pokemon-black-crystal', gameData)
    }
}


const updateVersion = () => {
    const latestVersion = '1.8.0'
    const currentVersion = localStorage.version

    if (!(currentVersion && currentVersion === latestVersion)) {
        localStorage.setItem('version', latestVersion)

        migration_v_1_8_0(currentVersion)
    }
}

export default updateVersion