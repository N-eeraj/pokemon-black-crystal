// const allowedCategories = [0, 3, 4, 6, 7, 8]

// const filterByCategory = moves =>
	// fetch(move.url)
	// .then(response => response.json())
	// .then(data => {
	// 	let category = Number(data.meta.category.url.split('/')[6])
	// 	if (allowedCategories.includes(category)) {
	// 		move.id = data.id
	// 	}
	// })

export default function getFilteredMoves(moves) {
	let levelUpMoves = moves
		.filter(move => move.version_group_details[0].move_learn_method.name === 'level-up')
		.map(move => {
			return {
				name: move.move.name,
				url: move.move.url,
				level: move.version_group_details[0].level_learned_at
			}
		})
	return levelUpMoves
}