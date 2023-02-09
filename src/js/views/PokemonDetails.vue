<template>
    <div>
        <div
            id="pokemon_details"
            @click="showActions = false">

            <navigation-bar
                icon="back"
                class="nav-bar"
                @iconEvent="$router.push(backPath)">
                <template
                    #right-action
                    v-if="actions?.length">
                    <img
                        src="@/assets/icons/options.svg"
                        alt="options"
                        class="right-icon"
                        @click.stop="showActions = true" />
                    <ul
                        v-if="showActions"
                        class="options-container">
                        <li
                            v-for="(action, index) in actions"
                            :key="`action-${index}`"
                            class="option"
                            @click="action.action">
                            {{ action.label }}
                        </li>
                    </ul>
                </template>
            </navigation-bar>

            <div class="details-container">

                <img
                    :src="pokemon?.image"
                    :alt="pokemon?.name"
                    class="image" />
                
                <div class="details">
                    <strong v-if="pokemon?.name">
                        {{ $filters.toTitleCase(pokemon?.name) }}
                    </strong>

                    <div class="types-container">
                        <type-icon
                            v-for="(type, index) in pokemon?.types"
                            :type="type"
                            :key="`type-${index}`" />
                    </div>

                    <div class="height-weight">
                        <div>
                            <span>
                                {{ pokemon?.height }} m
                            </span>
                            <span class="label">
                                Height
                            </span>
                        </div>
                        <div>
                            <span>
                                {{ pokemon?.weight }} Kg
                            </span>
                            <span class="label">
                                Weight
                            </span>
                        </div>
                    </div>

                    <div class="stats-container">
                        <span class="label">
                            <template v-if="!pokemon?.stat">
                                Base
                            </template>
                            Stats
                        </span>

                        <div class="stats">
                            <div
                                v-for="(stat, index) in stats"
                                :key="`stat-${index}`"
                                class="stat-value">

                                <span class="stat-label">
                                    {{ stat.label }}
                                </span>
                                <span>
                                    {{ stat.value }}
                                </span>
                                <progress
                                    :value="stat.value"
                                    :max="stat.max"
                                    :class="getClass(stat)" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <pop-up
                v-if="showReleaseModal"
                class="release-modal">
                <template #body>
                    <div class="text">
                        Are you sure you want to release this pokemon?
                    </div>
                </template>
                <template #actions>
                    <button
                        class="confirm"
                        @click="release">
                        Yes
                    </button>
                    <button
                        class="cancel"
                        @click="showReleaseModal = false">
                        No
                    </button>
                </template>
            </pop-up>

        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import TypeIcon from '@/js/components/TypeIcon.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'pokemon-details',

        components: {
            NavigationBar,
            PopUp,
            TypeIcon
        },

        data() {
            return {
                pokemon: null,
                stats: [],
                listType: null,
                usableItems:  [],
                backPath: null,
                actions: null,
                showActions: false,
                showReleaseModal: false
            }
        },

        computed: {
            ...mapGetters([
                'getCaughtPokemon',
                'partyPokemon',
                'getCaughtPokemonList'
            ])
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                this.listType = this.$route.params.type
                let id = this.$route.params.id
                id = Number(id)

                switch (this.listType) {
                    case 'pokedex':
                        if (id < 387 && this.getCaughtPokemonList.includes(id)) {
                            this.backPath = '/pokedex'
                            this.setPokemonDetails(id)
                        }
                        else this.$router.push('/page-not-found')
                        break

                    case 'party':
                        this.backPath = '/pokemon/list/party'
                        this.getCaughtPokemonDetails(id, true)
                        break

                    case 'pc':
                        this.backPath = '/pokemon/list/pc'
                        this.getCaughtPokemonDetails(id, false)
                        break

                    default:
                        this.$router.push('/page-not-found')
                }
            },

            getActions(isParty) {
                if (isParty && this.partyPokemon.length < 2) return

                const actions = [
                    {
                        label: 'Release',
                        action: this.confirmRelease
                    },
                    {
                        label: 'Use Item',
                        action: this.showItems
                    }
                ]

                if (!isParty && this.partyPokemon.length > 5) return actions

                actions.unshift({
                    label: `Move to ${ isParty ? 'PC' : 'Party' }`,
                    action: this.handleMovePokemon
                })
                return actions
            },

            async setPokemonDetails(id) {
                this.pokemon = await this.getPokemonById(id)
                this.setStats('baseStat')
            },

            async getCaughtPokemonDetails(id, isParty) {
                const pokemon = this.getCaughtPokemon(id)
                if (!pokemon) return this.$router.push('/page-not-found')
                await this.setPokemonDetails(pokemon.id)
                this.pokemon.stat = this.pokemon.getStat(pokemon.exp)
                this.pokemon.caughtId = id

                const isInParty = this.partyPokemon.includes(id)
                // check if this is party pokemon & if pokemon is in party
                if (isParty ^ isInParty) this.$router.push('/page-not-found')

                this.actions = this.getActions(isParty)

                this.setStats('stat', this.pokemon.getLevel(pokemon.exp))
                this.setUsableItems()
            },

            getMaxStat(statValue, level, isHp = false) {
                if (!level) return statValue
                let value = (0.02 * statValue * level) + 5 + (5 + level)
                if (isHp) value += (5 + level)
                return Math.round(value, 2)
            },

            getClass(stat) {
                const percentage = stat.value / stat.max
                if (percentage > 0.65) return 'high'
                if (percentage > 0.25) return 'medium'
                return 'low'
            },

            setStats(stat, level = null) {
                this.stats = [
                    {
                        label: 'HP',
                        value: this.pokemon[stat].hp,
                        max: this.getMaxStat(255, level, true)
                    },
                    {
                        label: 'ATTACK',
                        value: this.pokemon[stat].attack,
                        max: this.getMaxStat(160, level)
                    },
                    {
                        label: 'DEFENCE',
                        value: this.pokemon[stat].defense,
                        max: this.getMaxStat(230, level)
                    },
                    {
                        label: 'SPEED',
                        value: this.pokemon[stat].speed,
                        max: this.getMaxStat(160, level)
                    },
                    {
                        label: 'SP.ATK',
                        value: this.pokemon[stat]['special-attack'],
                        max: this.getMaxStat(155, level)
                    },
                    {
                        label: 'SP.DEF',
                        value: this.pokemon[stat]['special-defense'],
                        max: this.getMaxStat(230, level)
                    }
                ]
            },

            setEvolutionItem() {
                const evolutionStones = {
                    'fire-stone': 6,
                    'water-stone': 7,
                    'thunder-stone': 8,
                    'leaf-stone': 9,
                    'sun-stone': 10,
                    'moon-stone': 11
                }
                this.pokemon.evolution.useItem.forEach(({ itemName, pokemon }) => {
                    this.usableItems.push({
                        itemId: evolutionStones[itemName],
                        type: 'evolution',
                        pokemon
                    })
                })
            },

            setUsableItems() {
                this.setEvolutionItem()
                console.log(this.usableItems)
            },

            confirmRelease() {
                this.showReleaseModal = true
            },

            release() {
                this.releasePokemon({
                    id: this.pokemon.caughtId,
                    list: this.$route.params.type
                })
                this.showReleaseModal = false
                this.$router.push(`/pokemon/list/${this.listType}`)
            },

            showItems() {
                console.log(123)
            },

            handleMovePokemon() {
                const from = this.listType
                const to = (from === 'party') ? 'pc' : 'party'
                this.movePokemon({
                    id: this.pokemon.caughtId,
                    from,
                    to
                })
                this.$router.push(`/pokemon/list/${this.listType}`)
            },

            ...mapActions([
                'getPokemonById',
                'getPokemonByEncounterId',
                'movePokemon',
                'releasePokemon'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/pokemonDetails.scss"></style>