<template>
    <div>
        <div id="story">
            <battle-wrapper
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                can-escape
                @battleStarted="toggleNavBar"
                @completedMatch="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />
 </div>
    </div>
</template>


<script>

    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    import { mapActions, mapGetters } from 'vuex'

    import story from '@/assets/data/story'

    export default {
        name: 'story-mode',

        components: {
            BattleWrapper,
            NavigationBar,
        },

        data() {
            return {
                playerParty: null,
                foeParty: null,
                foeDetails: null,
                showNavBar: true
            }
        },

        computed: {
            ...mapGetters([
                'playerLevel',
                'partyPokemon',
                'getCaughtPokemon'
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

            initializeFoe() {
                const foe = story.find(foe => foe.level === this.playerLevel)
                this.foeParty = foe.party
                this.foeDetails = {
                    image: require(`@/assets/images/characters/foe/${foe.details.image}`),
                    name: foe.details.name
                }
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                this.initializeParty()
                if (!result) return
                this.initializeFoe()
                this.levelUp()
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            ...mapActions([
                'levelUp'
            ])
        }
    }

</script>