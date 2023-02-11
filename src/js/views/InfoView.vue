<template>
    <div>
        <div id="info_view">
            <navigation-bar
            title="Info"
            icon="cross-mark"
            @iconEvent="$router.push('/')" />
        </div>
    </div>
</template>

<script>
import NavigationBar from '@/js/components/UI/NavigationBar.vue'

    export default {
    name: "info-view",
    components: {
        NavigationBar
    }
}
</script>