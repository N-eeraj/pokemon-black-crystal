<template>
    <div id="pokemon_list_container">

        <navigation-bar
            :title="title"
            :icon="icon"
            @iconEvent="$emit('navIconAction')" />
        
        <div id="pokemon_list">
            <pokemon-card
                v-for="(pokemon, index) in list"
                :pokemon="pokemon"
                :show-hp="showHp"
                :rearrangeable="rearrangeable"
                :key="index"
                @click="$emit('selectedPokemon', index)"
                @rearrange="(positions) => handleRearrange(index, positions)" />
        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"
    import PokemonCard from "@/js/components/PokemonCard.vue"

    export default {
        name: 'pokemon-list',

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

        methods: {
            handleRearrange(currentIndex, positions) {
                this.$emit('rearrangePokemon', {
                    currentIndex,
                    newIndex: currentIndex + positions
                })
            }
        },
    }
</script>

<style lang="scss" src="@/styles/pokemonList.scss"></style>