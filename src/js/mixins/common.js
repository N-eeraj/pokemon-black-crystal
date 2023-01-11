export const getIdFromUrl = (url) => Number(url.split('/').slice(-2, -1)[0])

export const deepCopy = (value) => {
    return { ...value }
}