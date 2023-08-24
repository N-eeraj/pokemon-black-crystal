<template>
    <div>
        <div id="trade_mode">

        <navigation-bar
            icon="cross-mark"
            class="nav-bar"
            :class="{ invert: !connected }"
            @icon-event="disconnectFromPeer" />

            <trade-loader
                v-if="!connected"
                :loading-text="loadingText"
                :can-invite="!!(isHost && key)"
                @share-link="inviteFriend" />

            <template v-else>
                <trade-pokemon-view
                    v-if="tradePokemon.client"
                    :client="tradePokemon.client"
                    :peer="tradePokemon.peer"
                    :show-accept="!accepted.client"
                    @accept-trade="sendTradeConfirmation" />

                <pokemon-list
                    v-else
                    :list="party"
                    title="Select Trade Pokémon"
                    class="pokemon-list"
                    @selected-pokemon="selectPokemon" />

                <trade-chat
                    :messages="messages"
                    @send="sendMessage" />
            </template>

            <pop-up
                :show="disconnectPopUp.show"
                close
                @close-pop-up="disconnectFromPeer">
                <template #body>
                    {{ disconnectPopUp.text }}
                </template>
            </pop-up>

            <evolution-pop-up
                v-if="triggerEvolution.trigger"
                :pokemon-list="triggerEvolution.pokemon"
                @completed-evolutions="disconnectFromPeer" />
        </div>
    </div>
</template>

<script>

    import TradeLoader from '@/js/components/screens/loading/TradeLoader.vue'
    import TradeChat from '@/js/components/trade/TradeChat.vue'
    import TradePokemonView from '@/js/components/trade/TradePokemonView.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import PokemonList from '@/js/components/PokemonList.vue'
    import EvolutionPopUp from '@/js/components/pop-up/EvolutionPopUp.vue'

    import { Peer } from 'peerjs'

    import { mapGetters, mapActions } from 'vuex'

    import { shareLink } from '@/js/mixins/invitation'

    export default {
        name: 'trade-mode',

        components: {
            TradeLoader,
            TradeChat,
            TradePokemonView,
            NavigationBar,
            PopUp,
            PokemonList,
            EvolutionPopUp
        },

        data() {
            return {
                client: null,
                peer: null,
                key: null,
                isHost: null,
                connected: false,
                disconnectPopUp: {
                    show: false,
                    text: null
                },
                party: [],
                messages: [],
                tradePokemon: {
                    client: null,
                    peer: null
                },
                accepted: {
                    client: false,
                    peer: false
                },
                triggerEvolution: {
                    trigger: false,
                    pokemon: null
                }
            }
        },

        computed: {
            loadingText() {
                if (this.key)
                    return 'Waiting to connect to a friend'
                return 'Loading'
            },

            ...mapGetters([
                'playerInfo',
                'partyPokemon',
                'getCaughtPokemon',
                'lastEncountered'
            ])
        },

        watch: {
            accepted: {
                deep: true,
                handler({ client, peer }) {
                    if (client && peer) this.handleTrade()
                }
            }
        },

        created() {
            this.updateAudio('trade.mp3')
            this.initalizePeer2PeerConnectionn()

            const pokemonList = this.partyPokemon.map(id => {
                return {
                    caughtId: id,
                    ...this.getCaughtPokemon(id)
                }
            })
            pokemonList.map(async (pokemon) => {
                const pokemonDetails = await this.getPokemonById(pokemon.id)
                this.party.push({
                    caughtId: pokemon.caughtId,
                    exp: pokemon.exp,
                    level: pokemonDetails.getLevel(pokemon.exp),
                    ...pokemonDetails
                })
            })
            window.onbeforeunload = () => true
        },

        beforeUnmount() {
            window.onbeforeunload = null
        },

        methods: {
            initalizePeer2PeerConnectionn() {
                this.client = new Peer()

                if (this.$route.query.key)
                    this.initializePeer()
                else this.initializeHost()
            },

            initializePeer() {
                this.isHost = false
                this.key = this.$route.query.key
                setTimeout(() => {
                    this.peer = this.client.connect(this.key)
                    this.peer.on('open', () => 
                        this.sendDataToPeer({
                            type: 'connection'
                        }))
                    this.peer.on('data', data => this.handleDataFromPeer(data))
                    this.peer.on('close', () => this.handleDisconnect())
                    this.peer.on('disconnected', () => this.handleDisconnect())
                    this.peer.on('error', () => this.handleDisconnect())
                }, 2000)
            },

            initializeHost() {
                this.isHost = true
                this.client.on('open', async key => this.key = key)
                this.client.on('connection', (connection) => {
                    connection.on('open', () => {
                        this.peer = connection
                        this.sendDataToPeer({
                            type: 'connection'
                        })
                    })
                    connection.on('data', data => this.handleDataFromPeer(data))
                    connection.on('close', () => this.handleDisconnect())
                    connection.on('disconnected', () => this.handleDisconnect())
                    connection.on('error', () => this.handleDisconnect())
                })
            },

            async inviteFriend() {
                const basePath = process.env.BASE_URL.slice(0, -1)
                const url = `${basePath}${this.$route.fullPath}?key=${this.key}`
                shareLink({
                    url,
                    text: `${this.playerInfo.name} has invited you for a trade session in Pokémon Black Crystal.\n`
                })
            },

            handleDisconnect(message) {
                if (this.accepted.client && this.accepted.peer) return
                this.disconnectPopUp.show = true
                this.disconnectPopUp.text = message ? message : 'Lost connection with friend.'
            },

            async disconnectFromPeer() {
                this.client.destroy()
                this.$router.push('/')
            },

            sendDataToPeer(data) {
                this.peer.send(JSON.stringify(data))
            },

            handleMessage(message, client) {
                this.messages.push({
                    client,
                    message
                })
            },

            handleDataFromPeer(data) {
                const { type, message, pokemon } = JSON.parse(data)
                switch (type) {
                    case 'connection':
                        this.connected = true
                        break
                    case 'message':
                        this.handleMessage(message, false)
                        break
                    case 'pokemon':
                        this.tradePokemon.peer = pokemon
                        this.cachePokemonById(pokemon.id)
                        break
                    case 'accept':
                        this.accepted.peer = true
                        break
                    default:
                        this.handleDisconnect()
                }
            },

            selectPokemon(index) {
                const pokemon = this.party[index]
                this.sendDataToPeer({
                    type: 'pokemon',
                    pokemon
                })
                this.tradePokemon.client = pokemon
            },

            sendMessage(message) {
                this.handleMessage(message, true)
                this.sendDataToPeer({
                    type: 'message',
                    message
                })
            },

            sendTradeConfirmation() {
                this.accepted.client = true
                this.sendDataToPeer({
                    type: 'accept'
                })
            },

            async checkTradeEvolution(pokemon) {
                const data = {
                    encounterId: this.lastEncountered,
                    exp: pokemon.exp,
                    happiness: pokemon.happiness,
                    ...await this.getPokemonById(pokemon.id)
                }
                let evolutionReadyPokemon
                const evolutionData = data.evolution
                if (evolutionData.trade.length)
                    evolutionReadyPokemon = {
                        data,
                        possibilities: evolutionData.trade
                    }
                if (!evolutionReadyPokemon) return
                this.triggerEvolution.trigger = true
                this.triggerEvolution.pokemon = [evolutionReadyPokemon]
            },

            handleTrade() {
                const { caughtId } = this.tradePokemon.client
                const { exp, ...peerPokemonDetails } = this.tradePokemon.peer
                this.encounterNewPokemon()
                this.releasePokemon({
                    list: 'party',
                    id: caughtId
                })
                this.addCaughtPokemon({
                    pokemon: peerPokemonDetails.id,
                    exp: exp
                })
                this.updateAchievement({
                    type: 'multiplayer',
                    item: 'trade'
                });
                [ this.tradePokemon.client, this.tradePokemon.peer ] = [ this.tradePokemon.peer, this.tradePokemon.client ]
                setTimeout(() => {
                    this.checkTradeEvolution(peerPokemonDetails)
                    this.disconnectPopUp.text = 'Completed trade.'                    
                    this.disconnectPopUp.show = true
                }, 2000)
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'encounterNewPokemon',
                'cachePokemonById',
                'releasePokemon',
                'addCaughtPokemon',
                'updateAchievement'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/trade/main.scss"></style>