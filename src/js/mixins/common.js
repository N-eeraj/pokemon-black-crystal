import store from '@/js/store/store'

export const encryptAndSave = () => {
    const { gameData, pokemonData } = store.state
    localStorage.setItem('gameData', btoa(JSON.stringify(gameData)))
    localStorage.setItem('pokemonData', JSON.stringify(pokemonData))
}

export const decryptAndLoad = () => {
    return {
        gameData: JSON.parse(window.atob(localStorage.gameData)),
        pokemonData: JSON.parse(localStorage.pokemonData),
    }
}

export const deepCopy = (value) => {
    return { ...value }
}

export const getIdFromUrl = (url) => Number(url.split('/').slice(-2, -1)[0])