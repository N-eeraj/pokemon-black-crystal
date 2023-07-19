import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage, deleteStorage } from '@/js/mixins/storage'
import story from '@/assets/data/story'

const migration_v_1_9_7 = (version) => {
    deleteStorage('version')
    if (!version || version >= '1.9.70') return
    const { gameData } = decryptAndLoad()
    const missedCoins = story.reduce((total, {level, payUp}) => {
        if (level < gameData.progress.level)
            total += payUp
        return total
    }, 0)
    gameData.progress.coins += missedCoins
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_1_9_7