<template>
	<router-view id="main"/>
	<splash-screen v-if="showSplashScreen"></splash-screen>
	<rotate-screen></rotate-screen>
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
		watch:{
			$route(to) {
				if (to.name === 'NotFound')
					return this.showSplashScreen = false
				return this.showSplashScreen = true
			}
		} 
	}
</script>

<style lang="scss" src="@/styles/app.scss"></style>