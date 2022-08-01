import { capitalize } from './common.js'
import getFilteredMoves from './getMoves.js'

export default function getPokemon(pokemonId, currentExp, encounterId) {
	const pokemon = {
		encounterId,
		pokemonId,
		currentExp
	}
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
	.then(response => response.json())
	.then(data => {
		pokemon.name = capitalize(data.name)
		pokemon.types = data.types.map(type => capitalize(type.type.name))
		pokemon.image = `https://www.serebii.net/swordshield/pokemon/${String(pokemonId).padStart(3, '0')}.png`
		pokemon.sprite = {
			back: data.sprites.back_default,
			front: data.sprites.front_default
		}
		pokemon.height = data.height * 10
		pokemon.weight = data.weight * 10
		pokemon.baseStat = {}
		data.stats.forEach(stat => pokemon.baseStat[stat.stat.name] = stat.base_stat)
		pokemon.baseExp = data.base_experience
		pokemon.moves = getFilteredMoves(data.moves)

		// pokemon.level
		// pokemon.catchRate
		// pokemon.damage
		// pokemon.evolution
		console.log(data)
		console.log(pokemon)
	})
}