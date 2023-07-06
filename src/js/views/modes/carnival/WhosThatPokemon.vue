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
                    :max="10"
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

            <carnival-event-pop-up
                :show="popUp.show"
                :image="require('@/assets/images/items/razz-berry.webp')"
                item="Razz Berry"
                :victory="victory"
                :text="popUp.text" />

        </div>
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import CarnivalEventPopUp from '@/js/components/pop-up/CarnivalEventPopUp.vue'

    import { mapActions } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'whos-that-pokemon',

        components: {
            CommonLoader,
            CarnivalEventPopUp
        },

        data() {
            return {
                loading: true,
                choices: null,
                correctOption: null,
                timer: {
                    counter: null,
                    timeLeft: 10
                },
                victory: null,
                popUp: {
                    show: false,
                    text: null
                }
            }
        },

        async created() {
            this.updateAudio('carnival.mp3')
            this.choices = await this.getCarnivalPokemon(4)
            this.loading = false
            this.correctOption = getInRange(0, 4)
            this.timer.counter = setInterval(() => {
                if (this.timer.timeLeft > 0)
                    return this.timer.timeLeft -= 0.1
                this.handleTimeOut()
            }, 100)
            window.onbeforeunload = () => true
        },

        beforeUnmount() {
            window.onbeforeunload = null
        },

        methods: {
            handleTimeOut() {
                this.victory = false
                this.popUp.text = "You've ran out of time"
                this.handleComplete()
            },

            chooseOption(index) {
                this.victory = index === this.correctOption
                if (this.victory) {
                    this.popUp.text = "You've won a Razz Berry"
                    this.updateBag({
                        itemId: 4,
                        count: 1
                    })
                }
                else
                    this.popUp.text = 'Better luck next time'
                this.handleComplete()
            },

            handleComplete() {
                this.timer.timeLeft = 0
                clearInterval(this.timer.counter)
                setTimeout(() => {
                    this.popUp.show = true
                }, 1000)
            },

            ...mapActions([
                'updateAudio',
                'getCarnivalPokemon',
                'updateBag'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/whosThatPokemon.scss"></style>