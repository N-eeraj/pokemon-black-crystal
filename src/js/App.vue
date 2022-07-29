<template>
	<main>
		<splash-screen v-if="showSplashScreen"></splash-screen>
		<router-view v-else/>
	</main>
	<rotate-screen></rotate-screen>
</template>

<script>
	import RotateScreen from './components/RotateScreen.vue'
	import SplashScreen from './components/SplashScreen.vue'

	export default {
		components: {
			RotateScreen,
			SplashScreen
		},
		data() {
			return {
				showSplashScreen: !true
			}
		},
		mounted() {
		},
	}
</script>

<style lang="scss" src="@/styles/app.scss"></style>