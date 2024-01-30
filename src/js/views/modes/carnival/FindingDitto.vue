<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else
            id="finding_ditto">

            <h1 class="title">
                Finding Ditto
            </h1>

            <div class="pokemon-container">
                <img
                    v-for="({ name, image, id }, index) in choices"
                    :key="id"
                    :src="(correctOption === index && victory !== null) ? 'https://img.pokemondb.net/sprites/home/normal/ditto.png' : image"
                    :alt="name"
                    class="pokemon-image"
                    @click="guessPokemon(index)">
            </div>

            <p class="instructions">
                Click on the Pokémon that you think is a Ditto.
            </p>

            <carnival-event-pop-up
                :show="popUp.show"
                :image="require('@/assets/images/coin.svg')"
                :count="50"
                item="Pokécoins"
                :victory="victory"
                :text="popUp.text" />

        </div>
    </div>
</template>

<script>
    
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import CarnivalEventPopUp from '@/js/components/pop-up/CarnivalEventPopUp.vue'

    import { mapGetters, mapActions } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'finding-ditto',

        components: {
            CommonLoader,
            CarnivalEventPopUp
        },

        data() {
            return {
                loading: true,
                choices: null,
                correctOption: null,
                victory: null,
                popUp: {
                    show: false,
                    text: null
                }
            }
        },

        computed: {
            ...mapGetters([
                'currentCarnivalEntry',
                'vibrationsStatus'
            ])
        },

        async created() {
            if (this.currentCarnivalEntry !== 'finding-ditto')
                return this.$router.push('/mode/carnival')
            this.choices = await this.getCarnivalPokemon(3)
            this.loading = false
            this.correctOption = getInRange(0, 3)
            window.onbeforeunload = () => true
        },

        beforeUnmount() {
            this.updateCarnivalEntry()
            window.onbeforeunload = null
        },

        methods: {
            guessPokemon(index) {
                if (this.victory !== null) return
                this.victory = index === this.correctOption
                if (this.victory) {
                    this.popUp.text = "You've won Pokécoins"
                    this.updatePlayerCoins(25)
                    this.updateAchievement({
                        type: 'carnival',
                        item: 'findingDitto'
                    })
                }
                else {
                    if (this.vibrationsStatus)
                        navigator.vibrate(500)
                    this.popUp.text = 'Better luck next time'
                }
                setTimeout(() => {
                    this.popUp.show = true
                }, 1000)
            },

            ...mapActions([
                'getCarnivalPokemon',
                'updateCarnivalEntry',
                'updatePlayerCoins',
                'updateAchievement'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/findingDitto.scss"></style>