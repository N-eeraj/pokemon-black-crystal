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
                pokemonList: null
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
            this.setList()
        },

        methods: {
            setList() {
                this.pokemonList = []
                const pokemonIdList = (this.listType === 'party') ? this.partyPokemon : this.pcPokemon
                const pokemonList = pokemonIdList.map(id => {
                    return {
                        caughtId: id,
                        ...this.getCaughtPokemon(id)
                    }
                })
                pokemonList.map(async (pokemon) => {
                    const pokemonDetails = await this.getPokemonById(pokemon.id)
                    this.pokemonList.push({
                        caughtId: pokemon.caughtId,
                        exp: pokemon.exp,
                        level: pokemonDetails.getLevel(pokemon.exp),
                        ...pokemonDetails
                    })
                })
            },

            handleSelectPokemon(index) {
                const selectedPokemon = this.pokemonList[index]
                this.$router.push(`/pokemon/details/${this.listType}/${selectedPokemon.caughtId}`)
            },

            changeListOrder(data) {
                this.rearrangePlayerPokemon({
                    list: this.listType,
                    ...data
                })
                this.setList()
            },

            ...mapActions([
                'getPokemonById',
                'rearrangePlayerPokemon'
            ])
        },
    }
</script>