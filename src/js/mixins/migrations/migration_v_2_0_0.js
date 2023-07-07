import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_0_0 = (version) => {
    if (!version || version > '2.0.00') return
    const { gameData } = decryptAndLoad()
    gameData.dailyRewards = {
        streak: 0,
        last: 0
    }
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_0_0