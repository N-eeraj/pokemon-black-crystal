export const encryptAndSave = (data) => localStorage.setItem('gameData', btoa(JSON.stringify(data)))

export const decryptAndLoad = () => JSON.parse(window.atob(localStorage.gameData))

export const deepCopy = (value) => {
    return { ...value }
}

export const getIdFromUrl = (url) => Number(url.split('/').slice(-2, -1)[0])