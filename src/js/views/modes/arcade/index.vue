<template>
    <div>
        <div id="arcade_home">

            <navigation-bar
                title="Arcade"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    export default {
        name: 'arcade-mode',

        components: {
            NavigationBar
        },
    }

</script>