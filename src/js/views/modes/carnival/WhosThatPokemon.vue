<template>
    <div>
        <div id="whos_that_pokemon">

            <common-loader v-if="loading" />
            {{ choices }}

        </div>
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapActions } from 'vuex'

    export default {
        name: 'whos-that-pokemon',

        components: {
            CommonLoader
        },

        data() {
            return {
                loading: true,
                choices: null
            }
        },

        async created() {
            this.choices = await this.getCarnivalPokemon(4)
            this.loading = false
        },

        methods: {
            ...mapActions([
                'getCarnivalPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/whosThatPokemon.scss"></style>