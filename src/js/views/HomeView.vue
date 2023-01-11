<template>
	<div>
		<div
			class="home-container"
			:style="`background-image: url(${characterImage});`">

		</div>
	</div>
</template>

<script>

	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
			}
		},

		computed: {
			characterImage() {
				return require(`@/assets/images/characters/main-character/character-${this.getAvatar}.gif`)
			},

			...mapGetters([
				'getAvatar'
			])
		}
	}
</script>

<style lang="scss" scoped src="@/styles/home.scss"></style>