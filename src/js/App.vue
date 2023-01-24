<template>
    <offline-screen v-if="isOffline" />
    <template v-else>
        <splash-screen
            v-if="showSplashScreen"
            @loading-complete="startGame" />
        <router-view
            v-else
            id="main" />
        <evolution-pop-up
            v-if="evolutionReadyPokemon.length"
            :pokemonList="evolutionReadyPokemon"
            class="global-evolution-pop-up"
            @completedEvolutions="handleCompletedEvolutions" />
        <rotate-screen v-if="isSmallScreen" />
    </template>
</template>

<script>

    import SplashScreen from '@/js/components/screens/SplashScreen.vue'
    import RotateScreen from '@/js/components/screens/RotateScreen.vue'
    import OfflineScreen from '@/js/components/screens/OfflineScreen.vue'
    import EvolutionPopUp from '@/js/components/EvolutionPopUp.vue'

    import { mapGetters, mapActions } from 'vuex'


    export default {
        components: {
            SplashScreen,
            RotateScreen,
            OfflineScreen,
            EvolutionPopUp
        },

        data() {
            return {
                showSplashScreen: true,
                isSmallScreen: false,
                evolutionReadyPokemon: []
            }
        },

        beforeCreate() {
            window.visualViewport.addEventListener('resize', event => {
                if (event.target) {
                    const { height } = event.target
                    this.isSmallScreen = height < 360
                }
            })
        },

        computed: {
            ...mapGetters([
                'isOffline',
                'checkEvolution',
                'partyPokemon',
                'getCaughtPokemon'
            ])
        },

        watch: {
            $route(to) {
                if (to.name === 'NotFound') return this.showSplashScreen = false
            },

            checkEvolution(to) {
                if (!to) return
                this.toggleEvolutionCheck()
                this.checkProgressiveEvolutions()
            }
        },

        mounted() {
            setInterval(() => {
                this.updateOfflineStats()
            }, 10000)
        },

        methods: {
            startGame() {
                this.showSplashScreen = false
            },

            checkProgressiveEvolutions() {
                // this function checks if any of the party pokemon evolves by level up or happiness up
                const party = this.partyPokemon.map(id => {
                    return {
                        encounterId: id,
                        ...this.getCaughtPokemon(id)
                    }
                })
                const evolutionReadyPokemon = []
                party.forEach(async (pokemon, index) => {
                    const data = {
                        encounterId: pokemon.encounterId,
                        exp: pokemon.exp,
                        happiness: pokemon.happiness,
                        ...await this.getPokemonById(pokemon.id)
                    }
                    const evolutionData = data.evolution
                    if (evolutionData.levelUp.minLevel && (data.getLevel(data.exp) >= evolutionData.levelUp.minLevel))
                        evolutionReadyPokemon.push({
                            data,
                            possibilities: evolutionData.levelUp.pokemon
                        })
                    else if (evolutionData.happinessUp.minLevel && (data.happiness >= evolutionData.happinessUp.minLevel))
                        evolutionReadyPokemon.push({
                            data,
                            possibilities: evolutionData.happinessUp.pokemon
                        })
                    if ((party.length - 1) === index)
                        this.evolutionReadyPokemon = evolutionReadyPokemon
                })
            },

            handleCompletedEvolutions() {
                this.evolutionReadyPokemon = []
            },

            ...mapActions([
                'updateOfflineStats',
                'toggleEvolutionCheck',
                'getPokemonById'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/app.scss"></style>