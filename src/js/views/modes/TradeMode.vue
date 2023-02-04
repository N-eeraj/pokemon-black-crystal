<template>
    <div>
        <div id="trade_mode">

            <trade-loader
                v-if="!connected"
                :loadingText="loadingText"
                @shareLink="inviteFriend"
                :canInvite="!!(isHost && key)" />

            <!-- <template v-else>
                <input v-model="test.send">
                <br>
                <button @click="sendDataToPeer({type: test, message: test.send})">Test</button>
                <br>
                {{ test.receive }}
            </template> -->

            <pokemon-list
                :list="party"
                title="Select Pokémon to trade"
                icon="cross-mark"
                @navIconAction="$router.push('/')"
                @selectedPokemon="selectPokemon" />

            <pop-up
                v-if="showDisconnectPopUp"
                close
                @close-pop-up="disconnectFromPeer">
                <template #body>
                    You have been disconnected.
                </template>
            </pop-up>
        </div>
    </div>
</template>

<script>

    import TradeLoader from '@/js/components/screens/loading/TradeLoader.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'
    import PokemonList from '@/js/components/PokemonList.vue'

    import { Peer } from 'peerjs'

    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'trade-mode',

        components: {
            TradeLoader,
            PopUp,
            PokemonList
        },

        data() {
            return {
                client: null,
                peer: null,
                isHost: null,
                connected: false,
                showDisconnectPopUp: false,
                party: [],
                test: {send: '', receive: ''}
            }
        },

        computed: {
            key() {
                return this.$route.query.key
            },

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

                if (this.key)
                    this.initializePeer()
                else this.initializeHost()
            },

            initializePeer() {
                this.isHost = false
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
                this.client.on('open', async key => {
                    this.$router.replace({
                        ...this.$route,
                        query: { key }
                    })
                })
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
                try {
                    const shareData = {
                        title: 'Pokémon Black Crystal',
                        text: `${this.playerInfo.name} has invited you for a trade session in Pokémon Black Crystal.\n`,
                        url: this.$route.fullPath
                    }
                    await navigator.share(shareData)
                } catch {
                    console.log('Share failed')
                }
            },

            handleDisconnect() {
                this.showDisconnectPopUp = true
            },

            async disconnectFromPeer() {
                await this.client.disconnect()
                this.$router.push('/')
            },

            sendDataToPeer(data) {
                this.peer.send(JSON.stringify(data))
            },

            handleDataFromPeer(data) {
                const { type, message } = JSON.parse(data)
                if (!type) return this.handleDisconnect()
                if (type === 'connection') this.connected = true
                this.test.receive = message
            },

            selectPokemon() {

            },

            ...mapActions([
                'getPokemonById'
            ])
        }
    }

</script>