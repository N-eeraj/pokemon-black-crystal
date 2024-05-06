import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_2_3 = (version) => {
    if (!version || version > '2.2.30') return

    const { gameData } = decryptAndLoad()
    const sound = gameData.sound
    delete gameData.sound
    gameData.settings = {
        sound,
        vibrations: true,
        fullScreen: true
    }
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_2_3