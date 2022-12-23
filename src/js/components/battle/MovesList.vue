<template>
    <div id="moveset_container">

        <navigation-bar
            title="Moves"
            icon="back"
            @iconEvent="$emit('closeMoveset')" />

        <div id="moves_list">
            {{ getMovesByName(moveset) }}
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

        methods: {
			...mapGetters([
				'getMovesByName'
			]),
        },
    }
</script>

<style lang="scss">
	@import "@/styles/battle/movesList";
</style>