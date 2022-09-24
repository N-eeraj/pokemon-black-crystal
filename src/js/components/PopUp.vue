<template>
	<div class="pop-up-wrapper">
		<div class="pop-up-card">
			<img
				v-if="close"
				:src="require(`@/assets/icons/cross-mark.svg`)"
				width="20"
				class="close-icon"
				@click="closePopUp" />
			<slot name="title"></slot>
			<div class="body-container">
				<slot name="body"></slot>
			</div>
			<div class="actions-container">
				<slot name="actions"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'pop-up',
		props: {
			close: {
				type: Boolean,
				required: false,
				default: false
			}
		},
		methods: {
			closePopUp() {
				this.$emit('close-pop-up')
			}
		}
	}
</script>

<style lang="scss" src="@/styles/popUp.scss"></style>