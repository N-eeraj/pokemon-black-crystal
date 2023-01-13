<template>

    <div
        draggable="true"
        class="pokemon-card"
        :class="{ wiggle: (startPosition && canMove) }"
        @touchstart="handleTouchStart"
        @dragstart="handleDragStart"
        @touchend="handleTouchEnd"
        @dragend="handleDragEnd">

        <div
            class="image"
            :style="`background-image: url(${pokemon.image});`">
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
                now: null
            }
        },

        computed: {
            canMove() {
                if (this.startTime) return (this.now - this.startTime) > 1000
                return false
            },
        },

        mounted() {
            setInterval(() => {
                if (this.startTime) this.now = Date.now()
            }, 100)
        },

        methods: {
            hpClass(pokemon) {
                const healthPercentage = pokemon.currentHp / pokemon.stat.hp
                if (healthPercentage > 0.75) return 'high'
                if (healthPercentage > 0.4) return 'medium'
                return 'low'
            },

            handleTouchStart() {
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
                if (this.rearrangeable && this.canMove) {
                    const change = Math.round((endValue - this.startPosition) / elementHeight)
                    if (change !== 0) this.$emit('rearrange', change)
                }
                this.startPosition = null
                this.startTime = null
            }
        }
    }
</script>

<style lang="scss" scoped src="@/styles/pokemonCard.scss"></style>