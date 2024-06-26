<template>
    <div>
        <div id="exploration">

            <common-loader v-if="isLoading" />

            <wild-locations
                v-else-if="!battleOngoing"
                @selectedLocation="handleLocation"
                @safariZone="enterSafariZone"
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
                legendaryNotFound: false
            }
        },

        computed: {
            ...mapGetters([
                'partyPokemonData',
                'getCaughtPokemon',
                'strongestPokemon',
                'vibrationsStatus'
            ])
        },

        watch: {
            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (!toHash && fromHash === '#failed-legendary-hunt')
                        this.closeLegendaryHunt()
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

            enterSafariZone(unixtime) {
                this.updateSafariZoneEntry({
                    status: true,
                    unixtime
                })
                this.$router.push('/mode/exploration/safari-zone')
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
                'updateSafariZoneEntry'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/expolration/main.scss"></style>