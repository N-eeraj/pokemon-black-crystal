import appPackage from '@/../package.json'

const migration_v_1_8_0 = version => {
    if (localStorage.pokemonData && (!version || version < '1.8.0')) {
        const gameData = localStorage.getItem('gameData')
        localStorage.removeItem('gameData')
        localStorage.removeItem('pokemonData')
        localStorage.setItem(appPackage.name, gameData)
    }
}


const updateVersion = () => {
    const currentVersion = localStorage.version

    if (!(currentVersion && currentVersion === appPackage.version)) {
        localStorage.setItem('version', appPackage.version)

        migration_v_1_8_0(currentVersion)
    }
}

export default updateVersion