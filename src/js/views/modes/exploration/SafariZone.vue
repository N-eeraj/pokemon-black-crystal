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

        <div class="sprites">
            <img
                ref="tallGrassImage"
                src="@/assets/images/safari-zone/tall-grass.png" />
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
                    tile: 0,
                    pokemon: null
                },
                player: {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    direction: null
                },
                tallGrasses: [],
                tallGrassImage: null
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
            this.initZone()

            const animate = () => {
                this.draw()
                if (!this.game.pokemon)
                    requestAnimationFrame(animate)
            }

            animate()
            document.addEventListener('keydown', this.handleKeyboard)
            document.addEventListener('keyup', () => this.player.direction = null)
        },

        methods: {
            grassIntersection(x, y) {
                let grassLeft = x * this.game.tile
                let grassRight = (x + 1) * this.game.tile
                let grassUp = y * this.game.tile
                let grassDown = (y + 1) * this.game.tile
                const intersectionX = grassLeft <= this.player.position.x && grassRight >= this.player.position.x || grassLeft <= this.player.position.x + this.game.tile && grassRight >= this.player.position.x + this.game.tile
                const intersectionY = grassUp <= this.player.position.y && grassDown >= this.player.position.y || grassUp <= this.player.position.y + this.game.tile && grassDown >= this.player.position.y + this.game.tile
                return intersectionX && intersectionY
            },

            initZone() {
                this.game.tile = this.game.size.width / 8
                this.player.position.x = (this.game.size.width - this.game.tile) / 2
                this.player.position.y = (this.game.size.height - this.game.tile) / 2

                for (let i = 0; i < 80; i++) {
                    const setGrassPosition = () => {
                        let xPosition = Math.floor(Math.random() * this.game.size.width / this.game.tile)
                        let yPosition = Math.floor(Math.random() * this.game.size.height / this.game.tile)
                        
                        const playerOverlap = this.grassIntersection(xPosition, yPosition)
                        if (this.tallGrasses.some(({ x, y }) => x === xPosition && y === yPosition) || playerOverlap) {
                            return setGrassPosition()
                        }
                        else {
                            return [ xPosition, yPosition ]
                        }
                    }
                    const [ x, y ] = setGrassPosition()

                    this.tallGrasses.push({
                        x,
                        y,
                        pokemon: Math.random() > 0.8 ? 2 : null,
                    })
                }
            },

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
                else if (this.player.position.y + this.game.tile > this.game.size.height - 10)
                    this.player.position.y = this.game.size.height - this.game.tile - 10
                if (this.player.position.x < 10)
                    this.player.position.x = 10
                else if (this.player.position.x + this.game.tile > this.game.size.width - 10)
                    this.player.position.x = this.game.size.width - this.game.tile - 10
                this.ctx.fillStyle = 'black'
                this.ctx.fillRect(this.player.position.x, this.player.position.y, this.game.tile, this.game.tile)
            },

            drawTallGrasses() {
                const image = this.$refs.tallGrassImage
                this.tallGrasses.forEach(({ x, y, pokemon }) => {
                    if (this.grassIntersection(x, y))
                        this.game.pokemon = pokemon
                    this.ctx.drawImage(image, x * this.game.tile, y * this.game.tile, this.game.tile, this.game.tile)
                })
                // debug option
                this.tallGrasses.forEach(({ x, y, pokemon }) => {
                    if (pokemon) {
                        this.ctx.strokeStyle = this.grassIntersection(x, y) ? 'red' : 'black'
                        this.ctx.strokeRect(x * this.game.tile, y * this.game.tile, this.game.tile, this.game.tile)
                    }
                })
            },

            draw() {
                this.ctx.clearRect(0, 0, this.game.size.width, this.game.size.height)
                this.ctx.fillStyle = '#78c9a6'
                this.ctx.fillRect(0, 0, this.game.size.width, this.game.size.height)
                this.drawTallGrasses()
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