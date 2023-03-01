<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else-if="selectedPokemon"
            id="pokemon_dash">
            {{ selectedPokemon }}
        </div>

        <pokemon-list
            v-else
            :list="pokemonList"
            title="Select Pokémon"
            icon="cross-mark"
            @nav-icon-action="$router.push('/mode/carnival')"
            @selected-pokemon="handleSelectPokemon" />
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import PokemonList from '@/js/components/PokemonList.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'pokemon-dash',

        components: {
            CommonLoader,
            PokemonList
        },

        data() {
            return {
                loading: true,
                pokemonList: null,
                participants: null,
                selectedPokemon: null
            }
        },

        computed: {
            ...mapGetters([
                'currentCarnivalEntry',
                'partyPokemon',
                'getCaughtPokemon'
            ])
        },

        async created() {
            if (this.currentCarnivalEntry !== 'pokemon-dash')
                return this.$router.push('/mode/carnival')
            this.participants = await this.getCarnivalPokemon(3)
            this.setList()
            this.loading = false
        },

        beforeUnmount() {
            this.updateCarnivalEntry()
        },

        methods: {
            setList() {
                this.pokemonList = []
                const pokemonList = this.partyPokemon.map(id => {
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
                this.selectedPokemon = this.pokemonList[index]
            },

            ...mapActions([
                'getCarnivalPokemon',
                'getPokemonById'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonDash.scss"></style>