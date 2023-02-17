<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else
            id="whos_that_pokemon">

            <div class="question-container">
                <h1 class="title">
                    Who's that Pokémon ?
                </h1>

                <img
                    :src="choices[correct].image"
                    class="image">
            </div>

            <div class="answers-container">
                <progress
                    :value="timeLeft"
                    :max="30"
                    class="timer" />
                
                <button
                    v-for="({ name, id }) in choices"
                    :key="id"
                    class="options">
                    {{ $filters.toTitleCase(name) }}
                </button>
            </div>

        </div>
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapActions } from 'vuex'

    import { getInRange } from "@/js/mixins/randomGenerator"

    export default {
        name: 'whos-that-pokemon',

        components: {
            CommonLoader
        },

        data() {
            return {
                loading: true,
                choices: null,
                correct: null,
                timeLeft: 30
            }
        },

        async created() {
            this.choices = await this.getCarnivalPokemon(4)
            this.loading = false
            this.correct = getInRange(0, 4)
            setInterval(() => {
                if (this.timeLeft)
                    return this.timeLeft -= 0.1
                this.handleTimeOut()
            }, 100)
        },

        methods: {
            handleTimeOut() {
                console.log('time up')
            },

            ...mapActions([
                'getCarnivalPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/whosThatPokemon.scss"></style>