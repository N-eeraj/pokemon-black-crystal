<template>
	<div id="splash_screen">
		<div id="title">
			<img src="@/assets/images/pokemon-logo.png" alt="Pokémon">
			<h1>Black Crystal</h1>
		</div>
		<div id="loading">
			<template v-if="isLoading">
				<progress :value="progress.max" :max="progress.max"></progress>
				<span>Loading</span>
			</template>
			<span v-else>
				Click to continue
			</span>
		</div>
	</div>
</template>

<script>
	import getPokemon from '@/js/utils/getPokemon.js'
	export default {
		name: 'splash-screen',
		data() {
			return {
				isLoading: true,
				progress: {
					loaded: 0,
					max: 0
				}
			}
		},
		mounted() {
			if (!localStorage.length) return console.log(localStorage)
			this.$store.commit('loadData', localStorage.gameData)
			getPokemon(4, 1000, 1)
		},
	}
</script>

<style lang="scss" scoped src="@/styles/splashScreen.scss"></style>