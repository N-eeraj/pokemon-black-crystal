<template>
    <div>
    </div>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'pokemon-details',

        data() {
            return {
                details: null,
                backPath: null
            }
        },

        computed: {
            ...mapGetters([
                'getCaughtPokemon'
            ])
        },

        created() {
            const { type, id } = this.$route.params

            switch (type) {
                case 'pokedex':
                    if (id > 386) return this.$router.push('/page-not-found')
                    this.backPath = '/pokedex'
                    this.setPokemonDetails(id)
                    break

                case 'party':
                    this.backPath = '/pokemon/list/party'
                    this.getCaughtPokemonDetails(id)
                    break

                case 'pc':
                    this.backPath = '/pokemon/list/pc'
                    this.getCaughtPokemonDetails(id)
                    break

                default:
                    this.$router.push('/page-not-found')
            }
        },

        methods: {
            async setPokemonDetails(id) {
                this.details = await this.getPokemonById(id)
            },

            async getCaughtPokemonDetails(id) {
                const pokemon = this.getCaughtPokemon(id)
                await this.setPokemonDetails(pokemon.id)
                this.details.stat = this.details.getStat(pokemon.exp)
            },

            ...mapActions([
                'getPokemonById',
                'getPokemonByEncounterId'
            ])
        }
    }
</script>