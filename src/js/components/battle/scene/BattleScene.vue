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
			<button
				class="moves"
				@click="listPokemonMoves">
				Moves
			</button>
			<button
				class="pokemon"
				@click="listPartyPokemon">
				Pokémon
			</button>
		</div>

		<moves-list
			v-if="show.moveset && moveset"
			:moveset="moveset"
			@closeMoveset="show.moveset=false" />

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
	import MovesList from "@/js/components/battle/MovesList.vue"

	import { mapGetters, mapActions } from 'vuex'

	export default {
		name: 'battle-scene',
		components: {
			PopUp,
			BattlePokemon,
			MovesList
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
				moveset: null,
				show: {
					moveset: false,
					party: false
				},
				modal: {
					confirmEscape: false
				}
			}
		},

		computed: {
			showPokeballAction() {
				return Boolean(this.canCatch && Object.keys(this.availablePokeballs).length)
			}
		},

		async created() {
			// to-do: check & show available pokeballs
			this.availablePokeballs = this.getAvailableBalls()
			// console.log(this.availablePokeballs)

			await this.setBattleParty(this.playerParty, 'trainer')
			await this.setBattleParty(this.foeParty, 'foe')
		},

		methods: {
			async setBattleParty(partyIds, trainer) {
				await partyIds.forEach(async (pokemon, index) => {
					let data = await this.getPokemonById(pokemon.pokemon)
					data.level = data.getLevel(pokemon.exp)
					data.movesList = data.getMovesByLevel(pokemon.exp)
					data.stat = data.getStat(pokemon.exp)
					data.currentHp = data.stat.hp
					this.battle[trainer].partyList[index] = data
				})
			},

			listPokemonMoves() {
				this.moveset = this.battle.trainer.partyList[this.battle.trainer.currentPokemonIndex].movesList
				this.show.moveset = true
			},

			listPartyPokemon() {
				this.show.party = true
				console.log(this.battle.trainer.partyList)
			},

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