<template>
    <div>
        <canvas ref="canvas" />
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'safari-zone',

        data() {
            return {
                canvas: null,
                ctx: null
            }
        },

        computed: {
            ...mapState([
                'safariZoneTicket'
            ])
        },

        created() {
            if (!this.safariZoneTicket)
                return this.$router.push('/mode/exploration')
            window.onbeforeunload = () => true
        },

        mounted() {
            const canvas = this.$refs.canvas
            const { clientWidth, clientHeight } = document.getElementById('main')
            canvas.width = clientWidth
            canvas.height = clientHeight
            this.ctx = canvas.getContext('2d')
            this.ctx.fillStyle = '#78c9a6'
            this.ctx.fillRect(0, 0, canvas.width, canvas.height)
        },

        beforeUnmount() {
            window.onbeforeunload = null
        },
    }
</script>
