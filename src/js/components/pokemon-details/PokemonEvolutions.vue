<template>
    <div id="pokemonEvolutions">
        <div
            v-if="loading"
            class="loading">
            Loading Evolutions
        </div>


        <div
            v-else-if="noEvolutions"
            class="no-evolution">
            This Pokémon has no evolutions
        </div>

        <div
            v-else
            class="main-container">

            <div
                v-if="levelUp"
                class="container">
                <strong class="sub-title">
                    Evolutions by leveling up
                </strong>
                <div class="evolution-pokemon-list">
                    <img
                        v-for="(pokemon, index) in levelUp.pokemonList"
                        :src="pokemon"
                        alt="Pokemon"
                        :key="index"
                        class="pokemon" />
                </div>
            </div>

            <div
                v-if="happinessUp"
                class="container">
                <strong class="sub-title">
                    Evolutions with happiness
                </strong>
                <span class="requirement">
                    Happiness required: {{ happinessUp.happiness }}
                </span>
                <div class="evolution-pokemon-list">
                    <img
                        v-for="(pokemon, index) in happinessUp.pokemonList"
                        :src="pokemon"
                        alt="Pokemon"
                        :key="index"
                        class="pokemon" />
                </div>
            </div>

            <div
                v-if="useItems.length"
                class="container">
                <strong class="sub-title">
                    Evolutions by using items
                </strong>
                <div class="evolution-pokemon-list">
                    <div
                        v-for="({itemName, evolvesTo}, index) in useItems"
                        :key="index"
                        class="item">
                        <img
                            :src="evolvesTo"
                            alt="Pokemon"
                            class="pokemon" />

                        <img
                            :src="require(`@/assets/images/items/evolution/${itemName}.png`)"
                            :alt="itemName"
                            class="evolution-item" />
                    </div>
                </div>
            </div>

            <div
                v-if="trade.length"
                class="container">
                <strong class="sub-title">
                    Evolutions by trading
                </strong>
                <div class="evolution-pokemon-list">
                    <img
                        v-for="(pokemon, index) in trade"
                        :src="pokemon"
                        alt="Pokemon"
                        :key="index"
                        class="pokemon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: 'pokemon-evolution',

        props: {
            evolutions: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                levelUp: null,
                happinessUp: null,
                useItems: [],
                trade: [],
                loading: true
            }
        },

        async mounted() {
            await Promise.all([
                this.getLevelUpEvolutions(),
                this.getHappinessUpEvolutions(),
                this.getUseItemsEvolutions(),
                this.getTradeEvolutions()
            ])
            this.loading = false
        },

        computed: {
            noEvolutions() {
                return !(this.levelUp || this.happinessUp || this.useItems.length || this.trade.length)
            }
        },

        methods: {
            async getEvolvesToPokemonImages(pokemonList) {
                const evolvedList = []
                await pokemonList.forEach(async (id) => {
                    const image= await this.getPokemonImageById(id)
                    evolvedList.push(image)
                })
                return evolvedList
            },

            async getLevelUpEvolutions() {
                const { minLevel: level, pokemon } = this.evolutions.levelUp
                if (!level) return
                const pokemonList = await this.getEvolvesToPokemonImages(pokemon)
                this.levelUp = { level, pokemonList }
            },

            async getHappinessUpEvolutions() {
                const { minLevel: happiness, pokemon } = this.evolutions.happinessUp
                if (!happiness) return
                const pokemonList = await this.getEvolvesToPokemonImages(pokemon)
                this.happinessUp = { happiness, pokemonList }
            },

            async getUseItemsEvolutions() {
                if (!this.evolutions.useItem.length) return
                this.evolutions.useItem.forEach(async ({itemName, pokemon}) => {
                    const evolvesTo = await this.getPokemonImageById(pokemon)
                    this.useItems.push({
                        itemName,
                        evolvesTo
                    })
                })
            },

            async getTradeEvolutions() {
                if (!this.evolutions.trade) return
                this.evolutions.trade.forEach(async id => {
                    const pokemon = await this.getPokemonImageById(id)
                    this.trade.push(pokemon)
                })
            },

            ...mapActions([
                'getPokemonImageById'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/pokemon-details/evolutions.scss"></style>