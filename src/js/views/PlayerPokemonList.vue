<template>
    <div>
        <div id="player_pokemon_list">
            <pokemon-list
                :list="pokemonList"
                :title="listTitle"
                icon="cross-mark"
                rearrangeable
                @navIconAction="$router.push('/')"
                @selectedPokemon="handleSelectPokemon"
                @rearrangePokemon="changeListOrder" />
        </div>
    </div>
</template>

<script>

    import PokemonList from '@/js/components/PokemonList.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'player-pokemon-list',

        components: {
            PokemonList
        },

        data() {
            return {
                listType: null,
                pokemonList: []
            }
        },

        computed: {
            listTitle() {
                return (this.listType === 'party') ? 'Party' : 'PC'
            },

            ...mapGetters([
                'partyPokemon',
                'pcPokemon',
                'getCaughtPokemon'
            ])
        },

        created() {
            this.listType = this.$route.params.type
            const pokemonIdList = (this.listType === 'party') ? this.partyPokemon : this.pcPokemon
            const pokemonList = pokemonIdList.map(id => this.getCaughtPokemon(id))
            pokemonList.map(async (pokemon) => {
                const pokemonDetails = await this.getPokemonById(pokemon.id)
                this.pokemonList.push({
                    encounterId: pokemon.id,
                    exp: pokemon.exp,
                    level: pokemonDetails.getLevel(pokemon.exp),
                    ...pokemonDetails
                })
            })
        },

        methods: {
            handleSelectPokemon(index) {
                const selectedPokemon = this.pokemonList[index]
                this.$router.push(`/pokemon/details/${this.listType}/${selectedPokemon.encounterId}`)
            },

            changeListOrder({ currentIndex, newIndex }) {
                if (newIndex < 0) newIndex = 0
                else if (newIndex >= this.pokemonList.length) {
                    newIndex = this.pokemonList.length - 1
                }

                [this.pokemonList[currentIndex], this.pokemonList[newIndex]] = [this.pokemonList[newIndex], this.pokemonList[currentIndex]]
            },

            ...mapActions([
                'getPokemonById'
            ])
        },
    }
</script>