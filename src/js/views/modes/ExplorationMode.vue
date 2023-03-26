<template>
    <div>
        <div id="exploration">

            <common-loader v-if="isLoading" />

            <wild-locations
                v-else-if="!battleOngoing"
                @selectedLocation="handleLocation"
                @legendaryHunt="handleLegendaryHunt" />

            <battle-scene
                v-else
                :player-party="playerPokemon"
                :foe-party="[wildPokemon]"
                save-battle
                can-catch
                can-escape
                @escape="battleOver"
                @caught-pokemon="handleCaughtPokemon"
                @game-over="handleGameOver" />

            <pop-up
                v-if="legendaryNotFound">
                <template #body>
                    <p>
                        No legendary Pokémon found.
                        Better Luck Next Time!
                    </p>
                </template>
                <template #actions>
                    <button
                        class="cancel"
                        @click="legendaryNotFound = false">
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
                playerPokemon: null,
                wildPokemon: null,
                wildPokemonLevel: null,
                isLoading: false,
                legendaryNotFound: false
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
                this.playerPokemon = this.partyPokemon.map(id => {
                    const pokemon = this.getCaughtPokemon(id)
                    return {
                        pokemon: pokemon.id,
                        exp: pokemon.exp,
                        happiness: pokemon.happiness,
                        encounterId: id
                    }
                })
            },

            async handleLocation(location) {
                this.isLoading = true
                this.battleOngoing = true
                const encounteredPokemon = await this.getWildPokemonByLocation(location)

                const strongestPokemonExp = getInRange(this.strongestPokemon.exp * 0.4, this.strongestPokemon.exp * 0.6)
                const minExp = encounteredPokemon.getExpByLevel(3)
                const maxExp = encounteredPokemon.getExpByLevel(50)
                this.wildPokemonLevel = clamp(minExp, strongestPokemonExp, maxExp)
                const exp = this.wildPokemonLevel

                this.setWildPokemon(encounteredPokemon.id, exp)
            },

            async handleLegendaryHunt() {
                this.isLoading = true
                const legendaryPokemon = await this.getLegendaryPokemon()
                if (legendaryPokemon) {
                    this.battleOngoing = true
                    const exp = legendaryPokemon.getExpByLevel(70)
                    this.setWildPokemon(legendaryPokemon.id, exp)
                    return
                }
                this.isLoading = false
                this.legendaryNotFound = true
            },

            setWildPokemon(pokemon, exp) {
                this.wildPokemon = {
                    pokemon,
                    exp
                }
                this.isLoading = false
                this.encounterNewPokemon()
            },

            retryLegendaryHunt() {
                this.legendaryNotFound = false
                this.handleLegendaryHunt()
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
                this.initializeParty()
            },

            ...mapActions([
                'getWildPokemonByLocation',
                'getLegendaryPokemon',
                'addCaughtPokemon',
                'setBattleData',
                'encounterNewPokemon'
            ])
        }
    }

</script>