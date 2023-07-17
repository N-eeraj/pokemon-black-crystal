<template>
    <div id="player_pokemon_list">
        <pokemon-list
            :list="pokemonList"
            :title="listTitle"
            icon="cross-mark"
            rearrangeable
            @nav-icon-action="$router.push('/')"
            @selected-pokemon="handleSelectPokemon"
            @rearrange-pokemon="changeListOrder"
            @click="showActions = false">

            <box-list
                v-if="isPC"
                :box="currentBox"
                @change-box="handleBoxChange" />

            <template
                v-if="isPC"
                #nav-right-actions>
                <box-actions 
                    :show-actions="showActions"
                    :boxes="boxList"
                    :current-box="currentBox"
                    @show-actions="showActions = true"
                    @renamed="changeCurrentBox" />
            </template>

        </pokemon-list>
    </div>
</template>

<script>

    import PokemonList from '@/js/components/PokemonList.vue'
    import BoxList from '@/js/components/pc-boxes/BoxList.vue'
    import BoxActions from '@/js/components/pc-boxes/BoxActions.vue'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'player-pokemon-list',

        components: {
            PokemonList,
            BoxList,
            BoxActions
        },

        data() {
            return {
                listType: null,
                pokemonList: null,
                currentBoxIndex: null,
                showActions: false
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
                return Object.keys(this.pcPokemon).sort()
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
                if (this.isPC)
                    this.setPCPokemonList()
                else
                    this.setPartyPokemonList()
            },

            setPokemonList(pokemonList) {
                this.pokemonList = []
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

            handleBoxChange(change) {
                const newIndex = this.currentBoxIndex + change
                if (newIndex === -1)
                    this.currentBoxIndex = this.boxList.length - 1
                else if (newIndex === this.boxList.length)
                    this.currentBoxIndex = 0
                else
                    this.currentBoxIndex = newIndex
                this.setPokemonList(this.pcPokemon[this.currentBox])
            },

            changeCurrentBox(boxName) {
                this.currentBoxIndex = this.boxList.indexOf(boxName)
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'rearrangePlayerPokemon'
            ])
        },
    }
</script>