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
				v-if="battleData?.foe.partyList.length"
				:pokemon="currentPokemon.foe"
				isFoe />
			<battle-pokemon
				v-if="battleData?.trainer.partyList.length"
				:pokemon="currentPokemon.trainer"/>
		</div>

		<div
			v-if="battleMessage"
			class="battle-message">
			{{ battleMessage }}
		</div>
		<div
			v-else
			class="actions">
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
			v-if="show.moveset && battleData"
			@useMove="useMove"
			@closeMoveset="hidePokemonMoves" />

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

	import randomGenerator from "@/js/mixins/randomGenerator"
	import messages from "@/js/mixins/messages"

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
				trainerPokemonMoveset: null,
				show: {
					moveset: false,
					party: false
				},
				modal: {
					confirmEscape: false
				},
				battleMessage: null
			}
		},

		computed: {
			showPokeballAction() {
				return Boolean(this.canCatch && Object.keys(this.availablePokeballs).length)
			},

			battleData() {
				return this.getBattleData()
			},

			currentPokemon() {
				return {
					foe: this.battleData.foe.partyList[this.battleData.foe.currentPokemonIndex],
					trainer: this.battleData.trainer.partyList[this.battleData.trainer.currentPokemonIndex]
				}
			},
			
			...mapGetters([
				'getMovesByName'
			]),
		},

		async created() {
			// to-do: check & show available pokeballs
			this.availablePokeballs = this.getAvailableBalls()
			// console.log(this.availablePokeballs)

			await this.setBattleParty(this.playerParty, 'trainer')
			await this.setBattleParty(this.foeParty, 'foe')

			this.setBattleData(this.battle)
		},

		methods: {
			async setBattleParty(partyIds, trainer) {
				await partyIds.forEach(async (pokemon, index) => {
					let data = await this.getPokemonById(pokemon.pokemon)
					data.level = data.getLevel(pokemon.exp)
					data.movesList = data.getMovesByLevel(pokemon.exp)
						.map(move => {
							return {
								name: move.name,
								...this.getMovesByName(move.name)
							}
						})
					data.stat = data.getStat(pokemon.exp)
					data.currentHp = data.stat.hp
					this.battle[trainer].partyList[index] = data
				})
			},

			listPokemonMoves() {
				this.trainerPokemonMoveset = this.battle.trainer.partyList[this.battle.trainer.currentPokemonIndex].movesList
				this.show.moveset = true
			},

			hidePokemonMoves() {
				this.show.moveset = false
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

			useMove(moveData) {
				this.hidePokemonMoves()
				const trainerMessage = messages.moveMessage(this.currentPokemon.trainer, this.currentPokemon.foe, moveData, false)
				
				const foeMove = randomGenerator.getRandomMove(this.currentPokemon.foe)
				const foeMessage = messages.moveMessage(this.currentPokemon.foe, this.currentPokemon.trainer, foeMove, true)

				let firstPokemon, firstMove, firstMoveMessage, secondPokemon, secondMove, secondMoveMessage

				if (this.canAttackFirst(moveData, foeMove)) {
					firstPokemon = 'trainer'
					firstMove = {
						moveData,
						inCommingAttack: false
					}
					firstMoveMessage = trainerMessage

					secondPokemon = 'foe'
					secondMove = {
						moveData: foeMove,
						inCommingAttack: true
					}
					secondMoveMessage = foeMessage

				}
				else {
					firstPokemon = 'foe'
					firstMove = {
						moveData: foeMove,
						inCommingAttack: true
					}
					firstMoveMessage = foeMessage

					secondPokemon = 'trainer'
					secondMove = {
						moveData,
						inCommingAttack: false
					}
					secondMoveMessage = trainerMessage

				}
				
				this.useMoveBattleDataUpdate(firstMove)
				this.battleMessage = firstMoveMessage

				if (this.currentPokemon[secondPokemon].currentHp > 0) {
					setTimeout(() => {
						this.useMoveBattleDataUpdate(secondMove)
						this.battleMessage = secondMoveMessage
						if (this.currentPokemon[firstPokemon].currentHp <= 0) {
							this.battleMessage = messages.faintMessage(this.currentPokemon[firstPokemon], firstPokemon==='foe')
						}
						setTimeout(() => {
							this.battleMessage = null
						}, 2500);
					}, 2500)
				}
				else {
					this.battleMessage = messages.faintMessage(this.currentPokemon[secondPokemon], secondPokemon==='foe')
					setTimeout(() => {
						this.battleMessage = null
					}, 2500);
				}
			},

			canAttackFirst(trainerMove, foeMove) {
				if (trainerMove.priority > foeMove.priority) return true
				if (trainerMove.priority < foeMove.priority) return false
				return this.currentPokemon.trainer.stat.speed > this.currentPokemon.foe.stat.speed
			},

			...mapGetters([
				'getAvailableBalls',
				'getBattleData'
			]),

			...mapActions([
				'getPokemonById',
				'setBattleData',
				'useMoveBattleDataUpdate'
			])
		}
	}
</script>

<style lang="scss">
	@import "@/styles/battle/scene", "@/styles/pokemonList";
</style>