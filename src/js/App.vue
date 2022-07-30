<template>
	<splash-screen v-if="showSplashScreen"></splash-screen>
	<router-view v-else id="main"/>
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
				showSplashScreen: true,
			}
		},
	}
</script>

<style lang="scss" src="@/styles/app.scss"></style>