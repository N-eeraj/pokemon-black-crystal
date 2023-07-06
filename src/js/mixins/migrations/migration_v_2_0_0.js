import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_0_0 = () => {
    const { gameData } = decryptAndLoad()
    gameData.dailyRewards = {
        streak: 0,
        last: 0
    }
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_0_0