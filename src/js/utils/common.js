export const capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`

export const getRandomPokemonId = () => Math.ceil(Math.random() * 809)