<template>
	<div
		class="battle-pokemon"
		:class="isFoe ? 'front' : 'back'">
		<div class="status">
			<strong>
				{{ $filters.toTitleCase(pokemon.name) }}
			</strong>
			<span>
				Level
				{{ pokemon.level }}
			</span>
			<progress
				:value="pokemon.currentHp"
				:max="pokemon.stat.hp"
				:class="{high: true}" />
		</div>
		<div class="pokemon">
			<img
				:src="pokemon.sprite[isFoe ? 'front' : 'back']"
				class />
		</div>
	</div>
</template>

<script>
	export default {
		name: 'battle-pokemon',
		props: {
			pokemon: {
				type: Object,
				required: true
			},
			isFoe: {
				type: Boolean,
				required: false,
				default: false
			}
		}
	}
</script>

<style lang="scss" src="@/styles/battle/pokemon.scss"></style>