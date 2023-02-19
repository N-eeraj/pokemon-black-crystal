<template>
    <div>
        <div id="pokemon_roulette">

            <navigation-bar
                icon="cross-mark"
                title="Pokémon Roulette" />

            <div class="wheel-container">
                <img
                    src="@/assets/images/carnival/pokemon-roulette/roulette-wheel.png"
                    class="wheel"
                    :style="`transform: rotate(${angle}deg);`" />
                <div class="pointer"></div>
            </div>

            <div class="board-container">
                <div class="board">
                    <template
                        v-for="(color, colorIndex) in colors"
                        :key="`color-${colorIndex}`">
                        <button
                            v-for="(insignia, insigniaIndex) in insignias"
                            :key="`insignia-${insigniaIndex}`"
                            class="board-button"
                            :class="`${color} ${insignia}`">
                        </button>
                    </template>
                </div>

                <button class="place-bet">
                    Place Bet
                </button>
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'pokemon-roulette',

        components: {
            NavigationBar
        },

        data() {
            return {
                angle: 0,
                colors: [
                    'yellow',
                    'blue',
                    'red'
                ],
                insignias: [
                    'instinct',
                    'mystic',
                    'valor'
                ]
            }
        },

        created() {setTimeout(() => {
            this.startRotation()
        }, 1000);},

        methods: {
            startRotation() {
                this.angle = getInRange(0, 1800)
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonRoulette.scss"></style>