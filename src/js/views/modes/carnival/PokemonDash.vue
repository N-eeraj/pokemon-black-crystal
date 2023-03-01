<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else
            id="pokemon_dash">
            Test
        </div>
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'pokemon-dash',

        components: {
            CommonLoader
        },

        data() {
            return {
                loading: true,
                participants: null
            }
        },

        computed: {
            ...mapGetters([
                'currentCarnivalEntry'
            ])
        },

        async created() {
            if (this.currentCarnivalEntry !== 'pokemon-dash')
                return this.$router.push('/mode/carnival')
            this.participants = await this.getCarnivalPokemon(3)
            this.loading = false
            console.log(this.participants)
            
        },

        methods: {
            ...mapActions([
                'getCarnivalPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonDash.scss"></style>