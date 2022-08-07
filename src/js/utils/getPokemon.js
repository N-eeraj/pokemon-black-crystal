import { capitalize } from './common.js';
import { promiseGenerator } from './common.js';
import { getIdFromUrl } from './common.js';

const getMoves = moves => new Promise(resolve => {
	const moveLearnedLevel = {};
	moves.forEach(move => moveLearnedLevel[getIdFromUrl(move.move.url)] = move.version_group_details[0].level_learned_at);
	Promise.all(
		moves
		.filter(move => move.version_group_details[0].move_learn_method.name === 'level-up')
		.map(move => promiseGenerator(move.move.url)))
		.then(data => resolve(
			data.map((moveData, index) => {
				let moveCategory = getIdFromUrl(moveData.meta.category.url);
				if ([0, 3, 4, 6, 7, 8].includes(moveCategory)) {
					let category;
					switch (category) {
						case 3:
							category = 'heal';
							break;
						case 8:
							category = 'absorb';
							break;
						default:
							category = 'damage'
					}
					return {
						id: data[index].id,
						name: capitalize(data[index].name),
						type: capitalize(data[index].type.name),
						power: data[index].power,
						pp: data[index].pp,
						accuracy: data[index].accuracy,
						priority: data[index].priority,
						level: moveLearnedLevel[data[index].id],
						damageClass: data[index].damage_class.name,
						category
					};
				}
			})
			.filter(move => move)
		)
	)
});

export default function getPokemon(pokemonId, currentExp, encounterId) {
	const pokemon = {
		encounterId,
		pokemonId,
		currentExp
	}
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
	.then(response => response.json())
	.then(data => {

		pokemon.name = capitalize(data.name);
		pokemon.types = data.types.map(type => capitalize(type.type.name));
		pokemon.image = `https://www.serebii.net/swordshield/pokemon/${String(pokemonId).padStart(3, '0')}.png`;
		pokemon.sprite = {
			back: data.sprites.back_default,
			front: data.sprites.front_default
		};
		pokemon.height = data.height * 10;
		pokemon.weight = data.weight * 10;
		pokemon.baseStat = {};
		data.stats.forEach(stat => pokemon.baseStat[stat.stat.name] = stat.base_stat);
		pokemon.baseExp = data.base_experience;

		const promiseList = [getMoves(data.moves)];

		Promise.all(promiseList)
		.then(([moves]) => {
			console.log(moves);
		});
		

		// pokemon.level
		// pokemon.catchRate
		// pokemon.damage
		// pokemon.evolution
		// console.log(data)
		// console.log(pokemon)
	})
}