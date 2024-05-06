<template>
    <div>
        <canvas ref="canvasElement" />

        <div class="button-group">
            <div />
            <button
                :disabled="player.direction && player.direction !== 'up'"
                @mousedown="player.direction = 'up'"
                @touchstart="player.direction = 'up'"
                @mouseup="player.direction = null"
                @touchend="player.direction = null">
                &uarr;
            </button>
            <div />
            <button
                :disabled="player.direction && player.direction !== 'left'"
                @mousedown="player.direction = 'left'"
                @touchstart="player.direction = 'left'"
                @mouseup="player.direction = null"
                @touchend="player.direction = null">
                &larr;
            </button>
            <button
                :disabled="player.direction && player.direction !== 'down'"
                @mousedown="player.direction = 'down'"
                @touchstart="player.direction = 'down'"
                @mouseup="player.direction = null"
                @touchend="player.direction = null">
                &darr;
            </button>
            <button
                :disabled="player.direction && player.direction !== 'right'"
                @mousedown="player.direction = 'right'"
                @touchstart="player.direction = 'right'"
                @mouseup="player.direction = null"
                @touchend="player.direction = null">
                &rarr;
            </button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'safari-zone',

        data() {
            return {
                canvasElement: null,
                ctx: null,
                game: {
                    size: null,
                },
                player: {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    size: 0,
                    direction: null
                },
                tallGrasses: []
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
            const canvas = this.$refs.canvasElement
            const { clientWidth, clientHeight } = document.getElementById('main')
            this.game.size = {
                width: clientWidth,
                height: clientHeight
            }
            canvas.width = clientWidth
            canvas.height = clientHeight
            this.ctx = canvas.getContext('2d')
            this.player.size = clientWidth / 8
            this.player.position.x = (clientWidth - this.player.size) / 2
            this.player.position.y = (clientHeight - this.player.size) / 2

            const animate = () => {
                this.draw()
                requestAnimationFrame(animate)
            }

            animate()
            document.addEventListener('keydown', this.handleKeyboard)
            document.addEventListener('keyup', () => this.player.direction = null)
        },

        methods: {
            handleKeyboard({ key }) {
                switch (key.toLowerCase()) {
                    case 'w':
                    case 'arrowup':
                        this.player.direction = 'up'
                        break
                    case 'a':
                    case 'arrowleft':
                        this.player.direction = 'left'
                        break
                    case 's':
                    case 'arrowdown':
                        this.player.direction = 'down'
                        break
                    case 'd':
                    case 'arrowright':
                        this.player.direction = 'right'
                        break
                }
            },

            drawPlayer() {
                this.ctx.fillStyle = 'black'
                switch (this.player.direction) {
                    case 'up':
                        this.player.position.y -= 3
                        break
                    case 'left':
                        this.player.position.x -= 3
                        break
                    case 'down':
                        this.player.position.y += 3
                        break
                    case 'right':
                        this.player.position.x += 3
                        break
                }
                if (this.player.position.y < 10)
                    this.player.position.y = 10
                else if (this.player.position.y + this.player.size > this.game.size.height - 10)
                    this.player.position.y = this.game.size.height - this.player.size - 10
                if (this.player.position.x < 10)
                    this.player.position.x = 10
                else if (this.player.position.x + this.player.size > this.game.size.width - 10)
                    this.player.position.x = this.game.size.width - this.player.size - 10
                this.ctx.fillRect(this.player.position.x, this.player.position.y, this.player.size, this.player.size)
            },

            draw() {
                this.ctx.clearRect(0, 0, this.game.size.width, this.game.size.height)
                this.ctx.fillStyle = '#78c9a6'
                this.ctx.fillRect(0, 0, this.game.size.width, this.game.size.height)
                this.drawPlayer()
            }
        },

        beforeUnmount() {
            document.removeEventListener('keydown', () => {})
            document.removeEventListener('keyup', () => {})
            window.onbeforeunload = null
        },
    }
</script>

<style lang="scss" scoped src="@/styles/modes/expolration/safari-zone.scss"></style>