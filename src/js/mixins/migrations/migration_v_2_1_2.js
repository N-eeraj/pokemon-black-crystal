import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_1_2 = (version) => {
    if (!version || version > '2.1.20') return
    const { gameData } = decryptAndLoad()
    gameData.achievements = {
        "arcade": {
            "battle": gameData.progress.arcade.battle.victories,
            "tent": gameData.progress.arcade.tent.victories,
            "tower": gameData.progress.arcade.tower.victories
        },
        "multiplayer": {
            "trade": 0,
            "pvp": 0
        },
        "carnival": {
            "whosThatPokemon": 0,
            "findingDitto": 0,
            "berryCrusher": 0,
            "pokemonRoulette": 0,
            "pokemonDash": 0,
            "blockSmash": 0
        }
    }
    delete gameData.progress.arcade
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_1_2