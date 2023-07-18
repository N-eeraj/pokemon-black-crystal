<template>
    <div id="moveset_container">

        <navigation-bar
            title="Moves"
            icon="back"
            @icon-event="$emit('closeMoveset')" />

        <div id="battle_moves_list">
            <template v-if="moveList.length">
                <move-card
                    v-for="(move, index) in moveList"
                    :move="move"
                    :key="index"
                    @click="$emit('useMove', move)" />
            </template>
            <move-card
                v-else
                :move="hit"
                @click="$emit('useMove', hit)" />
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import MoveCard from '@/js/components/MoveCard.vue'

    import { mapGetters } from 'vuex'


    export default {
        name: 'moves-list',

        components: {
            NavigationBar,
            MoveCard
        },

        data() {
            return {
                hit: {
                    "name": "hit",
                    "type": "normal",
                    "power": 5,
                    "pp": "∞",
                    "accuracy": 100,
                    "priority": 0,
                    "category": "damage",
                    "damageClass": "physical",
                    "healing": 0,
                    "min": null,
                    "max": null
                }
            }
        },

        computed: {
            moveList() {
                const trainer = this.battleData.trainer
                return trainer.partyList[trainer.currentPokemonIndex].movesList.filter(move => move.pp)
            },

            ...mapGetters([
                'battleData'
            ])
        },

        mounted() {
            this.$router.push({ hash: '#moves'})
        },

        beforeUnmount() {
            this.$router.replace({ hash: null })
        }
    }
</script>

<style lang="scss" src="@/styles/battle/movesList.scss"></style>