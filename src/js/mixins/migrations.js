import { appName, appVersion } from '@/js/mixins/common'
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


const updateVersion = () => {
    const currentVersion = getStorage('version')

    if (!(currentVersion && currentVersion === appVersion)) {
        setStorage('version', appVersion)

        migration_v_1_8_0(currentVersion)
    }
}

export default updateVersion