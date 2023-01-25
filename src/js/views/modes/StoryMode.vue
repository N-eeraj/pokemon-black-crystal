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
                this.foeDetails = {
                    image: require(`@/assets/images/characters/foe/${foe.details.image}`),
                    name: foe.details.name
                }
                this.foeParty = foe.party
                const rivalPokemon = this.foeParty.find(pokemon => pokemon.pokemon === null)
                if (!rivalPokemon) return
                switch (this.getCaughtPokemon(1).id) {
                    case 1:
                        rivalPokemon.pokemon = 4
                        break
                    case 4:
                        rivalPokemon.pokemon = 7
                        break
                    case 7:
                        rivalPokemon.pokemon = 1
                        break
                }
                if (this.playerLevel > 200) rivalPokemon.pokemon += 2
                else if (this.playerLevel > 25) rivalPokemon.pokemon += 1
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                this.initializeParty()
                if (!result) return
                this.levelUp()
                this.initializeFoe()
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