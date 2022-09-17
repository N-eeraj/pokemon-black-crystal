export default {
  methods: {
	getImageUrl(name) {
		return `https://img.pokemondb.net/sprites/go/normal/1x/${name}.png`
	},

	getSpriteUrl(name) {
		return {
			front: `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`,
			back: `https://img.pokemondb.net/sprites/black-white/anim/back-normal/${name}.gif`
		}
	}
  }
}