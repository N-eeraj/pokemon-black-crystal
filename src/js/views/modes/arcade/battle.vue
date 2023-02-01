<template>
    <div>
        
        <div
            id="arcade_battle"
            class="arcade-event">

            <common-loader v-if="loading" />

            <battle-wrapper
                v-else
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                @battleStarted="startMatch"
                @completedMatch="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @iconEvent="$router.push('/mode/arcade')" />

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

    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapGetters, mapActions } from 'vuex'

    import { getInRange, getRandomOpponent } from '@/js/mixins/randomGenerator'

    export default {
        name: 'arcade-battle',

        components: {
            BattleWrapper,
            NavigationBar,
            CommonLoader,
            PopUp
        },

        data() {
            return {
                playerParty: null,
                foeParty: null,
                foeDetails: null,
                showNavBar: true,
                loading: true,
                won: null
            }
        },

        computed: {
            ...mapGetters([
                'partyPokemon',
                'getCaughtPokemon',
                'strongestPokemon'
            ])
        },

        created() {
            this.initializeParty()
        },

        methods: {
            initializeParty() {
                this.playerParty = this.partyPokemon.map(id => {
                    const pokemon = this.getCaughtPokemon(id)
                    return {
                        pokemon: pokemon.id,
                        exp: pokemon.exp,
                        happiness: pokemon.happiness,
                        encounterId: id
                    }
                })
                this.initializeFoe()
            },

            async getFoeParty() {
                const options = {
                    count: 6,
                    includeLegendary: false
                }
                const randomParty = await this.getRandomPokemon(options)
                return randomParty
            },

            async initializeFoe() {
                const [{ name, image }, randomParty] = await Promise.all([
                    getRandomOpponent(),
                    this.getFoeParty()
                ])

                this.foeDetails = {
                    image: require(`@/assets/images/${image}`),
                    name
                }

                this.foeParty = randomParty.map(pokemon => {
                    return {
                        pokemon : pokemon.id,
                        exp: getInRange(this.strongestPokemon.exp * 0.9, this.strongestPokemon.exp)
                    }
                })

                this.loading = false
            },

            handleVictory() {
                this.won = true
                this.updatePlayerCoins(50)
                this.winArcade('battle')
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                if (result) return this.handleVictory()
                this.$router.push('/mode/arcade')
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            startMatch() {
                this.startArcade('battle')
                this.toggleNavBar()
                this.encounterNewPokemon(6)
            },

            ...mapActions([
                'getRandomPokemon',
                'updatePlayerCoins',
                'startArcade',
                'winArcade',
                'encounterNewPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/arcade/coinPopUp.scss"></style>