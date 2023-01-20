<template>
    <div>
        <div id="exploration">

            <wild-locations
                v-if="!battleOngoing"
                @selectedLocation="handleLocation"
                @legendaryHunt="handleLegendaryHunt" />

            <battle-scene
                v-else-if="playerPokemon.length && wildPokemon.length"
                :playerParty="playerPokemon"
                :foeParty="wildPokemon"
                saveBattle
                canCatch
                canEscape
                @escape="battleOver"
                @gameOver="handleGameOver" />

        </div>
    </div>
</template>

<script>

    import WildLocations from '@/js/components/WildLocations.vue'
    import BattleScene from '@/js/components/battle/scene/BattleScene.vue'

    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'exploration-mode',

        components: {
            WildLocations,
            BattleScene
        },

        data() {
            return {
                battleOngoing: false,
                playerPokemon: null,
                wildPokemon: []
            }
        },

        computed: {
            ...mapGetters([
                'partyPokemon',
                'getCaughtPokemon'
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
                this.battleOngoing = true
                const encounteredPokemon = await this.getWildPokemonByLocation(location)
                this.wildPokemon.push({
                    pokemon: encounteredPokemon.id,
                    exp: 1000
                })
            },

            handleLegendaryHunt() {
                console.log('handleLegendaryHunt')
            },

            battleOver() {
                this.battleOngoing = false
                this.wildPokemon = []
            },

            ...mapActions([
                'getWildPokemonByLocation'
            ])
        }
    }

</script>