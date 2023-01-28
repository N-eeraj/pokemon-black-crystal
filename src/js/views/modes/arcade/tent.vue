<template>
    <div>
        
        <div
            id="arcade_tent"
            class="arcade-event">

            <common-loader v-if="loading" />

            <tent-selection
                v-else-if="showSelection"
                @selectedPokeballs="handlePokemonSelection" />

            <battle-wrapper
                v-else
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                @completedMatch="handleMatchCompleteion" />

            <pop-up
                v-if="won"
                close
                class="modal"
                @close-pop-up="$router.push('/mode/arcade')">
                <template #body>
                    You won
                    <img
                        src="@/assets/images/coin.svg"
                        alt="Pokécoins"
                        class="coin" />
                    50.
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
                won: null
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
                this.startArcade('tent')
                this.showSelection = false
            },

            handleMatchCompleteion(result) {
                if (!result) return this.$router.push('/mode/arcade')
                this.won = true
                this.updatePlayerCoins(50)
                this.winArcade('tent')
                
            },

            ...mapActions([
                'getRandomPokemon',
                'startArcade',
                'updatePlayerCoins',
                'winArcade'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/arcade/coinPopUp.scss"></style>