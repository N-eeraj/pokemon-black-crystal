<template>
	<offline-screen v-if="isOffline" />
	<template v-else>
		<splash-screen v-if="showSplashScreen" @loading-complete="startGame" />
		<router-view v-else id="main" />
		<rotate-screen v-if="isSmallScreen" />
	</template>
</template>

<script>

	import SplashScreen from './components/screens/SplashScreen.vue'
	import RotateScreen from './components/screens/RotateScreen.vue'
	import OfflineScreen from './components/screens/OfflineScreen.vue'

	import { mapGetters, mapActions } from 'vuex'


	export default {
		components: {
			SplashScreen,
			RotateScreen,
			OfflineScreen,
		},

		data() {
			return {
				showSplashScreen: true,
				isSmallScreen: false
			}
		},

		beforeCreate() {
			window.visualViewport.addEventListener('resize', event => {
				if (event.target) {
					const { height } = event.target
					this.isSmallScreen = height < 360
				}
			})
		},

		mounted() {
			setInterval(() => {
				this.updateOfflineStats()
			}, 10000);
		},

		computed: {
			...mapGetters([
				'isOffline',
			])
		},

		methods: {
			startGame() {
				this.showSplashScreen = false
			},

			...mapActions([
				'updateOfflineStats'
			])
		},

		watch: {
			$route(to) {
				if (to.name === 'NotFound') return this.showSplashScreen = false
			}
		}
	}
</script>

<style lang="scss" src="@/styles/app.scss"></style>