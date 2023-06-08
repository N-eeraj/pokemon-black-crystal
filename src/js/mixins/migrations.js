import { appName, appVersion, decryptAndLoad } from '@/js/mixins/common'
import { getSprite } from '@/js/mixins/imageAndSprites'
import { getStorage, setStorage, deleteStorage } from '@/js/mixins/storage'

const migration_v_1_8_0 = version => {
    if (getStorage('pokemonData') && (!version || version < '1.8.0')) {
        const pokemonData = JSON.parse(getStorage('pokemonData'))
        Object.entries(pokemonData).forEach(([id, { name }]) => pokemonData[id].sprite = getSprite(name))
        const gameData = getStorage('gameData')
        setStorage('pokemonData', JSON.stringify(pokemonData))

        deleteStorage('gameData')
        setStorage(appName, gameData)
    }
}

const migration_v_1_9_2 = version => {
    if (!version) return
    const { gameData } = decryptAndLoad()
    let pokeballs = gameData.progress.bag[1]
    pokeballs += 5
    gameData.progress.bag[1] = pokeballs || 5
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}


const updateVersion = () => {
    const currentVersion = getStorage('version')

    if (!(currentVersion && currentVersion === appVersion)) {
        setStorage('version', appVersion)

        migration_v_1_8_0(currentVersion)
        migration_v_1_9_2(currentVersion)
    }
}

export default updateVersion