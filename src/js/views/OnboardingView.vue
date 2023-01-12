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
                    @click="selectPokemon(pokemon)" />
            </div>

            <img
                v-else-if="getCurrentDialogue.img"
                :src="require(`@/assets/images/${getCurrentDialogue.img}.png`)"
                class="character-img" />

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
                        placeholder="Your Name"
                        class="name-input"
                        @keyup.enter="setName" />
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        @click="setName">
                        OK
                    </button>
                </template>
            </pop-up>

            <pop-up v-if="modal.selectStarter" class="modal">
                <template #body>
                    <div class="starter-confirmation">
                        <img
                            :src="this.currentStarter.image"
                            :alt="this.currentStarter.name"
                            class="starter-img" />
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

        <battle-wrapper
            v-if="battle.start"
            :player-party="battle.player"
            :foe-party="battle.foe"
            :foe-details="battle.foeDetails"
            @completedMatch="handleMatchCompleteion" />

    </div>
</template>

<script>
    import PopUp from "@/js/components/UI/PopUp.vue"
    import BattleWrapper from "@/js/components/battle/BattleWrapper.vue"
    
    import { getImageUrl } from "@/js/mixins/imageAndSprites"
    import { mapActions } from 'vuex'

    import data from "@/assets/data/onboarding.json"

    export default {
        name: "onboarding-view",
 
        components: {
            PopUp,
            BattleWrapper
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
                battle: {
                    player: null,
                    foe: null,
                    start: false
                }
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

        beforeCreate() {
            if (localStorage.gameData) this.$router.push('/')
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
                this.initData.pokemon.encountered = {
                    list: [this.onboarding.starter.id, this.onboarding.rivalStarter.id],
                    last: 2
                }
                this.initData.pokemon.party.push(1)
                this.saveGameData(this.initData)
                this.$router.push("/")
            },

            closeModal(name) {
                this.modal[name] = false
            },

            setName() {
                if (!this.onboarding.name?.trim()) return
                this.closeModal("askName")
                this.nextDialogue()
            },

            selectPokemon(pokemon) {
                const pokemonName = pokemon.name.toLowerCase()
                this.modal.selectStarter = true
                this.currentStarter = pokemon
                this.currentStarter.image = getImageUrl(pokemonName)
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
                this.battle.player = [
                    {
                        pokemon: this.onboarding.starter.id,
                        exp: 135
                    }
                ]
                this.battle.foe = [
                    {
                        pokemon: this.onboarding.rivalStarter.id,
                        exp: 135
                    }
                ]
                this.battle.foeDetails = {
                    image: require('@/assets/images/characters/foe/brendan.png'),
                    name: 'Brendan'
                }
                this.battle.start = true
            },

            handleMatchCompleteion(victory) {
                this.onboarding.rivalBattle = victory
                this.battle.start = false
                this.nextDialogue()
            },

            ...mapActions([
                'cachePokemonById',
                'saveGameData'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/onboarding.scss"></style>
