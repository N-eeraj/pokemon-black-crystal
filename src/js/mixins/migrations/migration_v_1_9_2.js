import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_1_9_2 = version => {
    if (!version || version > '1.9.2') return
    const { gameData } = decryptAndLoad()
    let pokeballs = gameData.progress.bag[1]
    pokeballs += 5
    gameData.progress.bag[1] = pokeballs || 5
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_1_9_2