<template>
    <div>
        <div id="pokemon_roulette">

            <navigation-bar
                :icon="angle ? '' : 'cross-mark'"
                title="Pokémon Roulette"
                :class="{ hide: !angle }"
                @icon-event="$router.push('/mode/carnival')" />

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
                            :class="`${color} ${insignia} ${ isSelected({ color, insignia }) }`"
                            :disabled="angle"
                            @click="selectOption({ color, insignia })">
                        </button>
                    </template>
                </div>

                <button
                    class="place-bet"
                    :class="{ active: selections.length && !angle }"
                    :disabled="!selections.length || angle"
                    @click="toggleBetCollector">
                    Place Bet
                </button>
            </div>

            <pop-up
                v-if="showBetCollector"
                close
                class="bet-modal"
                @close-pop-up="toggleBetCollector">
                <template #body>
                    <div class="body">
                        <img
                            src="@/assets/images/coin.svg"
                            alt="Pokécoin"
                            class="image" />
                        <input
                            v-model="betAmount"
                            placeholder="Bet Amount"
                            class="bet-input"
                            @keyup.enter="startRotation" />
                    </div>
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        :class="{ disabled: invalidBetAmount }"
                        :disabled="invalidBetAmount"
                        @click="startRotation">
                        Confirm
                    </button>
                </template>
            </pop-up>
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'pokemon-roulette',

        components: {
            NavigationBar,
            PopUp
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
                ],
                selections: [],
                betAmount: null,
                showBetCollector: false
            }
        },

        computed: {
            invalidBetAmount() {
                if (isNaN(this.betAmount) || !this.betAmount)
                    return true
                return !Number.isInteger(Number(this.betAmount))
                
            }
        },

        methods: {
            selectOption({ color, insignia }) {
                for (const [index, selection] of this.selections.entries()) {
                    if (color === selection.color && insignia === selection.insignia) {
                        this.selections.splice(index, 1)
                        return
                    }
                }
                if (this.selections.length === 3) this.selections.shift()
                this.selections.push({ color, insignia })
            },

            isSelected({ color, insignia }) {
                for (const selection of this.selections) {
                    if (color === selection.color && insignia === selection.insignia) {
                        return 'selected'
                    }
                }
                return ''
            },

            toggleBetCollector() {
                this.showBetCollector = !this.showBetCollector
            },

            startRotation() {
                this.toggleBetCollector()
                this.angle = getInRange(18, 45) * 40
                setTimeout(() => {
                    console.log((this.angle / 40) % 9)
                    console.log(this.selections)
                    console.log(Number(this.betAmount))
                }, 12000)
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonRoulette.scss"></style>