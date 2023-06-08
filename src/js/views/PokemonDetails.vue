<template>
    <div>
        <div
            v-if="pokemon"
            id="pokemon_details"
            @click="showActions = false">

            <navigation-bar
                icon="back"
                class="nav-bar"
                @icon-event="$router.push(backPath)">
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
                    :src="pokemon.image"
                    :alt="pokemon.name"
                    class="image" />
                
                <div class="details">
                    <strong>
                        {{ $filters.toTitleCase(pokemon.name) }}
                    </strong>

                    <span v-if="pokemon.level">
                        Level
                        {{ pokemon.level }}
                    </span>

                    <div class="types-container">
                        <type-icon
                            v-for="(type, index) in pokemon.types"
                            :type="type"
                            :key="`type-${index}`"
                            class="type-icon" />
                    </div>

                    <div class="height-weight">
                        <div>
                            <span>
                                {{ pokemon.height }} m
                            </span>
                            <span class="label">
                                Height
                            </span>
                        </div>
                        <div>
                            <span>
                                {{ pokemon.weight }} Kg
                            </span>
                            <span class="label">
                                Weight
                            </span>
                        </div>
                    </div>

                    <div class="stats-container">
                        <span class="label">
                            <template v-if="!pokemon.stat">
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

                            <div
                                v-if="pokemon.happiness"
                                class="stat-value happiness">
                                <span class="stat-label">
                                    Happiness
                                </span>
                                <span>
                                    {{ pokemon.happiness.value }}
                                </span>
                                <progress
                                    :value="pokemon.happiness.value"
                                    :max="pokemon.happiness.max"
                                    :class="getClass(pokemon.happiness)" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <pop-up
                :show="showReleaseModal"
                prevent-redirect
                hash="release"
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
                        @click="closeConfirmRelease">
                        No
                    </button>
                </template>
            </pop-up>

            <items-list
                v-if="usableItems.length && showItems"
                :items-list="usableItems"
                selectable
                @icon-event="toggleShowItems"
                @select-item="useItem" />

            <evolution-pop-up
                v-if="triggerEvolution.trigger"
                :pokemon-list="triggerEvolution.pokemon"
                @completed-evolutions="handleCompletedEvolution" />
        </div>
    </div>
</template>

<script>

    import ItemsList from '@/js/components/ItemsList.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import TypeIcon from '@/js/components/TypeIcon.vue'
    import EvolutionPopUp from '@/js/components/EvolutionPopUp.vue'

    import { mapGetters, mapActions } from 'vuex'

    import items from '@/assets/data/items'

    export default {
        name: 'pokemon-details',

        components: {
            ItemsList,
            NavigationBar,
            PopUp,
            TypeIcon,
            EvolutionPopUp
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
                showReleaseModal: false,
                showItems: false,
                triggerEvolution: {
                    trigger: false,
                    pokemon: null
                },
                evolutionStones: {
                    'fire-stone': 6,
                    'water-stone': 7,
                    'thunder-stone': 8,
                    'leaf-stone': 9,
                    'sun-stone': 10,
                    'moon-stone': 11
                }
            }
        },

        computed: {
            ...mapGetters([
                'getCaughtPokemon',
                'partyPokemon',
                'getCaughtPokemonList',
                'bagItems'
            ])
        },

        watch: {
            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (!toHash && fromHash === '#release')
                        this.closeConfirmRelease()
                }
            }
        },

        created() {
            this.updateAudio('pokemon-details.mp3')
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
                const actions = []

                if (this.usableItems?.length)
                    actions.push({
                        label: 'Use Item',
                        action: this.toggleShowItems
                    })

                if (isParty && this.partyPokemon.length < 2)
                    return actions

                actions.unshift({
                        label: 'Release',
                        action: this.confirmRelease
                    })

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
                this.pokemon.encounterId = id
                this.pokemon.exp = pokemon.exp
                this.pokemon.level = this.pokemon.getLevel(pokemon.exp)
                this.pokemon.happiness = {
                    value: pokemon.happiness,
                    max: 255
                }

                const isInParty = this.partyPokemon.includes(id)
                // check if this is party pokemon & if pokemon is in party
                if (isParty ^ isInParty) this.$router.push('/page-not-found')

                this.setStats('stat', this.pokemon.getLevel(pokemon.exp))
                this.setUsableItems()

                this.actions = this.getActions(isParty)
            },

            getMaxStat(statValue, level, isHp = false) {
                if (!level) return statValue
                let value = (0.02 * statValue * level) + 5 + (5 + level)
                if (isHp) value += (5 + level)
                return Math.round(value, 2)
            },

            getClass(stat) {
                if (!stat) return null
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

            setUsableItems() {
                this.usableItems = [5, 12]
                this.pokemon.evolution.useItem
                    .forEach(({ itemName }) => {
                        if (this.evolutionStones[itemName])
                            this.usableItems.push(this.evolutionStones[itemName])
                    })
                this.usableItems = this.usableItems
                    .map(itemId => {
                        const { id, ...details } = items.find(item => item.id === itemId)
                        return {
                            id,
                            count: this.bagItems[id],
                            ...details
                        }
                    })
                    .filter(({ count }) => count)
            },

            confirmRelease() {
                this.showReleaseModal = true
            },

            closeConfirmRelease() {
                if (this.$route.hash)
                    this.$router.back()
                this.showReleaseModal = false
            },

            release() {
                this.releasePokemon({
                    id: this.pokemon.encounterId,
                    list: this.$route.params.type
                })
                this.closeConfirmRelease()
                this.$router.push(`/pokemon/list/${this.listType}`)
            },

            toggleShowItems() {
                this.showItems = !this.showItems
            },

            handleMovePokemon() {
                const from = this.listType
                const to = (from === 'party') ? 'pc' : 'party'
                this.movePokemon({
                    id: this.pokemon.encounterId,
                    from,
                    to
                })
                this.$router.push(`/pokemon/list/${this.listType}`)
            },

            feedPokeblock() {
                this.pokemon.happiness.value += 30
                if (this.pokemon.happiness.value > 255)
                    this.pokemon.happiness.value = 255
                this.updatePokemonHappiness({
                    id: this.pokemon.encounterId,
                    happiness: 30
                })
            },

            feedRareCandy() {
                const expToLevelUp = this.pokemon.getExpByLevel(this.pokemon.level + 1) - this.pokemon.exp
                this.gainExperience({
                    totalExp: expToLevelUp,
                    encounterIds: [this.pokemon.encounterId]
                })
                this.pokemon.exp += expToLevelUp
                this.pokemon.level++
            },

            useEvoutionItem(id) {
                const evolutionStone = Object.keys(this.evolutionStones)
                    .find(itemName => this.evolutionStones[itemName] === id)
                const { pokemon } = this.pokemon.evolution.useItem
                    .find(({ itemName }) => itemName === evolutionStone)
                this.triggerEvolution.trigger = true
                this.triggerEvolution.pokemon = [
                    {
                        data: this.pokemon,
                        possibilities: [pokemon]
                    }
                ]
            },

            handleCompletedEvolution() {
                this.triggerEvolution.trigger = false
                this.triggerEvolution.pokemon = null
                this.initialize()
            },

            useItem(itemId) {
                switch (itemId) {
                    case 5:
                        this.feedPokeblock()
                        break
                    case 12:
                        this.feedRareCandy()
                        break
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        this.useEvoutionItem(itemId)
                }
                this.updateBag({
                    itemId,
                    count: -1
                })
                this.setUsableItems()
                this.toggleShowItems()
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'getPokemonByEncounterId',
                'movePokemon',
                'releasePokemon',
                'updatePokemonHappiness',
                'updateBag',
                'gainExperience'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/pokemonDetails.scss"></style>