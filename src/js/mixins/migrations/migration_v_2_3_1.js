import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_3_1 = (version) => {
    if (!version || version > '2.3.10') return

    const { gameData } = decryptAndLoad()
    gameData.lastSafariZone = 0
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_3_1