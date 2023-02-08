<template>
    <div>
        <div id="trade_mode">

        <navigation-bar
            icon="cross-mark"
            class="nav-bar"
            :class="{ invert: !connected }"
            @iconEvent="$router.push('/')" />

            <trade-loader
                v-if="!connected"
                :loadingText="loadingText"
                :canInvite="!!(isHost && key)"
                @shareLink="inviteFriend" />

            <template v-else>
                <trade-pokemon
                    v-if="tradePokemon.client"
                    :client="tradePokemon.client"
                    :peer="tradePokemon.peer"
                    @acceptTrade="sendTradeConfirmation" />

                <pokemon-list
                    v-else
                    :list="party"
                    title="Select Trade Pokémon"
                    class="pokemon-list"
                    @selectedPokemon="selectPokemon" />

                <trade-chat
                    :messages="messages"
                    @send="sendMessage" />
            </template>

            <pop-up
                v-if="disconnectPopUp.show"
                close
                @close-pop-up="disconnectFromPeer">
                <template #body>
                    {{ disconnectPopUp.text }}
                </template>
            </pop-up>
        </div>
    </div>
</template>

<script>

    import TradeLoader from '@/js/components/screens/loading/TradeLoader.vue'
    import TradeChat from '@/js/components/trade/TradeChat.vue'
    import TradePokemon from '@/js/components/trade/TradePokemon.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import PokemonList from '@/js/components/PokemonList.vue'

    import { Peer } from 'peerjs'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'trade-mode',

        components: {
            TradeLoader,
            TradeChat,
            TradePokemon,
            NavigationBar,
            PopUp,
            PokemonList
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
                'getCaughtPokemon'
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
                }, 3000)
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
                try {
                    const shareData = {
                        title: 'Pokémon Black Crystal',
                        text: `${this.playerInfo.name} has invited you for a trade session in Pokémon Black Crystal.\n`,
                        url: `${basePath}${this.$route.fullPath}?key=${this.key}`
                    }
                    await navigator.share(shareData)
                } catch {
                    console.log('Share failed')
                }
            },

            handleDisconnect(message) {
                this.disconnectPopUp.show = true
                this.disconnectPopUp.text = message ? message : 'Connection with friend lost.'
            },

            async disconnectFromPeer() {
                await this.client.disconnect()
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

            handleTrade() {
                console.log('trade success')
            },

            ...mapActions([
                'getPokemonById'
            ])
        }
    }

</script>

<style lang="scss" src="@/styles/modes/trade/main.scss"></style>