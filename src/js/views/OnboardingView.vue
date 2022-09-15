<template>
	<div>
		<section>
			<div v-if="selectStarter">
				<img
				width='25'
					v-for="(pokemon, index) in starters"
					:key="index"
					:src="require('@/assets/images/pokeball.png')"
					alt="Pokeball"
					@click="selectPokemon(pokemon)">
			</div>
			<!-- <img :src="require(`@/assets/images/${characterName}.png`)" :alt="characterName"> -->
		</section>
		<p>
			{{ message }}
		</p>
		<button>
			Next
		</button>
	</div>
</template>

<script>
	import imageAndSprites from '@/js/mixins/imageAndSprites'
	import data from '@/assets/data/onboarding.json'
	export default {
		mixins: [imageAndSprites],
		data() {
			return {
				selectStarter: false
			}
		},
		created() {
			console.log(data)
		},
		methods: {
			selectPokemon(pokemon) {
				const pokemonName = pokemon.name.toLowerCase()
				console.log(this.getImageUrl(pokemonName))
			}
		},
	}
</script>