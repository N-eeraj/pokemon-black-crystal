<template>
    <div>
        <div id="player_pokemon_list">
            <pokemon-list
                :list="pokemonList"
                :title="listTitle"
                icon="cross-mark"
                rearrangeable
                @nav-icon-action="$router.push('/')"
                @selected-pokemon="handleSelectPokemon"
                @rearrange-pokemon="changeListOrder">

                <box-list
                    v-if="isPC"
                    :box="currentBox" />

            </pokemon-list>
        </div>
    </div>
</template>

<script>

    import PokemonList from '@/js/components/PokemonList.vue'
    import BoxList from '@/js/components/BoxList.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'player-pokemon-list',

        components: {
            PokemonList,
            BoxList
        },

        data() {
            return {
                listType: null,
                pokemonList: null,
                currentBoxIndex: null
            }
        },

        computed: {
            listTitle() {
                return this.isPC ? 'PC' : 'Party'
            },

            isPC() {
                return this.listType === 'pc'
            },

            boxList() {
                return Object.keys(this.pcPokemon)
            },

            currentBox() {
                return this.boxList[this.currentBoxIndex]
            },

            ...mapGetters([
                'partyPokemon',
                'pcPokemon',
                'getCaughtPokemon'
            ])
        },

        created() {
            this.updateAudio('pokemon-list.mp3')
            this.listType = this.$route.params.type
            this.setList()
        },

        methods: {
            setList() {
                this.pokemonList = []
                if (this.isPC)
                    this.setPCPokemonList()
                else
                    this.setPartyPokemonList()
            },

            setPokemonList(pokemonList) {
                const pokemonIdList = pokemonList.map(id => {
                    return {
                        caughtId: id,
                        ...this.getCaughtPokemon(id)
                    }
                })
                pokemonIdList.map(async (pokemon) => {
                    const pokemonDetails = await this.getPokemonById(pokemon.id)
                    this.pokemonList.push({
                        caughtId: pokemon.caughtId,
                        exp: pokemon.exp,
                        level: pokemonDetails.getLevel(pokemon.exp),
                        ...pokemonDetails
                    })
                })
            },

            setPartyPokemonList() {
                this.setPokemonList(this.partyPokemon)
            },

            setPCPokemonList() {
                this.currentBoxIndex = 0
                this.setPokemonList(this.pcPokemon[this.currentBox])
            },

            handleSelectPokemon(index) {
                const selectedPokemon = this.pokemonList[index]
                this.$router.push(`/pokemon/details/${this.listType}/${selectedPokemon.caughtId}`)
            },

            changeListOrder(data) {
                this.rearrangePlayerPokemon({
                    list: this.listType,
                    ...data
                })
                this.setList()
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'rearrangePlayerPokemon'
            ])
        },
    }
</script>