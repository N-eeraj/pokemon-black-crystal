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

            <carnival-event-pop-up
                v-if="popUp.show"
                :image="require('@/assets/images/coin.svg')"
                :count="coins"
                item="Pokécoins"
                :victory="!!coins"
                :text="popUp.text" />
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import CarnivalEventPopUp from '@/js/components/CarnivalEventPopUp.vue'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'pokemon-roulette',

        components: {
            NavigationBar,
            PopUp,
            CarnivalEventPopUp
        },

        data() {
            return {
                angle: 0,
                colors: [
                    'red',
                    'blue',
                    'yellow'
                ],
                insignias: [
                    'valor',
                    'mystic',
                    'instinct'
                ],
                selections: [],
                betAmount: null,
                showBetCollector: false,
                coins: 0,
                popUp: {
                    show: false,
                    text: null
                }
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

            getColorAndInsignia(index) {
                const result = {}

                if (index < 3)
                    result.insignia = 'valor'
                else if (index < 6)
                    result.insignia = 'mystic'
                else
                    result.insignia = 'instinct'

                switch (index % 3) {
                    case 0:
                        result.color = 'red'
                        break
                    case 1:
                        result.color = 'blue'
                        break
                    case 2:
                        result.color = 'yelow'
                        break
                }
                return result
            },

            startRotation() {
                this.toggleBetCollector()
                this.angle = getInRange(18, 45) * 40

                setTimeout(() => {
                    const result = this.getColorAndInsignia((this.angle / 40) % 9)
                    if (this.selections.some(({ color, insignia }) => color === result.color && insignia === result.insignia)) {
                        this.coins = 9 * this.betAmount / this.selections.length
                        this.popUp.text = "You've won Pokécoins"
                    }
                    else
                        this.popUp.text = 'Better luck next time'
                    this.popUp.show = true
                }, 11500)
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonRoulette.scss"></style>