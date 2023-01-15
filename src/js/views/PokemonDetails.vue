<template>
    <div>
        <div id="pokemon_details">
            {{ details }}
        </div>
    </div>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'pokemon-details',

        data() {
            return {
                details: null,
                backPath: null,
                actions: null
            }
        },

        computed: {
            ...mapGetters([
                'getCaughtPokemon',
                'partyPokemon'
            ])
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                const { type, id } = this.$route.params

                switch (type) {
                    case 'pokedex':
                        if (id > 386) return this.$router.push('/page-not-found')
                        this.backPath = '/pokedex'
                        this.setPokemonDetails(id)
                        break

                    case 'party':
                        this.backPath = '/pokemon/list/party'
                        this.getCaughtPokemonDetails(id, true)
                        break

                    case 'pc':
                        this.backPath = '/pokemon/list/pc'
                        this.getCaughtPokemonDetails(id, false)
                        break

                    default:
                        this.$router.push('/page-not-found')
                }
            },

            getActions(isParty) {
                const actions = [
                    {
                        label: 'Release',
                        action: this.release
                    }
                ]

                if (!isParty && this.partyPokemon.length > 5) return actions

                actions.unshift({
                    label: `Move to ${ isParty ? 'PC' : 'Party' }`,
                    action: this.movePokemon
                })
                return actions
            },

            async setPokemonDetails(id) {
                this.details = await this.getPokemonById(id)
            },

            async getCaughtPokemonDetails(id, isParty) {
                const pokemon = this.getCaughtPokemon(id)
                if (!pokemon) return this.$router.push('/page-not-found')
                await this.setPokemonDetails(pokemon.id)
                this.details.stat = this.details.getStat(pokemon.exp)
                this.details.encounteredId = id

                const isInParty = this.partyPokemon.includes(Number(id))
                // check if this is party pokemon & if pokemon is in party
                if (isParty ^ isInParty) this.$router.push('/page-not-found')

                this.actions = this.getActions()
            },

            release() {
                console.log('Release pokemon', this.details.encounteredId)
            },

            movePokemon() {
                const moveFrom = this.$route.params.type
                console.log('Move pokemon', this.details.encounteredId, ' from', moveFrom)
            },

            ...mapActions([
                'getPokemonById',
                'getPokemonByEncounterId'
            ])
        }
    }
</script>