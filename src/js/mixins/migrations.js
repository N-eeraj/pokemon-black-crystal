import appPackage from '@/../package.json'

import { getSprite } from "@/js/mixins/imageAndSprites"

const migration_v_1_8_0 = version => {
    if (localStorage.pokemonData && (!version || version < '1.8.0')) {
        const pokemonData = JSON.parse(localStorage.getItem('pokemonData'))
        Object.entries(pokemonData).forEach(([id, { name }]) => pokemonData[id].sprite = getSprite(name))
        const gameData = localStorage.getItem('gameData')
        localStorage.setItem('pokemonData', JSON.stringify(pokemonData))

        localStorage.removeItem('gameData')
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