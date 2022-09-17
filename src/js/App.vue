<template>
	<splash-screen v-if="showSplashScreen" @loading-complete="startGame"></splash-screen>
	<router-view v-else id="main"/>
	<rotate-screen />
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
				showSplashScreen: true
			}
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