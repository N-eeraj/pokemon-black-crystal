<template>
    <div id="moveset_container">

        <navigation-bar
            title="Moves"
            icon="back"
            @icon-event="$emit('closeMoveset')" />

        <div id="moves_list">
            <div
                v-for="(move, index) in moveList"
                :key="index"
                class="move-card"
                @click="$emit('useMove', move)">

                <span>
                    {{ $filters.toTitleCase(move.name) }}
                </span>

                <span v-if="move.healing > 0">
                    Heal:
                    {{ move.healing }}%
                </span>
                <span v-else>
                    Power:
                    {{ move.power || 'KO' }}
                </span>

                <span>
                    PP:
                    {{ move.pp }}
                </span>

                <span>
                    Accuracy:
                    {{ move.accuracy }}%
                </span>

                <span>
                    Type:
                    {{ $filters.toTitleCase(move.type) }}
                    <type-icon :type="move.type" />
                </span>
                
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"
    import TypeIcon from '@/js/components/TypeIcon.vue'

    import { mapGetters } from 'vuex'


    export default {
        name: 'moves-list',

        components: {
            NavigationBar,
            TypeIcon
        },

        computed: {
            moveList() {
                const trainer = this.getBattleData.trainer
                return trainer.partyList[trainer.currentPokemonIndex].movesList.filter(move => move.pp)
            },

            ...mapGetters([
                'getBattleData'
            ]),
        }
    }
</script>

<style lang="scss" src="@/styles/battle/movesList.scss"></style>