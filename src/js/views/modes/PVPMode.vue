<template>
    <div>
        <div id="pvp_mode">

            <template v-if="!connected">
                <navigation-bar
                    icon="cross-mark"
                    class="nav-bar"
                    @iconEvent="disconnectFromPeer" />
                    
                <pvp-loader
                    :loading-text="loadingText"
                    :can-invite="!!(isHost && key)"
                    @shareLink="inviteFriend" />
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

    import PvpLoader from '@/js/components/screens/loading/PvpLoader.vue'
    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { Peer } from 'peerjs'

    import { mapGetters } from 'vuex'

    export default {
        name: 'pvp-mode',

        components: {
            PvpLoader,
            NavigationBar,
            PopUp
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
            ])
        },

        created() {
            this.initalizePeer2PeerConnectionn()
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
                try {
                    const shareData = {
                        title: 'Pokémon Black Crystal',
                        text: `${this.playerInfo.name} has invited you for a PVP Battle in Pokémon Black Crystal.\n`,
                        url: `${basePath}${this.$route.fullPath}?key=${this.key}`
                    }
                    await navigator.share(shareData)
                } catch {
                    console.log('Share failed')
                }
            },

            handleDisconnect(message) {
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

            handleDataFromPeer(data) {
                const { type } = JSON.parse(data)
                switch (type) {
                    case 'connection':
                        this.connected = true
                        break
                    default:
                        this.handleDisconnect()
                }
            },
        }
    }

</script>

<style lang="scss" src="@/styles/modes/pvp/main.scss"></style>