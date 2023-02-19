<template>
    <div>
        <div id="berry_crusher">

            <h1 class="title">
                Berry Crusher
            </h1>

            <div
                class="crusher-container"
                @click="handleCrusherPress">
                <img
                    src="@/assets/images/carnival/berry-crusher/rotar.png"
                    class="rotar"
                    :style="`transform: rotate(${angle}deg);`" />
                <img
                    src="@/assets/images/carnival/berry-crusher/pointer.png"
                    :class="{ disabled: !chance }" />
            </div>

            <p class="instructions">
                Click on the rotating berry crusher when the points meet.
                You'll have 5 chances.
            </p>

            <carnival-event-pop-up
                v-if="popUp.show"
                :image="require('@/assets/images/items/pokeblock.png')"
                item="Pokéblock"
                :count="count"
                :victory="!!count"
                :text="popUp.text" />

        </div>
    </div>
</template>

<script>

    import CarnivalEventPopUp from '@/js/components/CarnivalEventPopUp.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'berry-crusher',

        components: {
            CarnivalEventPopUp
        },

        data() {
            return {
                angle: 0,
                speed: 0.5,
                points: 0,
                chance: 5,
                popUp: {
                    show: false,
                    text: null
                }
            }
        },

        computed: {
            count() {
                return Math.floor(this.points / 3)
            },

            ...mapGetters([
                'currentCarnivalEntry'
            ])
        },

        created() {
            if (this.currentCarnivalEntry !== 'berry-crusher')
                return this.$router.push('/mode/carnival')
            const crusherRotation = setInterval(() => {
                this.angle += this.speed
                if (this.angle >= 1800) {
                    clearInterval(crusherRotation)
                    this.gameOver()
                }
            }, 10)
        },

        beforeUnmount() {
            this.updateCarnivalEntry()
        },

        methods: {
            updatePoints(points) {
                this.points += points
                this.speed = Number((this.speed + (0.3 * points)).toFixed(2))
            },

            handleCrusherPress() {
                if (!this.chance) return
                --this.chance
                const currentAngle = this.angle % 360
                if (currentAngle > 177.5 && currentAngle < 182.5)
                    this.updatePoints(2)
                else if (currentAngle > 170 && currentAngle < 190)
                    this.updatePoints(1)
            },

            gameOver() {
                this.popUp.text = this.count ? "You've won Pokéblock" : 'Better luck next time'
                this.updateBag({
                    itemId: 5,
                    count: this.count
                })
                setTimeout(() => {
                    this.popUp.show = true
                }, 1000)
            },

            ...mapActions([
                'updateCarnivalEntry',
                'updateBag'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/berryCrusher.scss"></style>