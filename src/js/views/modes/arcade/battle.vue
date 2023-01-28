<template>
    <div>
        
        <div id="arcade_battle">

            <common-loader v-if="loading" />

            <battle-wrapper
                v-else
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                @battleStarted="toggleNavBar"
                @completedMatch="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @iconEvent="$router.push('/mode/arcade')" />
        </div>

    </div>
</template>

<script>

    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapGetters, mapActions } from 'vuex'

    import { getInRange, getRandomOpponent } from '@/js/mixins/randomGenerator'

    export default {
        name: 'arcade-battle',

        components: {
            BattleWrapper,
            NavigationBar,
            CommonLoader
        },

        data() {
            return {
                playerParty: null,
                foeParty: null,
                foeDetails: null,
                showNavBar: true,
                loading: true
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

            async initializeFoe() {
                const { name, image } = await getRandomOpponent()
                this.foeDetails = {
                    image: require(`@/assets/images/${image}`),
                    name
                }
                const options = {
                    count: 6,
                    includeLegendary: false
                }
                const randomParty = await this.getRandomPokemon(options)
                this.foeParty = randomParty.map(pokemon => {
                    return {
                        pokemon : pokemon.id,
                        exp: getInRange(this.strongestPokemon.exp * 0.8, this.strongestPokemon.exp)
                    }
                })
                this.loading = false
            },

            handleVictory() {

            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                if (result) return this.handleVictory()
                this.$router.push('/mode/arcade')
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            ...mapActions([
                'getRandomPokemon'
            ])
        }
    }
</script>