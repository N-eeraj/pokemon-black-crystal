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

                    <img
                        v-if="pageData[currentPage].image"
                        :src="require(`@/assets/images${pageData[currentPage].image}`)"
                        class="image" />

                    <div
                        v-if="pageData[currentPage].text"
                        class="text-container">
                        <p
                            v-for="(text, index) in pageData[currentPage].text"
                            :key="`text-${index}`"
                            class="text">
                            {{ text }}
                        </p>
                    </div>

                    <div
                        v-if="pageData[currentPage].actions"
                        class="actions-container">
                        <button
                            v-for="(button, index) in pageData[currentPage].actions"
                            :key="`button-${index}`"
                            class="button"
                            :class="button.type"
                            @click="handleButtonAction(button.action)">
                            {{ button.text }}
                        </button>
                    </div>

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
    },

    methods: {
        handleButtonAction(action) {
            switch (action) {
                case 'issues':
                    window.open('https://github.com/N-eeraj/pokemon-black-crystal/issues')
                    break
                case 'help':
                    this.$router.push('/help')
                    break
            }
        }
    }
}
</script>

<style lang="scss" src="@/styles/info.scss"></style>