<template>
    <div>
        <div id="berry_crusher">

            <h1 class="title">
                Berry Crusher
            </h1>

            <div class="main-container">
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
                
                <div class="progress">
                    <template
                        v-for="(value, index) of progress"
                        :key="index">
                        <div
                            class="progress-item"
                            :class="getProgressClass(value)" />
                    </template>
                </div>
            </div>

            <p class="instructions">
                Click on the rotating berry crusher when the points meet.
                You'll have 5 chances.
            </p>

            <carnival-event-pop-up
                :show="popUp.show"
                :image="require('@/assets/images/items/pokeblock.png')"
                item="Pokéblock"
                :count="count"
                :victory="!!count"
                :text="popUp.text" />

        </div>
    </div>
</template>

<script>

    import CarnivalEventPopUp from '@/js/components/pop-up/CarnivalEventPopUp.vue'

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
                progress: [null, null, null, null, null],
                chance: 5,
                popUp: {
                    show: false,
                    text: null
                }
            }
        },

        computed: {
            points() {
                return this.progress.reduce((total, value) => total += value, 0)
            },

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
                if (this.angle >= 1800 || this.chance === 0) {
                    clearInterval(crusherRotation)
                    this.gameOver()
                }
            }, 10)
            window.onbeforeunload = () => true
        },

        beforeUnmount() {
            this.updateCarnivalEntry()
            window.onbeforeunload = null
        },

        methods: {
            getProgressClass(value) {
                switch (value) {
                    case null:
                        return 'pending'
                    case 0:
                        return 'failed'
                    case 1:
                        return 'success'
                    case 2:
                        return 'success double'
                }
            },

            updatePoints(points) {
                this.progress[4 - this.chance] = points
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
                else
                    this.updatePoints(0)
            },

            gameOver() {
                this.popUp.text = this.count ? "You've won Pokéblock" : 'Better luck next time'
                this.updateBag({
                    itemId: 5,
                    count: this.count
                })
                if (this.count) {
                    this.updateAchievement({
                        type: 'carnival',
                        item: 'berryCrusher',
                        count: this.count
                    })
                }
                setTimeout(() => {
                    this.popUp.show = true
                }, 1000)
            },

            ...mapActions([
                'updateCarnivalEntry',
                'updateBag',
                'updateAchievement'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/berryCrusher.scss"></style>