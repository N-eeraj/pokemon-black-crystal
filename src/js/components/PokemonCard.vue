<template>

    <div
        draggable="true"
        class="pokemon-card"
        :class="{ wiggle: startPosition}">

        <img :src="pokemon.image"
        @touchstart="handleTouchStart"
        @dragstart="handleDragStart"
        @touchend="handleTouchEnd"
        @dragend="handleDragEnd" />

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
                <div
                    v-for="(type, index) in pokemon.types"
                    :key="index"
                    class="pokemon-type"
                    :class="type">
                    {{ $filters.toTitleCase(type) }}
                </div>
            </div>
        </div>
</div>

</template>

<script>
    
    export default {
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
                startPosition: null
            }
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
                console.log(this.$refs.pokemonCard)
            },

            handleTouchEnd() {
                this.handleEnd(event.changedTouches[0].screenY, event.target.closest('.pokemon-card').offsetHeight)
            },

            handleDragEnd() {
                this.handleEnd(event.y, event.target.closest('.pokemon-card').offsetHeight)
            },

            handleEnd(endValue, elementHeight) {
                if (!this.rearrangeable) return
                const change = Math.round((endValue - this.startPosition) / elementHeight)
                if (change !== 0) this.$emit('rearrange', change)
                this.startPosition = null
            }
        }
    }

</script>

<style lang="scss">
	@import "@/styles/pokemonCard";
</style>