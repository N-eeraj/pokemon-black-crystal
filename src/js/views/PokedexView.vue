<template>
    <div>
        <div id="pokedex">

            <header>
                <navigation-bar
                    title="Pokédex"
                    icon="cross-mark"
                    class="nav-bar"
                    @iconEvent="$router.push('/')">

                    <template #right-action>
                        <img
                            src="@/assets/icons/filter.svg"
                            class="filter-icon"
                            @click="openFilter = true" />
                    </template>
                </navigation-bar>

                <div class="search-bar">
                    <input
                        v-model="searchQuery"
                        placeholder="Search" />
                    <img
                        src="@/assets/icons/search.svg"
                        class="search-icon" />
                </div>
            </header>

            <div
                v-if="pokedex.length"
                class="pokemon-list">

                <div
                    v-for="pokemon in (searchQuery ? filteredDexList : pokedex)"
                    :key="pokemon.id"
                    class="pokemon-card"
                    :class="{ uncaught: !pokemon.caught }">

                    <div
                        class="details">
                        <span class="id">
                            #{{ pokemon.id.padStart(3, '0') }}
                        </span>
                        <span>
                            {{ $filters.toTitleCase(pokemon.name) }}
                        </span>

                        <div class="types-container">
                            <type-icon
                                v-for="(type, index) in pokemon.types"
                                :type="type"
                                :key="index" />
                        </div>
                    </div>

                    <img
                        :src="pokemon.image"
                        :alt="pokemon.name" />

                </div>

            </div>

        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"
    import TypeIcon from "@/js/components/TypeIcon.vue"

    import { mapGetters, mapActions } from "vuex"

    export default {
        name: 'pokedex-view',

        components: {
            NavigationBar,
            TypeIcon
        },

        data() {
            return {
                openFilter: false,
                searchQuery: '',
                pokedex: []
            }
        },

        computed: {
            filteredDexList() {
                return this.pokedex.filter(pokemon => pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
            },

            ...mapGetters([
                'getPokedexList'
            ])
        },

        async created() {
            const dexList = this.getPokedexList
            dexList.forEach(async pokemon => {
                const details = {
                    id: String(pokemon.id),
                    caught: pokemon.caught,
                    ...await this.getPokemonById(pokemon.id)
                }
                this.pokedex.push(details)
            })
        },

        methods: {
            ...mapActions([
                'getPokemonById'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/pokedex.scss"></style>