export const capitalize = str => `${str[0].toUpperCase()}${str.slice(1)}`;

export const getRandomPokemonId = () => Math.ceil(Math.random() * 809);

export const getIdFromUrl = url => Number(url.split('/').splice(-2, 1)[0]);

export const promiseGenerator = url => new Promise(resolve => fetch(url)
    .then(response => response.json()
    .then(data => resolve(data))));