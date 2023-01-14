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

            <div
                v-if="openFilter"
                id="filter_view">
                
                <navigation-bar
                    title="Filter"
                    icon="cross-mark"
                    @iconEvent="openFilter = false">
                    <template #right-action>
                        <button
                            class="apply-filter-btn"
                            @click="applyFilter">
                            Apply
                        </button>
                    </template>
                </navigation-bar>

                <div class="filter-container">

                    <div class="filter">
                        <div
                            class="title"
                            :class="{ 'open-filter': filterVisibility.encountered }"
                            @click="toggleFilterVisiblity('encountered')">
                            Encountered
                        </div>
                        <div
                            v-if="filterVisibility.encountered"
                            class="options">
                            <label
                                v-for="radioOption in encounter"
                                :for="`encountered_${radioOption.label}`"
                                :key="radioOption.value"
                                class="option">
                                <input
                                    type="radio"
                                    v-model="filter.encounter"
                                    :value="radioOption.value"
                                    name="encounter"
                                    :id="`encountered_${radioOption.label}`" />
                                <span>
                                    {{ $filters.toTitleCase(radioOption.label) }}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div class="filter">
                        <div
                            class="title"
                            :class="{ 'open-filter': filterVisibility.type }"
                            @click="toggleFilterVisiblity('type')">
                            Types
                        </div>
                        <div
                            v-if="filterVisibility.type"
                            class="options">
                            <label
                                v-for="type in allTypes"
                                :for="type"
                                :key="type"
                                class="option">
                                <input
                                    type="checkbox"
                                    v-model="filter.types"
                                    :value="type"
                                    name="encounter"
                                    :id="type" />
                                <span>
                                    {{ $filters.toTitleCase(type) }}
                                </span>
                            </label>
                        </div>
                    </div>

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
                originalPokedex: [],
                pokedex: [],
                filter: {
                    encounter: 0,
                    types: []
                },
                filterVisibility: {
                    encounter: false,
                    types: false
                },
                encounter: [
                    {
                        label: 'all',
                        value: 0
                    },
                    {
                        label: 'caught',
                        value: 1
                    },
                    {
                        label: 'not-caught',
                        value: 2
                    }
                ]
            }
        },

        computed: {
            filteredDexList() {
                return this.pokedex.filter(pokemon => pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
            },

            ...mapGetters([
                'getPokedexList',
                'allTypes'
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
                this.originalPokedex.push(details)
            })
            this.pokedex = this.originalPokedex
        },

        methods: {
            toggleFilterVisiblity(filter) {
                this.filterVisibility[filter] = !this.filterVisibility[filter]
            },

            applyFilter() {
                switch (this.filter.encounter) {
                    case 1:
                        this.pokedex = this.originalPokedex.filter(pokemon => pokemon.caught)
                        break
                    case 2:
                        this.pokedex = this.originalPokedex.filter(pokemon => !pokemon.caught)
                        break
                    default:
                        this.pokedex = this.originalPokedex
                }
                if (this.filter.types.length) {
                    this.pokedex = this.pokedex.filter(pokemon => pokemon.types.some(type => this.filter.types.includes(type)))
                }
                this.openFilter = false
            },

            ...mapActions([
                'getPokemonById'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/pokedex.scss"></style>