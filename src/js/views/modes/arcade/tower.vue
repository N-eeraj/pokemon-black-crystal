<template>
    <div>
        
        <div
            id="arcade_tower"
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
                @iconEvent="confirmExit = true" />

            <pop-up
                v-if="gameOver && reward"
                close
                class="modal"
                @close-pop-up="$router.push('/mode/arcade')">
                <template #body>
                    You won
                    <img
                        src="@/assets/images/coin.svg"
                        alt="Pokécoins"
                        class="coin" />
                    {{ reward }}.
                </template>
            </pop-up>

            <pop-up
                v-if="confirmExit">
                <template #body>
                    Are you sure you want to exit? You will lose the progress you made in the Tower.
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        @click="$router.push('/mode/arcade')">
                        Yes
                    </button>
                    <button
                        class="cancel"
                        @click="confirmExit = false">
                        No
                    </button>
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

    import { getRandomOpponent } from '@/js/mixins/randomGenerator'

    export default {
        name: 'arcade-tower',

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
                won: 0,
                gameOver: false,
                confirmExit: false
            }
        },

        computed: {
            completedStages() {
                return Math.floor(this.won / 4)
            },

            foePartySize() {
                return this.won < 4 ? 6 : this.completedStages + 3
            },

            reward() {
                return 250 * this.completedStages
            },

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
                    count: this.foePartySize,
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
                        exp: pokemon.getExpByLevel((this.completedStages + 7) * 10)
                    }
                })

                this.loading = false
            },

            handleVictory() {
                ++this.won
                this.updatePlayerCoins(50)
                if (this.won === 16) {
                    this.winArcade('tower')
                    return this.gameOver = true
                }
                this.loading = true
                this.initializeParty()
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                if (result) return this.handleVictory()
                if (this.won) this.gameOver = true
                if (!this.reward)
                    this.$router.push('/mode/arcade')
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            startMatch() {
                this.startArcade('tower')
                this.toggleNavBar()
                this.encounterNewPokemon(this.foePartySize)
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