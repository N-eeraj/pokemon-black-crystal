<template>
    <div id="pokemon_list_container">

        <navigation-bar
            :title="title"
            :icon="icon"
            @iconEvent="$emit(iconAction)" />
        
        <div id="pokemon_list">
            <pokemon-card
                v-for="(pokemon, index) in list"
                :pokemon="pokemon"
                :showHp="showHp"
                :key="index"
                class="pokemon-card"
                @click="$emit('selectedPokemon', index)" />
        </div>
    </div>
</template>

<script>
	import NavigationBar from "@/js/components/UI/NavigationBar.vue"
	import PokemonCard from "@/js/components/PokemonCard.vue"

    export default {

        components: {
            NavigationBar,
            PokemonCard
        },

        props: {
            list: {
                type: Object,
                required: true
            },
            title: {
                type: String,
                required: false
            },
            icon: {
                type: String,
                required: false
            },
            iconAction: {
                type: String,
                required: false
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
            },
            rearrangeAction: {
                type: String,
                required: false
            }
        }
    }
</script>

<style lang="scss">
	@import "@/styles/pokemonList";
</style>