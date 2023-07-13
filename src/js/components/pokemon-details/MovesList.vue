<template>
    <div id="pokemon_moves_list">
        <move-card
            v-for="(move, index) in movesList"
            :move="move"
            :key="index" />
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
            }
        },

        computed: {
            movesList() {
                return this.moves.map(move => {
                        return {
                            name: move.name,
                            ...this.getMovesByName(move.name)
                        }
                    })
            },

            ...mapGetters([
                'getMovesByName',
            ])
        }
    }
</script>