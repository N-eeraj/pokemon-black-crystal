export const getImageUrl = (name) => `https://img.pokemondb.net/sprites/home/normal/${name}.png`


export function getSpriteUrl(name) {
    return {
        front: `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`,
        back: `https://img.pokemondb.net/sprites/black-white/anim/back-normal/${name}.gif`
    }
}