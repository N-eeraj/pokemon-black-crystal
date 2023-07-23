<template>
    <div>
        
        <div
            id="arcade_tower"
            class="arcade-event">

            <common-loader v-if="loading" />

            <battle-wrapper
                v-else
                :player-party="partyPokemonData"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                @battle-started="startMatch"
                @completed-match="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @icon-event="confirmExit = true" />

            <pop-up
                :show="gameOver"
                close
                class="modal"
                @close-pop-up="$router.push('/mode/arcade')">
                <template #body>
                    <template v-if="!!reward">
                        You won
                        <img
                        src="@/assets/images/coin.svg"
                        alt="Pokécoins"
                        class="coin" />
                        {{ reward }}.
                    </template>
                    <template v-else>
                        You couldn't complete the Tower challenge.
                        Better luck next time!
                    </template>
                </template>
            </pop-up>

            <pop-up
                :show="confirmExit"
                prevent-redirect
                hash="forfeit">
                <template #body>
                    Are you sure you want to exit?
                    You will lose the progress you made in the Tower.
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        @click="$router.push('/mode/arcade')">
                        Yes
                    </button>
                    <button
                        class="cancel"
                        @click="cancelForfeit">
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
                'partyPokemonData',
                'getCaughtPokemon',
                'strongestPokemon'
            ])
        },

        watch: {
            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (!toHash && fromHash === '#forfeit')
                        this.cancelForfeit()
                }
            }
        },

        created() {
            this.initializeFoe()
        },

        methods: {
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
                    this.updateAchievement({
                        type: 'arcade',
                        item: 'tower'
                    })
                    return this.gameOver = true
                }
                this.loading = true
                this.initializeFoe()
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                if (result) return this.handleVictory()
                this.gameOver = true
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            cancelForfeit() {
                if (this.$route.hash)
                    this.$router.back()
                this.confirmExit = false
            },

            startMatch() {
                this.toggleNavBar()
                this.encounterNewPokemon(this.foePartySize)
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