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
                @battle-started="startMatch"
                @completed-match="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @icon-event="$router.push('/mode/arcade')" />

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
                        100.
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
                won: false,
                showCompleteModal: false
            }
        },

        computed: {
            ...mapGetters([
                'partyPokemon',
                'getCaughtPokemon',
                'strongestPartyPokemon'
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
                        exp: getInRange(this.strongestPartyPokemon.exp * 0.7, this.strongestPartyPokemon.exp)
                    }
                })

                this.loading = false
            },

            handleVictory() {
                this.won = true
                this.updatePlayerCoins(100)
                this.winArcade('battle')
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                this.showCompleteModal = true
                if (result) this.handleVictory()
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