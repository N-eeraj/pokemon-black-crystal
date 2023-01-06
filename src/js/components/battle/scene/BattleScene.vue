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
				v-if="!loading && currentPokemon.foe"
				:pokemon="currentPokemon.foe"
				isFoe />
			<div v-else>
			</div>
			<battle-pokemon
				v-if="!loading && currentPokemon.trainer"
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

		<pokemon-list
			v-if="show.party && battleData"
			:list="this.battleData.trainer.partyList"
			title="Pokémon"
			icon="cross-mark"
			iconAction="closeParty"
			showHp
			@closeParty="hidePartyPokemon"
			@selectedPokemon="changeCurrentPokemon" />

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
	import PopUp from "@/js/components/UI/PopUp.vue"
	import BattlePokemon from "@/js/components/battle/scene/BattlePokemon.vue"
	import MovesList from "@/js/components/battle/MovesList.vue"
	import PokemonList from "@/js/components/PokemonList.vue"

	import { mapGetters, mapActions } from 'vuex'

	import randomGenerator from "@/js/mixins/randomGenerator"
	import messages from "@/js/mixins/messages"

	export default {
		name: 'battle-scene',

		components: {
			PopUp,
			BattlePokemon,
			MovesList,
			PokemonList
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
				show: {
					moveset: false,
					party: false
				},
				modal: {
					confirmEscape: false
				},
				battleMessage: null,
				loading: true
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
			await this.setBattleParty(this.playerParty, 'trainer')
			await this.setBattleParty(this.foeParty, 'foe')
			this.setBattleData(this.battle)

			// to-do: check & show available pokeballs
			this.availablePokeballs = this.getAvailableBalls()
			// console.log(this.availablePokeballs)

			this.loading = false
		},

		methods: {
			async setBattleParty(partyIds, user) {
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
					this.battle[user].partyList[index] = data
				})
			},

			listPokemonMoves() {
				this.show.moveset = true
			},

			hidePokemonMoves() {
				this.show.moveset = false
			},

			listPartyPokemon() {
				this.show.party = true
			},

			hidePartyPokemon() {
				this.show.party = false
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

			changeCurrentPokemon(newIndex) {
				if (newIndex === this.battleData.trainer.currentPokemonIndex) return
				this.switchBattlePokemon({
					newIndex,
					isOpponent: false
				})
				this.hidePartyPokemon()
				setTimeout(() => {
					this.useMove(null)
				}, 2000);
			},

			useMove(moveData) {
				this.hidePokemonMoves()
				const trainerMessage = messages.moveMessage(this.currentPokemon.trainer, this.currentPokemon.foe, moveData, false)
				
				const foeMove = randomGenerator.getRandomMove(this.currentPokemon.foe)
				const foeMessage = messages.moveMessage(this.currentPokemon.foe, this.currentPokemon.trainer, foeMove, true)

				let firstPokemon, firstMove, firstMoveMessage, secondPokemon, secondMove, secondMoveMessage
				if (this.canAttackFirst(moveData, foeMove)) {
					// Sets the values of variable such that player makes the first move
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
					// Sets the values of variable such that oppponent makes the first move
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

				// Make the first attack and display message
				this.useMoveBattleDataUpdate(firstMove)
				this.battleMessage = firstMoveMessage

				if (this.currentPokemon[secondPokemon].currentHp > 0) {
					// the Pokémon to make the second move doesn't faint
					setTimeout(() => {
						// Make the second attack and display message
						this.useMoveBattleDataUpdate(secondMove)
						this.battleMessage = secondMoveMessage

						setTimeout(() => {
							// checks if the Pokémon that made the first attack faints
							if (this.currentPokemon[firstPokemon].currentHp <= 0) {
								this.battleMessage = messages.faintMessage(this.currentPokemon[firstPokemon], firstPokemon === 'foe')
								this.handleFaint(firstPokemon)
							}
							// if battle is not over reset battle message
							if (!this.checkGameOver()) {
								setTimeout(() => {
									this.battleMessage = null
								}, 2000);
							}
						}, 2000)
					}, 2000)
				}
				else {
					setTimeout(() => {
						// the Pokémon to make the second move faints
						this.battleMessage = messages.faintMessage(this.currentPokemon[secondPokemon], secondPokemon === 'foe')
						this.handleFaint(secondPokemon)
						// if battle is not over reset battle message
						if (!this.checkGameOver()) {
							setTimeout(() => {
								this.battleMessage = null
							}, 2000);
						}
					}, 2000)
				}
			},

			canAttackFirst(trainerMove, foeMove) {
				if (!trainerMove) return false
				if (trainerMove.priority > foeMove.priority) return true
				if (trainerMove.priority < foeMove.priority) return false
				return this.currentPokemon.trainer.stat.speed > this.currentPokemon.foe.stat.speed
			},

			handleFaint(user) {
				this.pokemonFaintedBattleDataUpdate(user)
			},

			checkGameOver() {
				const trainerParty = this.battleData.trainer.partyList.length
				const foeParty = this.battleData.foe.partyList.length
				if (trainerParty && foeParty) return false
				if (!trainerParty) this.blackOut()
				else if (!foeParty) this.victory()
				return true
			},

			blackOut() {
				setTimeout(() => {
					this.battleMessage = 'You have no usable Pokémon left.'
				}, 2000);
			},

			victory() {
				setTimeout(() => {
					this.battleMessage = 'You defeated your opponent.'
				}, 2000);
			},

			...mapGetters([
				'getAvailableBalls',
				'getBattleData'
			]),

			...mapActions([
				'getPokemonById',
				'setBattleData',
				'switchBattlePokemon',
				'useMoveBattleDataUpdate',
				'pokemonFaintedBattleDataUpdate'
			])
		}
	}
</script>

<style lang="scss">
	@import "@/styles/battle/scene", "@/styles/pokemonList", "@/styles/battle/pokemon.scss";
</style>