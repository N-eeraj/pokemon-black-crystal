<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else-if="participants.length === 4"
            id="pokemon_dash">

            <div
                v-for="({ id, completed, name, sprite }) in participants"
                :key="id"
                class="participant">
                <div class="track">
                    <div class="progress"></div>
                    <div :style="`height: ${completed}%;`">
                    </div>
                </div>

                <div class="image-container">
                    <img
                        :src="sprite.front"
                        :alt="name" />
                </div>
            </div>

            <carnival-event-pop-up
                v-if="popUp.show"
                :image="require('@/assets/images/coin.svg')"
                :count="150"
                item="Pokécoins"
                :victory="victory"
                :text="popUp.text" />

        </div>

        <pokemon-list
            v-else
            :list="pokemonList"
            title="Select Pokémon"
            icon="cross-mark"
            @nav-icon-action="$router.push('/mode/carnival')"
            @selected-pokemon="handleSelectPokemon" />
    </div>
</template>

<script>

    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import PokemonList from '@/js/components/PokemonList.vue'
    import CarnivalEventPopUp from '@/js/components/CarnivalEventPopUp.vue'

    import { mapGetters, mapActions } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'

    export default {
        name: 'pokemon-dash',

        components: {
            CommonLoader,
            PokemonList,
            CarnivalEventPopUp
        },

        data() {
            return {
                loading: true,
                pokemonList: null,
                participants: null,
                victory: null,
                popUp: {
                    show: false,
                    text: null
                }
            }
        },

        computed: {
            ...mapGetters([
                'currentCarnivalEntry',
                'partyPokemon',
                'getCaughtPokemon'
            ])
        },

        async created() {
            if (this.currentCarnivalEntry !== 'pokemon-dash')
                return this.$router.push('/mode/carnival')
            this.participants = await this.getCarnivalPokemon(3)
            this.setList()
            this.loading = false
        },

        beforeUnmount() {
            this.updateCarnivalEntry()
        },

        methods: {
            setList() {
                this.pokemonList = []
                const pokemonList = this.partyPokemon.map(id => {
                    return {
                        caughtId: id,
                        ...this.getCaughtPokemon(id)
                    }
                })
                pokemonList.map(async (pokemon) => {
                    const pokemonDetails = await this.getPokemonById(pokemon.id)
                    this.pokemonList.push({
                        caughtId: pokemon.caughtId,
                        exp: pokemon.exp,
                        level: pokemonDetails.getLevel(pokemon.exp),
                        stats: pokemonDetails.getStat(pokemon.exp),
                        ...pokemonDetails
                    })
                })
            },

            handleRaceCompleted() {
                const completions = this.participants.map(({ completed }) => completed)
                this.victory = completions.indexOf(Math.max(...completions)) === 3
                let happiness
                if (this.victory) {
                    this.popUp.text = "You've won Pokécoins"
                    this.updatePlayerCoins(150)
                    happiness = 10
                }
                else {
                    this.popUp.text = 'Better luck next time'
                    happiness = 5
                }
                this.updatePokemonHappiness({
                    id: this.participants[3].caughtId,
                    happiness
                })
                setTimeout(() => {
                    this.popUp.show = true
                }, 1000)
            },

            startRace() {
                const race = setInterval(() => {
                    this.participants
                        .forEach(pokemon => {
                            pokemon.completed += (pokemon.stats.speed * Math.random() * 0.9 + 1.1) / 125
                        })
                    if (this.participants.some(({ completed }) => completed >= 100)) {
                        clearInterval(race)
                        this.handleRaceCompleted()
                    }
                }, 10)
            },

            setOpponentStats(selectedPokemonLevel) {
                this.participants.forEach(pokemon => 
                    pokemon.stats = pokemon.getStat(
                        pokemon.getExpByLevel(
                            getInRange(
                                Math.max(Math.floor(selectedPokemonLevel * 0.8), 5),
                                Math.min(Math.floor(selectedPokemonLevel * 1.5), 100)
                            )
                        )
                    )
                )
            },

            handleSelectPokemon(index) {
                const selectedPokemon = this.pokemonList[index]
                this.setOpponentStats(selectedPokemon.level)
                this.participants.push(selectedPokemon)
                this.participants.forEach(pokemon => pokemon.completed = 0)
                setTimeout(() => {
                    this.startRace()
                }, 3000)
            },

            ...mapActions([
                'getCarnivalPokemon',
                'getPokemonById',
                'updateCarnivalEntry',
                'updatePokemonHappiness',
                'updatePlayerCoins'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/modes/carnival/pokemonDash.scss"></style>