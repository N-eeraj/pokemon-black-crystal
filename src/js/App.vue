<template>
	<splash-screen v-if="showSplashScreen" @loading-complete="startGame" />
	<router-view v-else id="main" />
	<rotate-screen v-if="isSmallScreen" />
</template>

<script>
	import SplashScreen from './components/SplashScreen.vue'
	import RotateScreen from './components/RotateScreen.vue'

	export default {
		components: {
			SplashScreen,
			RotateScreen,
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
		methods: {
			startGame() {
				this.showSplashScreen = false
			}
		},
		watch:{
			$route(to) {
				if (to.name === 'NotFound') return this.showSplashScreen = false
			}
		}
	}
</script>

<style lang="scss" src="@/styles/app.scss"></style>