import store from '@/js/store/store'

export const toTitleCase = text => text
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ')

export const encryptAndSave = () => {
    const { gameData, pokemonData } = store.state
    localStorage.setItem('gameData', btoa(JSON.stringify(gameData)))
    localStorage.setItem('pokemonData', JSON.stringify(pokemonData))
}

export const decryptAndLoad = () => {
    const gameData = JSON.parse(window.atob(localStorage.gameData))
    let pokemonData = JSON.parse(localStorage.pokemonData || '{}')
    return { gameData, pokemonData }
}

export const deepCopy = (value) => {
    return { ...value }
}

export const getIdFromUrl = (url) => Number(url.split('/').slice(-2, -1)[0])

export const clamp = (min, num, max) => Math.min(Math.max(num, min), max)