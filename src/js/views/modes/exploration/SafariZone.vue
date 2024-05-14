<template>
    <div>
        <common-loader v-if="loading" />

        <div v-else>
            <canvas ref="canvasElement" />

            <div
                ref="controlsElement"
                class="controls-container">

                <img
                    src="@/assets/icons/escape.svg"
                    class="exit"
                    @click="confirmExit" />

                <div class="button-group">
                    <div />
                    <button
                        :disabled="player.direction && player.direction !== 'up'"
                        @mousedown="player.direction = 'up'"
                        @touchstart="player.direction = 'up'"
                        @mouseup="resetPlayerDirection"
                        @touchend="resetPlayerDirection">
                        &uarr;
                    </button>
                    <div />
                    <button
                        :disabled="player.direction && player.direction !== 'left'"
                        @mousedown="player.direction = 'left'"
                        @touchstart="player.direction = 'left'"
                        @mouseup="resetPlayerDirection"
                        @touchend="resetPlayerDirection">
                        &larr;
                    </button>
                    <button
                        :disabled="player.direction && player.direction !== 'down'"
                        @mousedown="player.direction = 'down'"
                        @touchstart="player.direction = 'down'"
                        @mouseup="resetPlayerDirection"
                        @touchend="resetPlayerDirection">
                        &darr;
                    </button>
                    <button
                        :disabled="player.direction && player.direction !== 'right'"
                        @mousedown="player.direction = 'right'"
                        @touchstart="player.direction = 'right'"
                        @mouseup="resetPlayerDirection"
                        @touchend="resetPlayerDirection">
                        &rarr;
                    </button>
                </div>

                <span
                    class="help"
                    @click="showHelp">
                    ?
                </span>
            </div>
        </div>

        <pop-up
            :show="modal.show"
            :close="modal.hash === 'exit'"
            prevent-redirect
            :hash="modal.hash"
            class="modal"
            @close-pop-up="closeModal">
            <template #body>
                <p>
                    {{ modal.body }}
                </p>
            </template>
            <template #actions>
                <button
                    class="confirm"
                    @click="modal.action">
                    {{ modal.hash === 'exit' ? 'Exit' : 'OK' }}
                </button>
            </template>
        </pop-up>


        <battle-scene
            v-if="game.pokemon"
            :player-party="partyPokemonData"
            :foe-party="[game.pokemon]"
            save-battle
            can-catch
            can-escape
            @escape="game.pokemon = null"
            @caught-pokemon="handleCaughtPokemon"
            @game-over="game.pokemon = null" />

        <div class="sprites">
            <img
                ref="playerImage"
                :src="playerSprite" />
            <img
                ref="tallGrassImage"
                src="@/assets/images/safari-zone/tall-grass.png" />
        </div>
    </div>
</template>

<script>
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import BattleScene from '@/js/components/battle/scene/BattleScene.vue'
    import PopUp from '@/js/components/UI/PopUp.vue'

    import { mapState, mapGetters, mapActions } from 'vuex'

    import { getInRange } from '@/js/mixins/randomGenerator'
    import { clamp } from '@/js/mixins/common'

    export default {
        name: 'safari-zone',

        components: {
            CommonLoader,
            BattleScene,
            PopUp
        },

        data() {
            return {
                animation: null,
                loading: false,
                pokemon: null,
                canvasElement: null,
                controlsElement: null,
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
                    frame: {
                        x: 0,
                        y: 0,
                    },
                    size: {
                        x: 36,
                        y: 52
                    },
                    direction: null
                },
                tallGrasses: [],
                playerImage: null,
                tallGrassImage: null,
                modal: {
                    show: false,
                    hash: null,
                    body: '',
                    action: null
                },
                debug: false
            }
        },

        computed: {
            playerSprite() {
                return require(`@/assets/images/safari-zone/${this.playerInfo.avatar < 2 ? 'red' : 'leaf'}-sprite.svg`)
            },

            ...mapState([
                'safariZoneTicket'
            ]),
            ...mapGetters([
                'partyPokemonData',
                'strongestPokemon',
                'playerInfo'
            ])
        },

        watch: {
            'game.pokemon'(pokemon) {
                if (pokemon) return
                if (this.tallGrasses.every(({ pokemon }) => !pokemon)) {
                    this.modal = {
                        show: true,
                        body: 'You have found all the Pokémon in the Safari Zone now. Please visit again later',
                        action: () => {
                            this.exitSafariZone()
                            cancelAnimationFrame(this.animation)
                        }
                    }
                }
            },

            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (!toHash && (fromHash === '#exit' || fromHash === '#help'))
                        this.closeModal()
                }
            }
        },

        created() {
            if (!(this.safariZoneTicket || this.debug))
                return this.$router.push('/mode/exploration')
            window.onbeforeunload = () => true
        },

        mounted() {
            this.updateAudio('wild.mp3')
            this.getPokemon()
        },

        methods: {
            async getPokemon() {
                this.loading = true
                const pokemonList = await this.getRandomPokemon({
                    count: 10,
                    includeLegendary: false
                })

                const strongestPokemonExp = getInRange(this.strongestPokemon.exp * 0.2, this.strongestPokemon.exp * 0.6)
                
                this.pokemon = pokemonList.map(pokemon => {
                    const minExp = pokemon.getExpByLevel(3)
                    const maxExp = pokemon.getExpByLevel(50)
                    return {
                        pokemon: pokemon.id,
                        exp: clamp(minExp, strongestPokemonExp, maxExp)
                    }
                })
                this.loading = false
                this.$nextTick(this.initZone)
            },

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
                const canvas = this.$refs.canvasElement
                const controls = this.$refs.controlsElement
                const { clientWidth, clientHeight } = document.getElementById('main')

                this.game.tile = clientWidth / 8
                this.game.size = {
                    width: this.game.tile * 8,
                    height: this.game.tile * 12
                }
                canvas.width = this.game.size.width
                canvas.height = this.game.size.height
                controls.style.height = `${clientHeight - canvas.height}px`
                this.ctx = canvas.getContext('2d')

                let lastTime = 0
                const animate = (timestamp) => {
                    let deltaTime = timestamp - lastTime
                    if (deltaTime > 60) {
                        lastTime = timestamp
                        if (!this.game.pokemon)
                            this.draw()
                    }
                    this.animation = requestAnimationFrame(animate)
                }

                animate(0)
                document.addEventListener('keydown', this.handleKeyboard)
                document.addEventListener('keyup', this.resetPlayerDirection)

                this.player.position.x = (this.game.size.width - this.game.tile) * 0.5
                this.player.position.y = (this.game.size.height - this.game.tile) * 0.5

                for (let i = 0; i < 72; i++) {
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

                    const pokemon = Math.random() > 0.8 && this.pokemon.length ? this.pokemon.splice(Math.floor(Math.random() * this.pokemon.length), 1)[0] : null
                    this.tallGrasses.push({
                        x,
                        y,
                        pokemon
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

            resetPlayerDirection() {
                this.player.direction = null
            },

            drawPlayer() {
                switch (this.player.direction) {
                    case 'up':
                        this.player.frame.y = 3
                        this.player.frame.x++
                        this.player.position.y -= 5
                        break
                    case 'left':
                        this.player.frame.y = 1
                        this.player.frame.x++
                        this.player.position.x -= 5
                        break
                    case 'down':
                        this.player.frame.y = 0
                        this.player.frame.x++
                        this.player.position.y += 5
                        break
                    case 'right':
                        this.player.frame.y = 2
                        this.player.frame.x++
                        this.player.position.x += 5
                        break
                }
                if (this.player.frame.x === 4 || !this.player.direction)
                    this.player.frame.x = 0
                if (this.player.position.y < 0)
                    this.player.position.y = 0
                else if (this.player.position.y + this.player.size.y > this.game.size.height)
                    this.player.position.y = this.game.size.height - this.player.size.y
                if (this.player.position.x < 0)
                    this.player.position.x = 0
                else if (this.player.position.x + this.player.size.x > this.game.size.width)
                    this.player.position.x = this.game.size.width - this.player.size.x
                this.ctx.drawImage(this.$refs.playerImage, this.player.frame.x * this.player.size.x, this.player.frame.y * this.player.size.y, this.player.size.x, this.player.size.y, this.player.position.x, this.player.position.y, this.player.size.x, this.player.size.y)

                if (!this.debug) return
                this.ctx.strokeStyle = 'blue'
                this.ctx.strokeRect(this.player.position.x, this.player.position.y, this.player.size.x, this.player.size.y)
            },

            drawGrasses() {
                for (let index = 0; index < this.tallGrasses.length; index++) {
                    let { x, y, pokemon } = this.tallGrasses[index]
                    if (this.grassIntersection(x, y)) {
                        if (pokemon) {
                            this.player.position.x = (this.game.size.width - this.game.tile) * 0.5
                            this.player.position.y = (this.game.size.height - this.game.tile) * 0.5
                            this.tallGrasses[index].pokemon = null
                            this.encounterNewPokemon()
                            this.game.pokemon = pokemon
                            break
                        }
                    }
                    this.ctx.drawImage(this.$refs.tallGrassImage, x * this.game.tile, y * this.game.tile, this.game.tile, this.game.tile)
                }

                if (!this.debug) return
                this.tallGrasses.forEach(({ x, y, pokemon }) => {
                    if (pokemon) {
                        this.ctx.strokeStyle = this.grassIntersection(x, y) ? 'red' : 'black'
                        this.ctx.strokeRect(x * this.game.tile, y * this.game.tile, this.game.tile, this.game.tile)
                    }
                })
            },

            drawOverlappingGrasses() {
                this.tallGrasses.forEach(({ x, y }) => {
                    if (this.grassIntersection(x, y)) {
                        const playerYEnd = this.player.position.y + this.player.size.y
                        if (playerYEnd > (y + 0.6) * this.game.tile && playerYEnd < (y + 1) * this.game.tile) {
                            const { width, height } = this.$refs.tallGrassImage
                            this.ctx.drawImage(this.$refs.tallGrassImage, 0, height * 0.6, width, height * 0.4, x * this.game.tile, (y + 0.6) * this.game.tile, this.game.tile, this.game.tile * 0.4)
                        }
                    }
                })
            },

            draw() {
                this.ctx.clearRect(0, 0, this.game.size.width, this.game.size.height)
                this.ctx.fillStyle = '#78c9a6'
                this.ctx.fillRect(0, 0, this.game.size.width, this.game.size.height)
                this.drawGrasses()
                this.drawPlayer()
                this.drawOverlappingGrasses()
            },

            handleCaughtPokemon() {
                this.addCaughtPokemon(this.game.pokemon)
                this.game.pokemon = null
                this.setBattleData(null)
            },

            closeModal() {
                this.modal = {
                    show: false,
                    hash: null,
                    body: '',
                    action: null
                }
            },

            exitSafariZone() {
                this.$router.push('/mode/exploration')
            },

            confirmExit() {
                this.modal = {
                    show: true,
                    hash: 'exit',
                    body: `Are you sure you want to exit? There are ${this.tallGrasses.filter(({ pokemon }) => pokemon).length} Pokémon left for you to find`,
                    action: this.exitSafariZone
                }
            },

            showHelp() {
                this.modal = {
                    show: true,
                    hash: 'help',
                    body: 'Safari Zone is a special region where you can encounter various Pokémon. Use the keys to walk through the tall grass and find the Pokémon',
                    action: this.closeModal
                }
            },

            ...mapActions([
                'getRandomPokemon',
                'addCaughtPokemon',
                'encounterNewPokemon',
                'setBattleData',
                'updateSafariZoneEntry',
                'updateAudio'
            ])
        },

        beforeUnmount() {
            document.removeEventListener('keydown', () => {})
            document.removeEventListener('keyup', () => {})
            window.onbeforeunload = null
            cancelAnimationFrame(this.animation)
            this.updateSafariZoneEntry(false)
        },
    }
</script>

<style lang="scss" scoped src="@/styles/modes/expolration/safari-zone.scss"></style>