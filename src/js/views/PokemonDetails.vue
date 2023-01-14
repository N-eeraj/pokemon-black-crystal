<template>
    <div>
    </div>
</template>

<script>

    import { mapActions } from 'vuex'

    export default {
        name: 'pokemon-details',

        data() {
            return {
                details: null,
                backPath: null,
                isPokedex: false
            }
        },

        created() {
            const { type, id } = this.$route.params

            switch (type) {
                case 'pokedex':
                    if (id > 386) return this.$router.push('/page-not-found')
                    this.backPath = '/pokedex'
                    this.isPokedex = true
                    this.setPokemonDetails(id)
                    break

                case 'party':
                    this.backPath = '/pokemon/list/party'
                    break

                case 'pc':
                    this.backPath = '/pokemon/list/pc'
                    break

                default:
                    this.$router.push('/page-not-found')
            }
        },

        methods: {
            async setPokemonDetails(id) {
                this.details = await this.getPokemonById(id)
                console.log(this.details)
            },

            ...mapActions([
                'getPokemonById'
            ])
        }
    }
</script>