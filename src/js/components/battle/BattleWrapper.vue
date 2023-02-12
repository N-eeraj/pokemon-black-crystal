<template>
    <battle-scene
        v-if="battle.ongoing"
        :player-party="playerParty"
        :foe-party="foeParty"
        :save-battle="saveBattle"
        :can-escape="canEscape"
        @escape="endBattle"
        @game-over="handleGameOver" />

    <div
        v-else
        id="battle_wrapper"
        :style="`background-image: url(${foeDetails.image})`">

        <img
            v-if="close"
            :src="require(`@/assets/icons/cross-mark.svg`)"
            class="close-icon"
            @click="emitClose" />

        <div class="overlay">
            <button 
                class="battle-btn"
                @click="startBattle">
                Battle
            </button>
            <p>
                {{ message }}
            </p>
        </div>

    </div>
</template>

<script>

    import BattleScene from "@/js/components/battle/scene/BattleScene.vue"

    import { mapActions } from 'vuex'

    export default {
        name: 'battle-wrapper',

        components: {
            BattleScene
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
            foeDetails: {
                type: Object,
                required: true
            },
            canEscape: {
                type: Boolean,
                required: false,
                default: false
            },
            close: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        data() {
            return {
                battle: {
                    ongoing: false,
                    victory: false
                }
            }
        },

        computed: {
            message() {
                return `${this.foeDetails.name} wants to battle`
            }
        },

        methods: {
            emitClose() {
                this.$emit('close')
            },

            startBattle() {
                this.battle.ongoing = true
                this.$emit('battleStarted')
            },

            endBattle(victory) {
                this.battle.ongoing = false
                this.$emit('completedMatch', victory)
            },

            handleGameOver(victory) {
                this.setBattleData(null)
                this.endBattle(victory)
            },

            ...mapActions([
                'setBattleData'
            ])
        },
    }
</script>

<style lang="scss" src="@/styles/battle/wrapper.scss"></style>