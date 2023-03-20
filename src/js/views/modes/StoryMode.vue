<template>
    <div>
        <div id="story">
            <div v-if="playerLevel > 240">
                Champion
            </div>

            <battle-wrapper
                v-else
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                can-escape
                @battle-started="toggleNavBar"
                @completed-match="handleMatchCompleteion" />

            <navigation-bar
                v-if="showNavBar"
                icon="cross-mark"
                @icon-event="exitStoryMode" />


            <pop-up
                v-if="confirmExit"
                close
                class="modal"
                @close-pop-up="confirmExit=false">
                <template #body>
                    <div class="escape-confirmation">
                        <p>
                            If you exit now, you'll have to restart the Elite Four Challenge.
                        </p>
                    </div>
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        @click="$router.push('/')">
                        Yes
                    </button>
                </template>
            </pop-up>
        </div>
    </div>
</template>


<script>

    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapActions, mapGetters } from 'vuex'

    import story from '@/assets/data/story'

    export default {
        name: 'story-mode',

        components: {
            BattleWrapper,
            NavigationBar,
            PopUp
        },

        data() {
            return {
                playerParty: null,
                foeParty: null,
                foeDetails: null,
                showNavBar: true,
                confirmExit: false
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
            if (this.playerLevel <= 240) {
                if (this.playerLevel > 236)
                    this.setLevel(236)
                this.initializeParty()
            }
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
                    case 2:
                    case 3:
                        rivalPokemon.pokemon = 4
                        break
                    case 4:
                    case 5:
                    case 6:
                        rivalPokemon.pokemon = 7
                        break
                    case 7:
                    case 8:
                    case 9:
                        rivalPokemon.pokemon = 1
                        break
                }
                if (this.playerLevel > 120) rivalPokemon.pokemon += 2
                else if (this.playerLevel > 20) rivalPokemon.pokemon += 1
            },

            handleMatchCompleteion(result) {
                this.toggleNavBar()
                this.initializeParty()
                if (!result) {
                    if (this.playerLevel > 236) {
                        this.setLevel(236)
                        this.initializeParty()
                    }
                    return
                }
                this.levelUp()
                this.initializeFoe()
            },

            toggleNavBar() {
                this.showNavBar = !this.showNavBar
            },

            exitStoryMode() {
                if (this.playerLevel > 236)
                    this.confirmExit = true
                else
                    this.$router.push('/')
            },

            ...mapActions([
                'levelUp',
                'setLevel'
            ])
        }
    }

</script>