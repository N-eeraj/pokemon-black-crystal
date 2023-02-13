<template>
    <div>
        <div id="info_view">

            <navigation-bar
                title="Info"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="page-container">
                <img
                    src="@/assets/icons/previous.svg"
                    alt="Previous"
                    class="change-page-icon"
                    :class="{ hide: !currentPage }"
                    @click="currentPage--" />
                <div class="content-container">
                    {{ pageData[currentPage] }}
                </div>
                <img
                    src="@/assets/icons/next.svg"
                    alt="Next"
                    class="change-page-icon"
                    :class="{ hide: currentPage === pageData.length - 1 }"
                    @click="currentPage++" />
            </div>

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

    data() {
        return {
            pageData: null,
            currentPage: 0
        }
    },

    created() {
        this.pageData = info
    }
}
</script>

<style lang="scss" src="@/styles/info.scss"></style>