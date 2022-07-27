<template>
	<main>
		<splash-screen v-if="showSplashScreen"></splash-screen>
		<router-view v-else/>
	</main>
	<div id="rotate_device" style="background-color: $white">
		Please rotate your device
	</div>
</template>

<script>
	import SplashScreen from './components/SplashScreen.vue'

	export default {
		components: {
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