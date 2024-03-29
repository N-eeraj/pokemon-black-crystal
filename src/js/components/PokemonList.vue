<template>
    <div id="pokemon_list_container">
        <navigation-bar
            :title="title"
            :icon="icon"
            @icon-event="$emit('navIconAction')">
            <template #right-action>
                <slot name="nav-right-actions" />
            </template>
        </navigation-bar>

        <slot />

        <div ref="pokemonList" id="pokemon_list">
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

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PokemonCard from '@/js/components/PokemonCard.vue'

    import autoAnimate from '@formkit/auto-animate'

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
            },
            closable: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                pokemonList: null
            }
        },

        mounted() {
            autoAnimate(this.$refs.pokemonList)
            if (this.closable)
                this.$router.push({ hash: '#pokemon'})
        },

        beforeUnmount() {
            if (this.closable)
                this.$router.replace({ hash: null })
        },

        methods: {
            handleRearrange(currentIndex, positions) {
                this.$emit('rearrangePokemon', {
                    currentIndex,
                    newIndex: currentIndex + positions
                })
            }
        }
    }
</script>

<style lang="scss" src="@/styles/pokemonList.scss"></style>