<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else-if="participants.length === 4"
            id="block_smash">

            <div class="participants-container">
                <div
                    v-for="({ id, blocks, name, sprite }) in participants"
                    :key="id"
                    class="participant">

                    <div class="image-container">
                        <img
                            :src="sprite.front"
                            :alt="name" />
                    </div>
                    <div
                        v-for="(block, index) in blocks"
                        :key="index"
                        class="block">
                    </div>
                </div>
            </div>

            <button class="smash">
                Smash
            </button>

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
            if (this.currentCarnivalEntry !== 'block-smash')
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
                this.participants.forEach(pokemon => pokemon.blocks = 100)
                console.log(this.participants)
            },

            ...mapActions([
                'getCarnivalPokemon',
                'getPokemonById',
                'updateCarnivalEntry',
                'updatePlayerCoins'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/blockSmash.scss"></style>