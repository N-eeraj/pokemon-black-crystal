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
                :playerParty="playerPokemon"
                :foeParty="[wildPokemon]"
                saveBattle
                canCatch
                canEscape
                @escape="battleOver"
                @caughtPokemon="handleCaughtPokemon"
                @gameOver="handleGameOver" />

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
            this.playerPokemon = this.partyPokemon.map(id => {
                const pokemon = this.getCaughtPokemon(id)
                return {
                    pokemon: pokemon.id,
                    exp: pokemon.exp,
                    happiness: pokemon.happiness
                }
            })
            this.wildPokemonLevel = getInRange(this.strongestPokemon.exp * 0.6, this.strongestPokemon.exp)
        },

        methods: {
            async handleLocation(location) {
                this.isLoading = true
                this.battleOngoing = true
                const encounteredPokemon = await this.getWildPokemonByLocation(location)
                const exp = this.wildPokemonLevel
                this.setWildPokemon(encounteredPokemon.id, exp)
            },

            async handleLegendaryHunt() {
                this.isLoading = true
                const legendaryPokemon = await this.getLegendaryPokemon()
                if (legendaryPokemon) {
                    this.battleOngoing = true
                    const exp = Math.max(this.wildPokemonLevel, 160000)
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
                this.encounterPokemon(pokemon)
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
                console.log('handleGameOver')
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
                'encounterPokemon',
                'addCaughtPokemon',
                'setBattleData'
            ])
        }
    }

</script>