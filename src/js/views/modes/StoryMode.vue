<template>
    <div>
            <battle-wrapper
                :player-party="playerParty"
                :foe-party="foeParty"
                :foe-details="foeDetails"
                save-battle
                can-escape
                @completedMatch="handleMatchCompleteion" />
        </div>
</template>


<script>

    import BattleWrapper from '@/js/components/battle/BattleWrapper.vue'

    import { mapActions, mapGetters } from 'vuex'

    import story from '@/assets/data/story'

    export default {
        name: 'story-mode',

        components: {
            BattleWrapper
        },

        data() {
            return {
                playerParty: null,
                foeParty: null,
                foeDetails: null
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
                if (!result) return
                this.levelUp()
                this.initializeParty()
                this.initializeFoe()
            },

            ...mapActions([
                'levelUp'
            ])
        }
    }

</script>