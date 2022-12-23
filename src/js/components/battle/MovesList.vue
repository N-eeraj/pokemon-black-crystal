<template>
    <div id="moveset_container">

        <navigation-bar
            title="Moves"
            icon="back"
            @iconEvent="$emit('closeMoveset')" />

        <div id="moves_list">
            <div
                v-for="(move, index) in movesetList"
                :key="index"
                class="move-card"
                :class="move.type">
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
                    {{ $filter.toTitleCase(move.type) }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
	import NavigationBar from "@/js/components/NavigationBar.vue"
    import { mapGetters } from 'vuex'


    export default{

        components: {
            NavigationBar
        },

        props: {
            moveset: {
                type: Array,
                require: true
            }
        },

        computed: {
            movesetList() {
                return this.moveset.map(move => {
                    return {
                        name: move.name,
                        ...this.getMovesByName(move.name)
                    }
                })
            },

			...mapGetters([
				'getMovesByName'
			]),
        },
    }
</script>

<style lang="scss">
	@import "@/styles/battle/movesList";
</style>