<template>

    <div class="pokemon-card">
        
        <img :src="pokemon.image">

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
            }
        },

        methods: {
            hpClass(pokemon) {
                const healthPercentage = pokemon.currentHp / pokemon.stat.hp
                if (healthPercentage > 0.75) return 'high'
                if (healthPercentage > 0.4) return 'medium'
                return 'low'
            }
        }
    }

</script>

<style lang="scss">
	@import "@/styles/pokemonCard";
</style>