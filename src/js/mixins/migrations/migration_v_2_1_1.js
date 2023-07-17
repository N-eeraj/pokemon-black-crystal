import { appName, decryptAndLoad } from '@/js/mixins/common'
import { setStorage } from '@/js/mixins/storage'

const migration_v_2_1_1 = (version) => {
    if (!version || version > '2.1.10') return
    const { gameData } = decryptAndLoad()
    const boxes = {}
    gameData.pokemon.pc.forEach((pokemon, index) => {
        const boxNumber = Math.floor(index / 30) + 1
        const box = `Box ${boxNumber}`
        if (box in boxes)
            boxes[box].push(pokemon)
        else
            boxes[box] = [pokemon]
    })
    gameData.pokemon.pc = boxes
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
}

export default migration_v_2_1_1