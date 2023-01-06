<template>
    <div id="pokemon_list_container">

        <navigation-bar
            title="Pokémon"
            icon="cross-mark"
            @iconEvent="$emit('closeParty')" />
    </div>
</template>

<script>
	import NavigationBar from "@/js/components/UI/NavigationBar.vue"

    export default{
        components: {
            NavigationBar
        }
    }
</script>