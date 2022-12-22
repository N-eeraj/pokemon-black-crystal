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

			<battle-pokemon
				v-if="battle.foe.partyList.length"
				:pokemon="battle.foe.partyList[battle.foe.currentPokemonIndex]"
				isFoe />
			<battle-pokemon
				v-if="battle.trainer.partyList.length"
				:pokemon="battle.trainer.partyList[battle.trainer.currentPokemonIndex]"/>
		</div>

		<div class="actions">
			<button class="moves">
				Moves
			</button>
			<button class="pokemon">
				Pokémon
			</button>
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
	import BattlePokemon from "@/js/components/battle/scene/BattlePokemon.vue"

	import { mapGetters, mapActions } from 'vuex'

	export default {
		name: 'battle-scene',
		components: {
			PopUp,
			BattlePokemon
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
				battle: {
					trainer: {
						partyList: [],
						currentPokemonIndex: 0
					},
					foe: {
						partyList: [],
						currentPokemonIndex: 0
					}
				},
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

		async created() {
			// to-do: check & show available pokeballs
			this.availablePokeballs = await this.getAvailableBalls()
			// console.log(this.availablePokeballs)

			await this.playerParty.forEach(async (pokemon, index) => {
				let data = await this.getPokemonById(pokemon.pokemon)
				data.level = data.getLevel(pokemon.exp)
				data.movesList = data.getMovesByLevel(pokemon.exp)
				data.stat = data.getStat(pokemon.exp)
				data.currentHp = data.stat.hp
				this.battle.trainer.partyList[index] = data
			})
			await this.foeParty.forEach(async (pokemon, index) => {
				let data = await this.getPokemonById(pokemon.pokemon)
				data.level = data.getLevel(pokemon.exp)
				data.movesList = data.getMovesByLevel(pokemon.exp)
				data.stat = data.getStat(pokemon.exp)
				data.currentHp = data.stat.hp
				this.battle.foe.partyList[index] = data
			})
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

			...mapGetters([
				'getAvailableBalls'
			]),

			...mapActions([
				'getPokemonById'
			])
		}
	}
</script>

<style lang="scss">
	@import "@/styles/battle/scene", "@/styles/pokemonList";
</style>