<template>
    <div id="battle_scene">

        <common-loader v-if="loading" />

        <template v-else>
            <div class="battle-field">

                <img
                    v-if="canEscape && !battleMessage && !show.pokeballs"
                    :src="require(`@/assets/icons/escape.svg`)"
                    class="icon escape"
                    @click="confirmEscape" />

                <img
                    v-if="showPokeballAction && !battleMessage"
                    :src="require(`@/assets/icons/${ show.pokeballs ? 'cross-mark' : 'pokeball' }.svg`)"
                    class="icon pokeball"
                    :class="{ close : show.pokeballs }"
                    @click="togglePokeballs" />

                <doughnut-chart
                    v-if="isMultiplayer && pvp.countdown"
                    :value="Math.floor(pvp.countdown / 60 * 100)"
                    class="icon pvp-countdown">
                    <template #value>
                        {{ pvp.countdown }}
                    </template>
                </doughnut-chart>

                <battle-pokemon
                    v-if="currentPokemon.foe"
                    :pokemon="currentPokemon.foe"
                    isFoe
                    :can-catch="canCatch"
                    :catch-status="catchStatus"
                    :party-size="foeParty.length" />
                <div v-else></div> <!-- to leave space for foe -->
                <battle-pokemon
                    v-if="currentPokemon.trainer"
                    :pokemon="currentPokemon.trainer"
                    :party-size="playerParty.length" />
            </div>
        </template>

        <div
            v-if="battleMessage"
            class="battle-message">
            {{ battleMessage }}
        </div>

        <div
            v-else-if="show.pokeballs"
            class="pokeballs-list">            
            <div
                v-for="([id, ball]) in Object.entries(availablePokeballs)"
                :key="id"
                class="pokeball-container"
                @click="useBall(id, ball)">
                <img
                    :src="require(`@/assets/images/items${ball.image}`)"
                    :alt="ball.name"
                    class="item-image" />
                <span class="count">
                    {{ ball.count }}
                </span>
            </div>
        </div>

        <div
            v-else-if="!isMultiplayer || pvp.countdown"
            class="actions">
            <button
                class="moves"
                @click="listPokemonMoves">
                Moves
            </button>
            <button
                class="pokemon"
                @click="listPartyPokemon">
                Pokémon
            </button>
        </div>

        <moves-list
            v-if="show.moveset && battleData"
            @use-move="useMove"
            @close-moveset="hidePokemonMoves" />

        <pokemon-list
            v-if="show.party && battleData"
            :list="this.battleData.trainer.partyList"
            title="Pokémon"
            icon="cross-mark"
            show-hp
            rearrangeable
            closable
            @nav-icon-action="hidePartyPokemon"
            @selected-pokemon="changeCurrentPokemon"
            @rearrange-pokemon="changePartyOrder" />

        <pop-up
            :show="modal.confirmEscape"
            close
            prevent-redirect
            hash="escape"
            class="modal"
            @close-pop-up="closePopUp('confirmEscape')">
            <template #body>
                <div class="escape-confirmation">
                    <p>
                        Are you sure you want to escape this battle?
                    </p>
                </div>
            </template>
            <template #actions>
                <button
                    class="confirm"
                    @click="escape">
                    Yes
                </button>
            </template>
        </pop-up>
    </div>
</template>

<script>

    import PopUp from '@/js/components/UI/PopUp.vue'
    import BattlePokemon from '@/js/components/battle/scene/BattlePokemon.vue'
    import MovesList from '@/js/components/battle/MovesList.vue'
    import PokemonList from '@/js/components/PokemonList.vue'
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'
    import DoughnutChart from '@/js/components/UI/DoughnutChart.vue'

    import { mapGetters, mapActions } from 'vuex'

    import { getRandomMove, checkMoveAccuracy, getInRange } from '@/js/mixins/randomGenerator'
    import { getCaptureRate } from '@/js/mixins/calculations'
    import { changePokemon, moveMessage, missedMove, faintMessage, useItem, caughtPokemon, pokemonBrokeFree } from '@/js/mixins/messages'

    import items from "@/assets/data/items"

    export default {
        name: 'battle-scene',

        components: {
            PopUp,
            BattlePokemon,
            MovesList,
            PokemonList,
            DoughnutChart,
            CommonLoader
        },

        props: {
            playerParty: {
                type: Object,
                required: true
            },
            foeParty: {
                type: Object,
                required: true
            },
            saveBattle: {
                type: Boolean,
                required: false,
                default: false
            },
            canCatch: {
                type: Boolean,
                required: false,
                default: false
            },
            canEscape: {
                type: Boolean,
                required: false,
                default: false
            },
            isMultiplayer: {
                type: Boolean,
                required: false,
                default: false
            },
            turnAction: {
                type: Object,
                required: false
            }
        },

        data() {
            return {
                battle: {
                    trainer: {
                        partyList: [],
                        currentPokemonIndex: 0
                    },
                    foe: {
                        partyList: [],
                        currentPokemonIndex: 0
                    }
                },
                show: {
                    moveset: false,
                    party: false,
                    pokeballs: false
                },
                modal: {
                    confirmEscape: false
                },
                battleMessage: null,
                messageSpeed: 3200,
                catchStatus: {
                    ballUsed: null,
                    caught: false
                },
                loading: true,
                pvp: {
                    countdown: null,
                    countdownInterval: null
                }
            }
        },

        computed: {
            showPokeballAction() {
                return Boolean(this.canCatch && Object.keys(this.availablePokeballs || {}).length)
            },

            availablePokeballs() {
                const availableBalls = {}
                Object.entries(this.getAvailableBalls).forEach(([id, count]) => {
                    const { name, image } = items.find(item => item.id == id)
                    availableBalls[id] = {
                        count,
                        name,
                        image
                    }
                })
                return availableBalls
            },

            currentPokemon() {
                return {
                    foe: this.battleData?.foe.partyList[this.battleData.foe.currentPokemonIndex],
                    trainer: this.battleData?.trainer.partyList[this.battleData.trainer.currentPokemonIndex]
                }
            },
            
            ...mapGetters([
                'getMovesByName',
                'getAvailableBalls',
                'battleData'
            ]),
        },

        watch: {
            turnAction: {
                deep: true,
                handler(action) {
                    if (!this.isMultiplayer) return
                    const { client, peer } = action

                    if (peer?.action === 'reArrangePokemon') 
                        return this.changeFoePartyOrder(peer.positions)

                    if (client && peer)
                        this.handlePVPTurn(action)
                }
            },

            $route: {
                deep: true,
                handler({ hash: toHash }, { hash: fromHash }) {
                    if (toHash) return
                    switch (fromHash) {
                        case '#moves':
                            this.hidePokemonMoves()
                            break
                        case '#pokemon':
                            this.hidePartyPokemon()
                            break
                        case '#pokeballs':
                            this.hidePokeballs()
                            break
                        case '#escape':
                            this.closePopUp('confirmEscape')
                            break
                    }
                }
            }
        },

        async created() {
            await this.setBattleParty(this.playerParty, 'trainer')
            await this.setBattleParty(this.foeParty, 'foe')
            this.setBattleData(this.battle)
            this.loading = false
            window.onbeforeunload = () => true
        },

        mounted() {
            this.updateAudio('battle.mp3')
            if (!this.isMultiplayer) return
            this.startCountdown()
        },

        beforeUnmount() {
            window.onbeforeunload = null
        },

        methods: {
            async getPokemonDetails(pokemon, user = 'trainer') {
                let data = await this.getPokemonById(pokemon.pokemon)
                data.level = data.getLevel(pokemon.exp)
                data.movesList = data.getMovesByLevel(pokemon.exp)
                    .map(move => {
                        return {
                            name: move.name,
                            ...this.getMovesByName(move.name)
                        }
                    })
                data.stat = data.getStat(pokemon.exp)
                data.currentHp = data.stat.hp
                if (this.saveBattle) {
                    data.expGained = data.getExpGained(this.canCatch, user, pokemon.exp)
                    if (user === 'trainer') {data.encounterId = pokemon.encounterId}
                }
                return data
            },

            async setBattleParty(partyIds, user) {
                await partyIds.forEach(async (pokemon, index) => {
                    this.battle[user].partyList[index] = await this.getPokemonDetails(pokemon, user)
                })
            },

            listPokemonMoves() {
                this.show.moveset = true
            },

            hidePokemonMoves() {
                if (this.$route.hash)
                    this.$router.back()
                this.show.moveset = false
            },

            listPartyPokemon() {
                this.show.party = true
            },

            hidePartyPokemon() {
                if (this.$route.hash)
                    this.$router.back()
                this.show.party = false
            },

            showPokeballs() {
                this.show.pokeballs = true
                this.$router.push({ hash: '#pokeballs' })
            },

            hidePokeballs() {
                if (this.$route.hash)
                    this.$router.back()
                this.show.pokeballs = false
                // this.$router.replace({ hash: null })
            },

            togglePokeballs() {
                if (this.show.pokeballs)
                    this.hidePokeballs()
                else
                    this.showPokeballs()
            },

            closePopUp(popUpName) {
                if (this.$route.hash)
                    this.$router.back()
                this.modal[popUpName] = false
            },

            confirmEscape() {
                this.modal.confirmEscape = true
            },

            escape() {
                this.closePopUp('confirmEscape')
                this.$emit('escape')
            },

            changeFoePartyOrder({ currentIndex, newIndex }) {
                this.reArrangePartyPokemon({
                    currentIndex,
                    newIndex,
                    isOpponent: true
                })
                this.$emit('resetPeerActions')
            },

            changePartyOrder({ currentIndex, newIndex }) {
                this.reArrangePartyPokemon({
                    currentIndex,
                    newIndex,
                    isOpponent: false
                })
                if (this.isMultiplayer)
                    this.handlePVPEvent('reArrangePokemon', { currentIndex, newIndex })
            },

            changeCurrentFoePokemon(newIndex) {
                this.switchBattlePokemon({
                    newIndex,
                    isOpponent: true
                })
            },

            setBattleMessage(message, start=true) {
                if (start)
                    this.battleMessage = ''
                let counter = 0
                if (counter === message?.length || !message) return
                setTimeout(() => {
                    this.battleMessage += message[counter++]
                    this.setBattleMessage(message.slice(1), false)
                }, 50)
            },

            changeCurrentPokemon(newIndex) {
                if (newIndex === this.battleData.trainer.currentPokemonIndex) return
                this.switchBattlePokemon({
                    newIndex,
                    isOpponent: false
                })
                this.hidePartyPokemon()
                this.setBattleMessage(changePokemon(false))
                if (this.isMultiplayer)
                    return this.handlePVPEvent('changePokemon', newIndex)
                setTimeout(() => {
                    this.useMove(null)
                }, this.messageSpeed)
            },

            handleCapture() {
                this.setBattleMessage(caughtPokemon(this.currentPokemon.foe))
                this.catchStatus.caught = true
                setTimeout(() => {
                    this.$emit('caughtPokemon')
                }, this.messageSpeed)
            },

            useBall(itemId, item) {
                this.updateBag({
                    count: -1,
                    itemId
                })
                this.hidePokeballs()
                this.setBattleMessage(useItem(item.name))
                this.catchStatus.ballUsed = itemId

                const captureRate = getCaptureRate(this.currentPokemon.foe, itemId)
                setTimeout(() => {
                    if (captureRate) this.handleCapture()
                    else {
                        this.setBattleMessage(pokemonBrokeFree(this.currentPokemon.foe))
                        this.catchStatus.ballUsed = null
                        setTimeout(() => {
                            this.useMove(null)
                        }, this.messageSpeed)
                    }
                }, this.messageSpeed + 1000)
            },

            manipulateMoveData(moveData) {
                return {
                    contact: checkMoveAccuracy(moveData),
                    randomFactor: {
                        speed: Math.random(),
                        damage: Math.random() * 0.2 + 0.8
                    },
                    times: getInRange(moveData.min, moveData.max) || 1,
                    ...moveData
                }
            },

            useMove(moveData) {
                this.hidePokemonMoves()
                let trainerMove 
                if (moveData) 
                    trainerMove = this.manipulateMoveData(moveData)
                if (this.isMultiplayer)
                    return this.handlePVPEvent('useMove', trainerMove)
                const foeMove = this.manipulateMoveData(getRandomMove(this.currentPokemon.foe))
                this.performMove(trainerMove, foeMove)
            },

            performMove(moveData, foeMove) {
                const trainerMessage = moveMessage(this.currentPokemon.trainer, this.currentPokemon.foe, moveData, false)
                const foeMessage = moveMessage(this.currentPokemon.foe, this.currentPokemon.trainer, foeMove, true)

                let firstPokemon, firstMove, firstMoveMessage, secondPokemon, secondMove, secondMoveMessage
                if (this.canAttackFirst(moveData, foeMove)) {
                    // Sets the values of variable such that player makes the first move
                    firstPokemon = 'trainer'
                    firstMove = {
                        moveData,
                        inCommingAttack: false
                    }
                    firstMoveMessage = trainerMessage

                    secondPokemon = 'foe'
                    secondMove = {
                        moveData: foeMove,
                        inCommingAttack: true
                    }
                    secondMoveMessage = foeMessage
                }
                else {
                    // Sets the values of variable such that oppponent makes the first move
                    firstPokemon = 'foe'
                    firstMove = {
                        moveData: foeMove,
                        inCommingAttack: true
                    }
                    firstMoveMessage = foeMessage

                    secondPokemon = 'trainer'
                    secondMove = {
                        moveData,
                        inCommingAttack: false
                    }
                    secondMoveMessage = trainerMessage
                }

                // Make the first attack and display message
                if (firstMove.moveData && firstMove.moveData.contact) {
                    this.useMoveBattleDataUpdate(firstMove)
                    this.setBattleMessage(firstMoveMessage)
                }
                else if (firstMove.moveData && !firstMove.moveData?.contact) {
                    this.setBattleMessage(missedMove(this.currentPokemon[firstPokemon], firstPokemon === 'foe'))
                }

                if (this.currentPokemon[secondPokemon].currentHp > 0) {
                    // the Pokémon to make the second move doesn't faint
                    setTimeout(() => {
                        // Make the second attack and display message
                        if (secondMove.moveData && secondMove.moveData.contact) {
                            this.useMoveBattleDataUpdate(secondMove)
                            this.setBattleMessage(secondMoveMessage)
                        }
                        else if (secondMove.moveData && !secondMove.moveData?.contact) {
                            this.setBattleMessage(missedMove(this.currentPokemon[secondPokemon], secondPokemon === 'foe'))
                        }

                        setTimeout(() => {
                            // checks if the Pokémon that made the first attack faints
                            if (this.currentPokemon[firstPokemon].currentHp <= 0) {
                                this.setBattleMessage(faintMessage(this.currentPokemon[firstPokemon], firstPokemon === 'foe'))
                                this.handleFaint(firstPokemon)
                            }
                            if (this.currentPokemon[secondPokemon].currentHp <= 0) {
                                this.setBattleMessage(faintMessage(this.currentPokemon[secondPokemon], secondPokemon === 'foe'))
                                this.handleFaint(secondPokemon)
                            }
                            // if battle is not over reset battle message
                            if (!this.checkGameOver()) {
                                setTimeout(() => {
                                    this.setBattleMessage(null)
                                }, this.messageSpeed)
                            }
                        }, this.messageSpeed)
                    }, this.messageSpeed)
                }
                else {
                    setTimeout(() => {
                        // the Pokémon to make the second move faints
                        this.setBattleMessage(faintMessage(this.currentPokemon[secondPokemon], secondPokemon === 'foe'))
                        this.handleFaint(secondPokemon)
                        if (this.currentPokemon[firstPokemon].currentHp <= 0) {
                            this.setBattleMessage(faintMessage(this.currentPokemon[firstPokemon], firstPokemon === 'foe'))
                            this.handleFaint(firstPokemon)
                        }
                        // if battle is not over reset battle message
                        if (!this.checkGameOver()) {
                            setTimeout(() => {
                                this.setBattleMessage(null)
                            }, this.messageSpeed)
                        }
                    }, this.messageSpeed)
                }
            },

            canAttackFirst(trainerMove, foeMove) {
                if (!trainerMove) return false
                if (!foeMove) return false
                if (trainerMove.priority > foeMove.priority) return true
                if (trainerMove.priority < foeMove.priority) return false
                const { trainer, foe } = this.currentPokemon
                if (trainer.stat.speed > foe.stat.speed) return true
                if (trainer.stat.speed < foe.stat.speed) return false
                if (trainer.level > foe.level) return true
                if (trainer.level < foe.level) return false
                if (trainer.exp > foe.exp) return true
                if (trainer.exp < foe.exp) return false
                return trainerMove.randomFactor.speed > foeMove.randomFactor.speed
            },

            handleFaint(user) {
                this.pokemonFaintedBattleDataUpdate(user)
            },

            handlePVPTurn({ client, peer }) {
                if (peer.action === 'changePokemon') {
                    this.changeCurrentFoePokemon(peer.index)
                    this.setBattleMessage(changePokemon(true))
                }

                setTimeout(() => {
                    this.performMove(client.moveData, peer.moveData)
                    this.$emit('resetActions')
                    this.startCountdown()
                }, this.messageSpeed)
            },

            handlePVPEvent(event, data) {
                if (event !== 'reArrangePokemon') {
                    clearInterval(this.pvp.countdownInterval)
                    this.pvp.countdown = 0
                }
                this.$emit(event, data)
            },

            startCountdown() {
                if (this.pvp.countdownInterval)
                    clearInterval(this.pvp.countdownInterval)
                this.pvp.countdown = 60
                this.pvp.countdownInterval = setInterval(() => this.handlePVPInterval(), 1000)
            },

            skipTurn() {
                clearInterval(this.pvp.countdownInterval)
                this.useMove(null)
                this.startCountdown
            },

            handlePVPInterval() {
                if (--this.pvp.countdown) return
                this.skipTurn()
            },

            checkGameOver() {
                const trainerParty = this.battleData.trainer.partyList.length
                const foeParty = this.battleData.foe.partyList.length
                if (trainerParty && foeParty) return false
                if (!trainerParty) this.blackOut()
                else if (!foeParty) this.victory()
                if (this.saveBattle) {
                    let totalExpGained = 0
                    this.battleData.faintedPokemon.forEach(({encounterId, exp}) => {
                        if (encounterId) {
                            return this.updatePokemonHappiness({
                                id: encounterId,
                                happiness: -5
                            })
                        }
                        totalExpGained += exp
                    })
                    this.gainExperience({
                        totalExp: totalExpGained,
                        encounterIds: this.playerParty.map(pokemon => pokemon.encounterId)
                    })
                    this.playerParty.forEach(({encounterId}) => this.updatePokemonHappiness({
                        id: encounterId,
                        happiness: 1
                    }))
                    setTimeout(() => {
                        this.toggleEvolutionCheck()
                    }, 2 * this.messageSpeed);
                }
                return true
            },

            blackOut() {
                setTimeout(() => {
                    this.setBattleMessage('You have no usable Pokémon left.')
                    setTimeout(() => {
                        this.$emit('gameOver', false)
                    }, this.messageSpeed)
                }, this.messageSpeed)
            },

            victory() {
                setTimeout(() => {
                    this.setBattleMessage('You defeated your opponent.')
                    setTimeout(() => {
                        this.$emit('gameOver', true)
                    }, this.messageSpeed)
                }, this.messageSpeed)
            },

            ...mapActions([
                'updateAudio',
                'getPokemonById',
                'setBattleData',
                'reArrangePartyPokemon',
                'switchBattlePokemon',
                'useMoveBattleDataUpdate',
                'pokemonFaintedBattleDataUpdate',
                'updateBag',
                'gainExperience',
                'updatePokemonHappiness',
                'toggleEvolutionCheck'
            ])
        }
    }
</script>

<style lang="scss" src="@/styles/battle/scene.scss"></style>