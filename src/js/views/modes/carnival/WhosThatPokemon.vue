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
                    :src="choices[correctOption].image"
                    class="image"
                    :class="{ hide: timer.timeLeft }">
            </div>

            <div class="answers-container">
                <progress
                    v-if="timer.timeLeft"
                    :value="timer.timeLeft"
                    :max="30"
                    class="timer" />
                
                <button
                    v-for="({ name, id }, index) in choices"
                    :key="id"
                    class="options"
                    :class="{ 'correct-option': victory !== null && index === correctOption }"
                    @click="chooseOption(index)"
                    :disabled="victory !== null">
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
                correctOption: null,
                timer: {
                    counter: null,
                    timeLeft: 30
                },
                victory: null
            }
        },

        async created() {
            this.choices = await this.getCarnivalPokemon(4)
            this.loading = false
            this.correctOption = getInRange(0, 4)
            this.timer.counter = setInterval(() => {
                if (this.timer.timeLeft > 0)
                    return this.timer.timeLeft -= 0.1
                this.handleTimeOut()
            }, 100)
        },

        methods: {
            handleTimeOut() {
                this.victory = false
                this.handleComplete()
            },

            chooseOption(index) {
                this.victory = index === this.correctOption
                this.handleComplete()
            },

            handleComplete() {
                this.timer.timeLeft = 0
                clearInterval(this.timer.counter)
            },

            ...mapActions([
                'getCarnivalPokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/whosThatPokemon.scss"></style>