<template>
	<label class="switch" :class="{active: modelValue}">
		<input
			:value="modelValue"
			type="checkbox"
			@change="$emit('update:modelValue', !modelValue)" />
	</label>
</template>

<script>
	export default {
		name: 'toggle-switch',
		props: {
			modelValue: {
				type: Boolean,
				required: false,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped src="@/styles/UI/switch.scss"></style>