<template>
    <div
        class="battle-pokemon"
        :class="view">

        <div
            class="status"
            :class="{ caught: catchStatus?.caught }">
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
            <img
                v-if="catchStatus?.ballUsed"
                :src="require(`@/assets/images/items${pokeball}`)"
                class="pokeball-image"
                :class="{ caught: catchStatus.caught }" />
            <img
                v-else
                :src="pokemon.sprite[view]"
                class="pokemon-image" />
        </div>

    </div>
</template>

<script>

    import items from "@/assets/data/items"

    export default {
        name: 'battle-pokemon',

        props: {
            pokemon: {
                type: Object,
                required: true
            },
            catchStatus: {
                type: Object,
                required: false
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
            },

            pokeball() {
                return items.find(item => item.id == this.catchStatus.ballUsed).image
            }
        }
    }
</script>

<style lang="scss" src="@/styles/battle/pokemon.scss"></style>