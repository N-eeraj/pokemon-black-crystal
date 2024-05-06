<template>
    <div>
        <div id="exploration">

            <common-loader v-if="isLoading" />

            <wild-locations
                v-else-if="!battleOngoing"
                @selectedLocation="handleLocation"
                @safariZone="safariConfirmation = true"
                @legendaryHunt="startLegendaryHunt" />

            <battle-scene
                v-else
                :player-party="partyPokemonData"
                :foe-party="[wildPokemon]"
                save-battle
                can-catch
                can-escape
                @escape="battleOver"
                @caught-pokemon="handleCaughtPokemon"
                @game-over="handleGameOver" />

            <pop-up
                :show="safariConfirmation"
                close
                prevent-redirect
                hash="safari-zone"
                @close-pop-up="closeSafariZoneConfirmation">

                <template #body>
                    <div class="entry-fee">
                        <img
                            src="@/assets/images/coin.svg"
                            alt="coin"
                            class="icon" />
                        <span class="count">
                            500
                        </span>
                    </div>
                    <p class="message">
                        <template v-if="insufficientCoins">
                            You don't have enough Pokécoins to enter the Safari Zone.
                        </template>
                        <template v-else>
                            Entry to Safari Zone will cost you 500 Pokécoins, would you like to continue ?
                        </template>
                    </p>
                </template>

                <template
                    v-if="!insufficientCoins"
                    #actions>
                    <button
                        class="confirm"
                        @click="enterSafariZone">
                        Continue
                    </button>
                </template>

            </pop-up>

            <pop-up
                :show="legendaryNotFound"
                prevent-redirect
                hash="failed-legendary-hunt">
                <template #body>
                    <p>
                        No legendary Pokémon found.
                        Better Luck Next Time!
                    </p>
                </template>
                <template #actions>
                    <button
                        class="cancel"
                        @click="closeLegendaryHunt">
                        Cancel
                    </button>
                    <button
                        class="confirm"
                        @click="retryLegendaryHunt">
                        Retry
                    </button>
                </template>
            </pop-up>

        </div>
    </div>
</template>

<script>

    import WildLocations from '@/js/components/WildLocations.vue'
    import BattleScene from '@/js/components/battle/scene/BattleScene.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapActions, mapGetters } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'
    import { clamp } from '@/js/mixins/common'

    export default {
        name: 'exploration-mode',

        components: {
            WildLocations,
            BattleScene,
            CommonLoader,
            PopUp
        },

        data() {
            return {
                battleOngoing: false,
                wildPokemon: null,
                wildPokemonLevel: null,
                isLoading: false,
                safariConfirmation: false,
                legendaryNotFound: false
            }
        },

        computed: {
            insufficientCoins() {
                return this.playerCoins < 500
            },

            ...mapGetters([
                'partyPokemonData',
                'getCaughtPokemon',
                'strongestPokemon',
                'playerCoins',
                'vibrationsStatus'
            ])
        },

        watch: {
            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (!toHash && fromHash === '#failed-legendary-hunt')
                        this.closeLegendaryHunt()
                    if (!toHash && fromHash === '#safari-zone')
                        this.closeSafariZoneConfirmation()
                }
            }
        },

        mounted() {
            this.$router.replace({ hash: null })
        },

        methods: {
            async handleLocation(location) {
                this.isLoading = true
                this.battleOngoing = true
                const encounteredPokemon = await this.getWildPokemonByLocation(location)

                const strongestPokemonExp = getInRange(this.strongestPokemon.exp * 0.2, this.strongestPokemon.exp * 0.6)
                const minExp = encounteredPokemon.getExpByLevel(2)
                const maxExp = encounteredPokemon.getExpByLevel(60)
                this.wildPokemonLevel = clamp(minExp, strongestPokemonExp, maxExp)
                const exp = this.wildPokemonLevel

                this.setWildPokemon(encounteredPokemon.id, exp)
            },

            enterSafariZone() {
                this.updatePlayerCoins(-500)
                this.updateSafariZoneEntry(true)
                this.$router.push('/mode/exploration/safari-zone')
            },

            closeSafariZoneConfirmation() {
                if (this.$route.hash)
                    this.$router.back()
                this.safariConfirmation = false
            },

            async startLegendaryHunt() {
                this.isLoading = true
                const legendaryPokemon = await this.getLegendaryPokemon()
                if (legendaryPokemon) {
                    this.battleOngoing = true
                    const exp = legendaryPokemon.getExpByLevel(70)
                    this.setWildPokemon(legendaryPokemon.id, exp)
                    return
                }
                setTimeout(() => {
                    this.isLoading = false
                    this.legendaryNotFound = true
                }, 1500)
            },

            setWildPokemon(pokemon, exp) {
                this.wildPokemon = {
                    pokemon,
                    exp
                }
                if (this.vibrationsStatus)
                    navigator.vibrate(500)
                this.isLoading = false
                this.encounterNewPokemon()
            },

            closeLegendaryHunt() {
                if (this.$route.hash)
                    this.$router.back()
                this.legendaryNotFound = false
            },

            retryLegendaryHunt() {
                this.closeLegendaryHunt()
                this.startLegendaryHunt()
            },

            battleOver() {
                this.battleOngoing = false
                this.wildPokemon = null
                this.setBattleData(null)
            },

            handleGameOver() {
                this.battleOngoing = false
            },

            handleCaughtPokemon() {
                this.battleOngoing = false
                this.addCaughtPokemon(this.wildPokemon)
                this.setBattleData(null)
            },

            ...mapActions([
                'getWildPokemonByLocation',
                'getLegendaryPokemon',
                'addCaughtPokemon',
                'setBattleData',
                'encounterNewPokemon',
                'updatePlayerCoins',
                'updateSafariZoneEntry'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/expolration.scss"></style>