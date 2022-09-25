<template>
	<div id="battle_scene">
		<div class="battle-field">
			<img
				v-if="canEscape"
				:src="require(`@/assets/icons/escape.svg`)"
				class="icon escape"
				@click="confirmEscape" />
			<img
				v-if="showPokeballAction"
				:src="require(`@/assets/icons/pokeball.svg`)"
				class="icon pokeball"
				@click="showPokeballs" />
		</div>
		<div class="actions">
			<button class="moves">Moves</button>
			<button class="pokemon">Pokémon</button>
		</div>
		<pop-up
			v-if="modal.confirmEscape"
			close
			class="modal"
			@close-pop-up="closePopUp('confirmEscape')">
			<template #body>
				<div class="escape-confirmation">
					<p>
						Are you sure you want to escape this battle?
					</p>
				</div>
			</template>
			<template #actions>
				<button class="confirm" @click="escape">
					Yes
				</button>
			</template>
		</pop-up>
	</div>
</template>

<script>
	import PopUp from "@/js/components/PopUp.vue"
	import { mapActions } from 'vuex'

	export default {
		name: 'battle-scene',
		components: {
			PopUp
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
			canCatch: {
				type: Boolean,
				required: false,
				default: false
			},
			canEscape: {
				type: Boolean,
				required: false,
				default: false
			},
			isMultiplayer: {
				type: Boolean,
				required: false,
				default: false
			}
		},

		data() {
			return {
				availablePokeballs: null,
				modal: {
					confirmEscape: false
				}
			}
		},

		computed: {
			showPokeballAction() {
				return this.canCatch && Object.keys(this.availablePokeballs).length
			}
		},

		async mounted() {
			// to-do: check & show available pokeballs
			this.availablePokeballs = await this.getAvailableBalls()
			console.log(this.availablePokeballs)
		},

		methods: {
			closePopUp(popUpName) {
				this.modal[popUpName] = false
			},

			confirmEscape() {
				this.modal.confirmEscape = true
			},

			escape() {
				this.closePopUp('confirmEscape')
				this.$emit('escape')
			},

			showPokeballs() {
				console.log('show available pokeballs')
			},

			...mapActions([
				'getAvailableBalls'
			])
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/styles/battle/scene", "@/styles/pokemonList";
</style>