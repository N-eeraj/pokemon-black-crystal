<template>
    <div>
        <div id="exploration">

            <wild-locations
                v-if="!battleOngoing"
                @selectedLocation="handleLocation"
                @legendaryHunt="handleLegendaryHunt" />

            <common-loader v-else-if="isLoading" />

            <battle-scene
                v-else
                :playerParty="playerPokemon"
                :foeParty="wildPokemon"
                saveBattle
                canCatch
                canEscape
                @escape="battleOver"
                @caughtPokemon="handleCaughtPokemon"
                @gameOver="handleGameOver" />

        </div>
    </div>
</template>

<script>

    import WildLocations from '@/js/components/WildLocations.vue'
    import BattleScene from '@/js/components/battle/scene/BattleScene.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapActions, mapGetters } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'exploration-mode',

        components: {
            WildLocations,
            BattleScene,
            CommonLoader
        },

        data() {
            return {
                battleOngoing: false,
                playerPokemon: null,
                wildPokemon: [],
                isLoading: false
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
        },

        methods: {
            async handleLocation(location) {
                this.isLoading = true
                this.battleOngoing = true
                const encounteredPokemon = await this.getWildPokemonByLocation(location)
                const exp = getInRange(this.strongestPokemon.exp * 0.6, this.strongestPokemon.exp)
                this.wildPokemon.push({
                    pokemon: encounteredPokemon.id,
                    exp
                })
                this.isLoading = false
                this.encounterPokemon(encounteredPokemon.id)
            },

            handleLegendaryHunt() {
                console.log('handleLegendaryHunt')
            },

            battleOver() {
                this.battleOngoing = false
                this.wildPokemon = []
            },

            handleGameOver() {
                console.log('handleGameOver')
                this.battleOngoing = false
            },

            handleCaughtPokemon() {
                this.battleOngoing = false
            },

            ...mapActions([
                'getWildPokemonByLocation',
                'encounterPokemon'
            ])
        }
    }

</script>