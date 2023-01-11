<template>
    <div
        class="battle-pokemon"
        :class="view">

        <div class="status">
            <strong>
                {{ $filters.toTitleCase(pokemon.name) }}
            </strong>
            <span>
                Level
                {{ pokemon.level }}
            </span>
            <progress
                :value="pokemon.currentHp"
                :max="pokemon.stat.hp"
                :class="hpClass" />
        </div>

        <div class="pokemon">
            <img :src="pokemon.sprite[view]" />
        </div>

    </div>
</template>

<script>
    export default {
        name: 'battle-pokemon',

        props: {
            pokemon: {
                type: Object,
                required: true
            },
            isFoe: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        computed: {
            view() {
                return this.isFoe ? 'front' : 'back'
            },
            
            hpClass() {
                const healthPercentage = this.pokemon.currentHp / this.pokemon.stat.hp
                if (healthPercentage > 0.65) return 'high'
                if (healthPercentage > 0.25) return 'medium'
                return 'low'
            }
        }
    }
</script>

<style lang="scss" src="@/styles/battle/pokemon.scss"></style>