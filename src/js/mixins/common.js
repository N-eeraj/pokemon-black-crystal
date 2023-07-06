import appPackage from '@/../package.json'

import { getStorage, setStorage } from '@/js/mixins/storage'

import store from '@/js/store/store'

export const appName = appPackage.name

export const appVersion = appPackage.version

export const encryptAndSave = () => {
    const { gameData, pokemonData } = store.state
    setStorage(appName, window.btoa(JSON.stringify(gameData)))
    setStorage('pokemonData', JSON.stringify(pokemonData))
}

export const decryptAndLoad = () => {
    const gameData = JSON.parse(window.atob(getStorage(appName)))
    let pokemonData = JSON.parse(getStorage('pokemonData') || '{}')
    return { gameData, pokemonData }
}

export const toTitleCase = text => text
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')

export const deepCopy = value => JSON.parse(JSON.stringify(value))

export const getIdFromUrl = url => Number(url.split('/').slice(-2, -1)[0])

export const clamp = (min, num, max) => Math.min(Math.max(num, min), max)