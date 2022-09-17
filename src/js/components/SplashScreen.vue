<template>
	<div id="splash_screen" @click="emitLoaded">
		<div id="title">
			<img src="@/assets/images/pokemon-logo.png" alt="Pokémon">
			<h1>Black Crystal</h1>
		</div>
		<div id="loading">
			<span v-if="isLoading">
				Loading
			</span>
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
			}
		},
		created() {
			this.loadData()
		},
		methods: {
			async loadData() {
				await Promise.all([
					this.$store.dispatch('fetchMoves'),
					this.$store.dispatch('fetchGrowthRates'),
					this.$store.dispatch('fetchTypes')
				])
				if (localStorage.gameData)
					await this.$store.dispatch('fetchData')
				else
					this.$router.push({
						path: '/welcome'
					})
				this.isLoading = false
			},
			emitLoaded() {
				if (this.isLoading) return
				this.$emit('loading-complete')
			}
		},
	}
</script>

<style lang="scss" scoped src="@/styles/splashScreen.scss"></style>