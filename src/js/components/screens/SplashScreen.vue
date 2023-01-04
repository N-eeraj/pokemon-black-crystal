<template>
	<div
		id="splash_screen"
		:class="{ loaded : !isLoading }"
		@click="emitLoaded">
		<div id="title">
			<img
				src="@/assets/images/pokemon-logo.png"
				alt="Pokémon" />
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
	import { mapActions } from 'vuex'

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
					this.fetchMoves(),
					this.fetchGrowthRates(),
					this.fetchTypes()
				])

				if (localStorage.gameData) await this.fetchData()
				else this.$router.push('/welcome')

				this.isLoading = false
			},

			emitLoaded() {
				if (this.isLoading) return
				this.$emit('loading-complete')
			},

			...mapActions([
				'fetchMoves',
				'fetchGrowthRates',
				'fetchTypes',
				'fetchData'
			])
		},
	}
</script>

<style lang="scss" scoped src="@/styles/screens/splashScreen.scss"></style>