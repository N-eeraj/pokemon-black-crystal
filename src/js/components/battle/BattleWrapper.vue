<template>
	<battle-scene
		v-if="battle.ongoing"
		:playerParty="playerParty"
		:foeParty="foeParty"
		:saveBattle="saveBattle" />
	<div
		v-else
		id="battle_wrapper"
		:style="`background-image: url(${foeDetails.image})`">
		<img
			v-if="close"
			:src="require(`@/assets/icons/cross-mark.svg`)"
			class="close-icon dark"
			@click="emitClose" />
		<div class="overlay">
			<button 
				class="battle-btn"
				@click="startBattle">
				Battle
			</button>
			<p>
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script>
	import BattleScene from "@/js/components/battle/scene/BattleScene.vue"

	export default {
		name: 'battle-wrapper',
		components: {
			BattleScene
		},
		
		props: {
			playerParty: {
				type: Object,
				required: true
			},
			foeParty: {
				type: Object,
				required: true
			},
			saveBattle: {
				type: Boolean,
				required: false,
				default: false
			},
			foeDetails: {
				type: Object,
				required: true
			},
			close: {
				type: Boolean,
				required: false,
				default: false
			}
		},

		data() {
			return {
				message: null,
				battle: {
					ongoing: false,
					victory: false
				}
			}
		},

		created() {
			this.message = `${this.foeDetails.name} wants to battle`
		},
		methods: {
			emitClose() {
				this.$emit('close')
			},

			startBattle() {
				this.battle.ongoing = true
			}
		},
	}
</script>

<style lang="scss" src="@/styles/battle/wrapper.scss"></style>