<template>
    <div>
        
        <div
            id="arcade_tent"
            class="arcade-event">

            <common-loader v-if="loading" />

            <tent-selection
                v-else-if="showSelection"
                @selected-pokeballs="handlePokemonSelection" />

            <battle-wrapper
                v-else
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                @completed-match="handleMatchCompleteion" />

            <pop-up
                :show="showCompleteModal"
                close
                class="modal"
                @close-pop-up="$router.push('/mode/arcade')">
                <template #body>
                    <template v-if="won">
                        You won
                        <img
                            src="@/assets/images/coin.svg"
                            alt="Pokécoins"
                            class="coin" />
                        40.
                    </template>
                    <template v-else>
                        You've lost. Better luck next time!
                    </template>
                </template>
            </pop-up>

        </div>

    </div>
</template>

<script>

    import TentSelection from '@/js/components/TentSelection.vue'
    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    

    import { mapActions } from 'vuex'
    
    import { getRandomOpponent } from '@/js/mixins/randomGenerator'

    export default {
        name: 'arcade-tent',

        components: {
            TentSelection,
            BattleWrapper,
            CommonLoader,
            PopUp
        },

        data() {
            return {
                allRandomPokemon: null,
                showSelection: true,
                loading: true,
                won: false,
                showCompleteModal: false
            }
        },

        computed: {
            playerParty() {
                return this.allRandomPokemon.filter(pokemon => pokemon.trainer)
            },

            foeParty() {
                return this.allRandomPokemon.filter(pokemon => !pokemon.trainer)
            }
        },

        created() {
            this.initialize()
        },

        methods: {
            async getRandomPokemonList() {
                const options = {
                    count: 6,
                    includeLegendary: false
                }
                const randomPokemon = await this.getRandomPokemon(options)
                return randomPokemon
            },

            async initialize() {
                const [{ name, image }, randomPokemon] = await Promise.all([
                    getRandomOpponent(),
                    this.getRandomPokemonList()
                ])
                
                this.foeDetails = {
                    image: require(`@/assets/images/${image}`),
                    name
                }

                this.allRandomPokemon = randomPokemon.map(pokemon => {
                    return {
                        pokemon: pokemon.id,
                        exp: pokemon.getExpByLevel(50)
                    }
                })

                this.loading = false
            },

            handlePokemonSelection(pokeballList) {
                this.allRandomPokemon.forEach((pokemon, index) => {
                    if (pokeballList.includes(index + 1)) pokemon.trainer = true
                    else pokemon.trainer = false
                })
                this.showSelection = false
                this.encounterNewPokemon(6)
            },

            handleMatchCompleteion(result) {
                this.showCompleteModal = true
                if (!result) return
                this.won = true
                this.updatePlayerCoins(40)
                this.updateAchievement({
                    type: 'arcade',
                    item: 'tent'
                })
            },

            ...mapActions([
                'getRandomPokemon',
                'updatePlayerCoins',
                'updateAchievement',
                'encounterNewPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/arcade/coinPopUp.scss"></style>