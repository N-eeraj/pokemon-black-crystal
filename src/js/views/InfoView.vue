<template>
    <div>
        <div id="info_view">
            <navigation-bar
            title="Info"
            icon="cross-mark"
            @icon-event="$router.push('/')" />
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    import info from '@/assets/data/info'

    export default {
    name: "info-view",

    components: {
        NavigationBar
    },

    created() {
        console.log(info)
    }
}
</script>