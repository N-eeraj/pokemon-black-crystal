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
				:class="hpClass" />
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
		},

		computed: {
			hpClass() {
				const healthPercentage = this.pokemon.currentHp / this.pokemon.stat.hp
				if (healthPercentage > 0.65) return 'high'
				if (healthPercentage > 0.25) return 'medium'
				return 'low'
			}
		}
	}
</script>