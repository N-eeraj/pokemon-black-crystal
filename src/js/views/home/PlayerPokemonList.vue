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
            @click="showActions = false"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd">

            <box-list
                v-if="isPC"
                :current-box="currentBox"
                @change-box="handleBoxChange" />

            <template
                v-if="isPC"
                #nav-right-actions>
                <box-actions 
                    :show-actions="showActions"
                    :boxes="boxList"
                    :current-box="currentBox"
                    :pokemon-list="pokemonList"
                    @show-actions="showActions = true"
                    @rename="changeCurrentBox"
                    @delete="resetCurrentBox" />
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
                showActions: false,
                swipeHandler: {
                    x: null,
                    y: null
                }
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
            this.currentBoxIndex = 0
            this.setList()
        },

        methods: {
            setList() {
                this.isPC ? this.setPCPokemonList() : this.setPartyPokemonList()
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
                this.setPokemonList(this.pcPokemon[this.currentBox])
            },

            handleSelectPokemon(index) {
                const selectedPokemon = this.pokemonList[index]
                this.$router.push(`/pokemon/details/${this.listType}/${selectedPokemon.caughtId}`)
            },

            changeListOrder({ currentIndex, newIndex }) {
                const data = {
                    isParty: this.listType === 'party',
                    box: this.currentBox,
                    currentIndex,
                    newIndex
                }
                this.rearrangePlayerPokemon(data)
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
                this.setPCPokemonList()
            },

            changeCurrentBox(boxName) {
                this.currentBoxIndex = this.boxList.indexOf(boxName)
                this.setPCPokemonList()
            },

            resetCurrentBox() {
                this.currentBoxIndex = 0
                this.setPCPokemonList()
            },

            handleTouchStart({ changedTouches }) {
                if (!this.isPC) return
                const { clientX, clientY } = changedTouches[0]
                this.swipeHandler.x = clientX
                this.swipeHandler.y = clientY
            },

            handleTouchEnd({ changedTouches }) {
                if (!this.isPC) return
                const { clientX, clientY } = changedTouches[0]
                const swipeX = this.swipeHandler.x - clientX
                const swipeY = this.swipeHandler.y - clientY

                if (Math.abs(swipeY) < 50 && Math.abs(swipeX) > 100)
                    this.handleBoxChange(Math.sign(swipeX))
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'rearrangePlayerPokemon'
            ])
        },
    }
</script>