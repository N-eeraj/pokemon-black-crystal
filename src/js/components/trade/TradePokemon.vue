<template>
    <div
        class="trade-pokemon"
        :class="{ 'is-peer': isPeer }">
        <img
            :src="pokemon.image"
            class="pokemon-image" />
        <strong class="pokemon-name">
            {{ $filters.toTitleCase(pokemon.name) }}
        </strong>
        <span class="level">
            Level
            {{ pokemon.level }}
        </span>
        <div class="types-container">
            <type-icon
                v-for="(type, index) in pokemon.types"
                :type="type"
                :key="`pokemon-type-${index}`" />
        </div>
    </div>
</template>

<script>

    import TypeIcon from '@/js/components/TypeIcon.vue'

    export default {
        name: 'trade-pokemon',


        components: {
            TypeIcon
        },

        props: {
            pokemon: {
                type: Object,
                required: true
            },
            isPeer: {
                type: Boolean,
                required: false,
                default: false
            }
        }
    }
</script>

<style lang="scss" src="@/styles/modes/trade/pokemon.scss"></style>