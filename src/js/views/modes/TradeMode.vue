<template>
    <div>
        <button v-if="peer" @click="sendDataToPeer({})">Test</button>
    </div>
</template>

<script>

    import { Peer } from 'peerjs'

    export default {
        name: 'trade-mode',

        data() {
            return {
                client: null,
                peer: null
            }
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
                setTimeout(() => {
                    this.peer = this.client.connect(this.$route.query.key)
                    this.peer.on('data', data => this.handleDataFromPeer(data))
                }, 3000)
            },

            initializeHost() {
                this.client.on('open', key => {
                    this.$router.replace({
                        ...this.$route,
                        query: { key }
                    })
                })
                this.client.on('connection', (connection) => {
                    connection.on('open', () => this.peer = connection)
                    connection.on('data', data => this.handleDataFromPeer(data))
                })
            },

            sendDataToPeer(data) {
                this.peer.send(JSON.stringify(data))
            },

            handleDataFromPeer(data) {
                console.log(JSON.parse(data))
            }
        }
    }

</script>