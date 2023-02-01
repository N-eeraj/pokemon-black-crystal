<template>
    <div>
        
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

                if (this.$route.query.key) {
                    setTimeout(() => {
                        this.peer = this.client.connect(this.$route.query.key)
                        this.peer.on('open', () => {
                            console.log('open')
                            this.peer.send('hi!')
                        })
                    }, 3000)
                }
                else {
                    this.client.on('open', key => {
                        this.$router.replace({
                            ...this.$route,
                            query: { key }
                        })
                    })
                    this.client.on('connection', (connection) => {
                        console.log('connected')
                        connection.on('data', (data) => {
                            console.log(data)
                        })
                        connection.on('open', () => {
                            connection.send('hello!')
                        })
                    })
                }
            }
        }
    }

</script>