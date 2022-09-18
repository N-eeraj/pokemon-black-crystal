<template>
	<div>
		<div id="onboarding_wrapper">
			<div v-if="selectStarter" class="pokeballs-container">
				<img
					v-for="(pokemon, index) in starters"
					:key="index"
					:src="require('@/assets/images/pokeball.png')"
					alt="Pokeball"
					class="pokeball"
					@click="selectPokemon(pokemon)"
				/>
			</div>
			<img
				v-else-if="getCurrentDialogue.img"
				:src="require(`@/assets/images/${getCurrentDialogue.img}.png`)"
				class="character-img"
			/>
			<p class="dialogue">
				{{ getCurrentDialogue.text }}
			</p>
			<button v-if="getCurrentDialogue.showNext" class="next-btn" @click="nextDialogue">
				Next
			</button>
			<pop-up v-if="modal.askName" class="modal">
				<template #body>
					<input
						v-model="onboarding.name"
						placeholder="Enter Your Name"
						class="name-input"
						@keyup.enter="setName"
					/>
				</template>
				<template #actions>
					<button
						class="confirm"
						:class="{ disabled: !onboarding.name }"
						:disabled="!onboarding.name"
						@click="setName">
						OK
					</button>
				</template>
			</pop-up>
			<pop-up v-if="modal.selectStarter" class="modal">
				<template #body>
					<div class="starter-confirmation">
						<img :src="this.currentStarter.image" :alt="this.currentStarter.name" />
						<p>
							{{ confirmStarterMessage }}
						</p>
					</div>
				</template>
				<template #actions>
					<button class="confirm" @click="confirmPokemon">
						Yes
					</button>
					<button class="cancel" @click="closeModal('selectStarter')">
						No
					</button>
				</template>
			</pop-up>
		</div>
	</div>
</template>

<script>
	import PopUp from "@/js/components/PopUp.vue"
	import imageAndSprites from "@/js/mixins/imageAndSprites"
	import data from "@/assets/data/onboarding.json"
	import { mapActions } from 'vuex'

	export default {
		name: "onboarding-view",
		mixins: [imageAndSprites],
		components: {
			PopUp,
		},

		data() {
			return {
				story: null,
				starters: null,
				initData: null,
				selectStarter: false,
				currentDiaogue: {
					index: 0,
					type: null,
				},
				currentStarter: null,
				onboarding: {
					name: null,
					starter: null,
					rivalStarter: null,
					rivalBattle: null,
				},
				modal: {
					askName: false,
					selectStarter: false,
				},
			}
		},

		computed: {
			getCurrentDialogue() {
				return {
					img: this.story[this.currentDiaogue.index].characterImg,
					text: this.formatDialogue(this.story[this.currentDiaogue.index].text),
					showNext: ["dialogue", "conditionalDialogue"].includes(this.currentDiaogue.type),
				}
			},

			confirmStarterMessage() {
				return `So, you want the ${this.currentStarter.type} type Pokémon, ${this.currentStarter.name} ?`
			}
		},

		created() {
			this.story = data.story
			this.starters = data.starters
			this.initData = data.gameData
			this.currentDiaogue.type = this.story[this.currentDiaogue.index].type
		},

		methods: {
			formatDialogue(dialogue) {
				if (!dialogue) return null
				if (this.currentDiaogue.type === "conditionalDialogue")
				dialogue = dialogue[this.onboarding.rivalBattle ? "win" : "lose"]
				return dialogue
				.replace(/<Player>/gi, this.onboarding.name)
				.replace(/<Pokemon>/gi, this.onboarding.starter?.name || null)
			},

			nextDialogue() {
				if (!(this.currentDiaogue.index === this.story.length - 1))
				return ++this.currentDiaogue.index
				this.initData.playerInfo.name = this.onboarding.name
				this.initData.pokemon.caught[1] = {
					id: this.onboarding.starter.id,
					exp: 135,
					happiness: 50
				}
				this.initData.pokemon.encountered.push(...[this.onboarding.starter.id, this.onboarding.rivalStarter.id])
				this.initData.pokemon.party.push(1)
				// localStorage.setItem('gameData', btoa(JSON.stringify(this.initData)))
				this.$router.push("/")
			},

			closeModal(name) {
				this.modal[name] = false
			},

			setName() {
				this.closeModal("askName")
				this.nextDialogue()
			},

			selectPokemon(pokemon) {
				const pokemonName = pokemon.name.toLowerCase()
				this.modal.selectStarter = true
				this.currentStarter = pokemon
				this.currentStarter.image = this.getImageUrl(pokemonName)
			},

			getRivalStarter() {
				switch (this.onboarding.starter.id) {
					case 1:
						return 4
					case 4:
						return 7
					case 7:
						return 1
				}
			},

			async confirmPokemon() {
				this.onboarding.starter = this.currentStarter
				this.onboarding.rivalStarter = this.starters.find(pokemon => pokemon.id === this.getRivalStarter())
				this.closeModal("selectStarter")
				this.selectStarter = false
				this.nextDialogue()
			},

			async startBattle() {
				await [
					this.cachePokemonById(this.onboarding.starter.id),
					this.cachePokemonById(this.onboarding.rivalStarter.id)
				]
				console.log(this.onboarding.starter.id)
				console.log(this.onboarding.rivalStarter.id)
				this.nextDialogue()
			},

			...mapActions([
				'cachePokemonById'
			])
		},

		watch: {
			"currentDiaogue.index"(index) {
				this.currentDiaogue.type = this.story[index].type
				switch (this.currentDiaogue.type) {
				case "askName":
					this.modal.askName = true
					break
				case "selectPokemon":
					this.selectStarter = true
					break
				case "battle":
					this.startBattle()
					break
				}
			},
		},
	}
</script>

<style lang="scss" src="@/styles/onboarding.scss"></style>
