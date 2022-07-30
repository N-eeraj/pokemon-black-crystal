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
			if (localStorage.length)
				console.log(localStorage);
			else
				console.log(localStorage);
		},
	}
</script>

<style lang="scss" scoped src="@/styles/splashScreen.scss"></style>