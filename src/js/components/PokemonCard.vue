<template>
    <div
        draggable="true"
        class="pokemon-card"
        :class="{ wiggle: (startPosition && canMove) }"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd">

        <div
            class="image"
            :style="{'background-image': `url(${pokemon.image})`}"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd">
        </div>

        <div class="details">
            <strong>
                {{ $filters.toTitleCase(pokemon.name) }}
            </strong>

            <span>
                Level {{ pokemon.level }}
            </span>

            <progress
                v-if="showHp"
                :value="pokemon.currentHp"
                :max="pokemon.stat.hp"
                :class="hpClass(pokemon)" />

            <div class="types-list">
                <type-icon
                    v-for="(type, index) in pokemon.types"
                    :type="type"
                    :key="index" />
            </div>
        </div>
    </div>
</template>

<script>

    import TypeIcon from '@/js/components/TypeIcon.vue'

    export default {
        name: 'pokemon-card',

        components: {
            TypeIcon
        },

        props: {
            pokemon: {
                type: Object,
                required: true
            },
            showHp: {
                type: Boolean,
                required: false,
                default: false
            },
            rearrangeable: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        
        data() {
            return {
                startPosition: null,
                startTime: null,
                now: null,
                interval: null
            }
        },

        computed: {
            delay() {
                return this.now - this.startTime
            },
            canMove() {
                return this.delay > 1000 ? this.startTime : false
            },
        },

        mounted() {
            this.interval = setInterval(() => {
                if (this.startTime) this.now = Date.now()
            }, 100)
        },

        beforeUnmount() {
            clearInterval(this.interval)
        },

        methods: {
            hpClass(pokemon) {
                const healthPercentage = pokemon.currentHp / pokemon.stat.hp
                if (healthPercentage > 0.65) return 'high'
                if (healthPercentage > 0.25) return 'medium'
                return 'low'
            },

            handleTouchStart() {
                event.preventDefault()
                this.handleStart(event.changedTouches[0].screenY)
            },

            handleDragStart() {
                this.handleStart(event.y)
            },

            handleStart(startValue) {
                if (!this.rearrangeable) return
                this.startPosition = startValue
                this.startTime = Date.now()
            },

            handleTouchEnd() {
                this.handleEnd(event.changedTouches[0].screenY, event.target.closest('.pokemon-card').offsetHeight)
            },

            handleDragEnd() {
                this.handleEnd(event.y, event.target.closest('.pokemon-card').offsetHeight)
            },

            handleEnd(endValue, elementHeight) {
                const change = Math.round((endValue - this.startPosition) / elementHeight)
                if (!change && this.delay < 400)
                    this.$emit('click')
                else if (this.rearrangeable && this.canMove) {
                    if (change !== 0) this.$emit('rearrange', change)
                }
                this.startPosition = null
                this.startTime = null
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/pokemonCard.scss"></style>