<template>
    <div id="moveset_container">

        <navigation-bar
            title="Moves"
            icon="back"
            @iconEvent="$emit('closeMoveset')" />

        <div id="moves_list">
            <div
                v-for="(move, index) in moveList"
                :key="index"
                class="move-card"
                :class="move.type"
                @click="$emit('useMove', move)">
                <span>
                    {{ $filters.toTitleCase(move.name) }}
                </span>
                <span>
                    Power:
                    {{ move.power }}
                </span>
                <span>
                    PP:
                    {{ move.pp }}
                </span>
                <span>
                    Accuracy:
                    {{ move.accuracy }}
                </span>
                <span>
                    Type:
                    {{ $filters.toTitleCase(move.type) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
	import NavigationBar from "@/js/components/UI/NavigationBar.vue"
    import { mapGetters } from 'vuex'


    export default{

        components: {
            NavigationBar
        },

        created() {
            this.moveList
        },

        computed: {

            moveList() {
                const trainer = this.getBattleData.trainer
                return trainer.partyList[trainer.currentPokemonIndex].movesList.filter(move => move.pp)
            },

			...mapGetters([
				'getBattleData'
			]),
        },
    }
</script>

<style lang="scss">
	@import "@/styles/battle/movesList";
</style>