<template>
    <duplicate-screen v-if="duplicate" />

    <template v-else>
        <offline-screen v-if="isOffline" />

        <template v-else>
            <splash-screen
                v-if="showSplashScreen"
                @loading-complete="startGame" />

            <router-view
                v-else
                id="main"
                v-slot="{ Component }" >
                <transition>
                    <component :is="Component" />
                </transition>
            </router-view>

            <evolution-pop-up
                v-if="evolutionReadyPokemon.length"
                :pokemon-list="evolutionReadyPokemon"
                class="global-evolution-pop-up"
                @completed-evolutions="handleCompletedEvolutions" />

            <rotate-screen v-if="isSmallScreen" />
            <AchievementUnlocked />
        </template>
    </template>
</template>

<script>

    import SplashScreen from '@/js/components/screens/SplashScreen.vue'
    import RotateScreen from '@/js/components/screens/RotateScreen.vue'
    import OfflineScreen from '@/js/components/screens/OfflineScreen.vue'
    import DuplicateScreen from '@/js/components/screens/DuplicateScreen.vue'
    import EvolutionPopUp from '@/js/components/pop-up/EvolutionPopUp.vue'
    import AchievementUnlocked from '@/js/components/AchievementUnlocked.vue'

    import { mapGetters, mapActions } from 'vuex'


    export default {
        components: {
            SplashScreen,
            RotateScreen,
            OfflineScreen,
            DuplicateScreen,
            EvolutionPopUp,
            AchievementUnlocked
        },

        data() {
            return {
                showSplashScreen: true,
                isSmallScreen: false,
                evolutionReadyPokemon: [],
                duplicate: false
            }
        },

        beforeCreate() {
            const broadcastChannel = new BroadcastChannel('duplicateTab')
            broadcastChannel.addEventListener('message', ({ data }) => {
                if (data === 'duplicate')
                    this.duplicate = true
            })
            broadcastChannel.postMessage('duplicate')
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
                'getCaughtPokemon',
                'fullScreenStatus'
            ])
        },

        watch: {
            $route({ name }) {
                if (name === 'NotFound')
                    return this.showSplashScreen = false
            },

            checkEvolution(to) {
                if (!to) return
                this.toggleEvolutionCheck()
                this.checkProgressiveEvolutions()
            },

            fullScreenStatus(to) {
                if (this.showSplashScreen) return
                if (to) return document.getElementById('app').requestFullscreen()
                if (
                    document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement
                )
                    document.exitFullscreen()
            }
        },

        mounted() {
            setInterval(() => {
                this.updateOfflineStats()
            }, 10000)
            this.handleFullScreenChange()
        },

        methods: {
            startGame() {
                this.showSplashScreen = false
                if (this.fullScreenStatus)
                    document.getElementById('app').requestFullscreen()
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

            handleFullScreenChange() {
                const eventHandler = () => {
                    const notFullScreen = !(
                        document.fullscreenElement ||
                        document.mozFullScreenElement ||
                        document.webkitFullscreenElement
                    )
                    if (this.fullScreenStatus === notFullScreen)
                        this.toggleFullScreen()
                }

                document.addEventListener('fullscreenchange', eventHandler)
                document.addEventListener('mozfullscreenchange', eventHandler)
                document.addEventListener('MSFullscreenChange', eventHandler)
                document.addEventListener('webkitfullscreenchange', eventHandler)
            },

            ...mapActions([
                'updateOfflineStats',
                'toggleEvolutionCheck',
                'getPokemonById',
                'toggleFullScreen'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/app.scss"></style>