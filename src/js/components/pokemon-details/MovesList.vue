<template>
    <div id="pokemon_moves_list">
        <div class="scroller">
            <move-card
                v-for="(move, index) in movesList"
                :move="move"
                :key="index"
                class="move-card" />
        </div>
    </div>
</template>

<script>

    import MoveCard from '@/js/components/MoveCard.vue'
    import { mapGetters } from 'vuex'

    export default {
        name: 'moves-list',

        components: {
            MoveCard
        },

        props: {
            moves: {
                type: Array,
                required: true
            },
            level: {
                type: Number,
                required: true
            }
        },

        computed: {
            movesList() {
                const availableMoves = []
                this.moves.forEach(({name, level}) => {
                    if (level <= this.level)
                        availableMoves.push({
                            name: name,
                            ...this.getMovesByName(name)
                        })
                })
                return availableMoves
            },

            ...mapGetters([
                'getMovesByName',
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/pokemon-details/movesList.scss"></style>