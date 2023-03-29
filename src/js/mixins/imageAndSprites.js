export const getImageUrl = (name) => `https://img.pokemondb.net/sprites/home/normal/${name}.png`


export function getSpriteUrl(name) {
    name = name === 'deoxys-normal' ? 'deoxys' : name.replaceAll('-', '')

    return {
        front: `https://play.pokemonshowdown.com/sprites/ani/${name}.gif`,
        back: `https://play.pokemonshowdown.com/sprites/ani-back/${name}.gif`
    }
}