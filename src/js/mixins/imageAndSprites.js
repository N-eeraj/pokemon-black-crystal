export default {
  methods: {
	getImageUrl(name) {
		return `https://img.pokemondb.net/sprites/home/normal/${name}.png`
	},

	getSpriteUrl(name) {
		return {
			front: `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`,
			back: `https://img.pokemondb.net/sprites/black-white/anim/back-normal/${name}.gif`
		}
	}
  }
}