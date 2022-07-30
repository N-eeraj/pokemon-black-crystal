<template>
	<div id="splash_screen">
		<div id="title">
			<img src="@/assets/images/pokemon-logo.png" alt="Pokémon">
			<h1>Black Crystal</h1>
		</div>
		<div id="loading">
			<template v-if="isLoading">
				<progress value="50" max="100"></progress>
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
				isLoading: true
			}
		},
	}
</script>

<style lang="scss" scoped src="@/styles/splashScreen.scss"></style>