export const getStorage = key => localStorage[key]

export const setStorage = (key, value) => localStorage.setItem(key, value)

export const deleteStorage = key => localStorage.removeItem(key)