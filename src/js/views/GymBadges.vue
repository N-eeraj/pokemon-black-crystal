<template>
    <div>
        <navigation-bar
            title="Badges"
            icon="cross-mark"
            @iconEvent="$router.push('/')" />
        <img
            v-for="(badge, index) in badges"
            :src="require(`@/assets/images/gym-badges/${badge.name}.svg`)"
            :key="index" />
    </div>
</template>

<script>

    import NavigationBar from "@/js/components/UI/NavigationBar.vue"

    import data from "@/assets/data/gym-levels.json"

    export default {
        name: 'gym-badges',

        components: {
            NavigationBar
        },

        data() {
            return {
                badges: null
            }
        },

        created() {
            this.badges = data
        },
    }

</script>