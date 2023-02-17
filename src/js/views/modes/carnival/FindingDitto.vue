<template>
    <div>
        <common-loader v-if="loading" />

        <div
            v-else
            id="finding_ditto">

            <h1 class="title">
                Finding Ditto
            </h1>

        </div>
    </div>
</template>

<script>
    
    import CommonLoader from '@/js/components/screens/loading/CommonLoader.vue'

    import { mapGetters } from 'vuex'

    export default {
        name: 'finding-ditto',

        components: {
            CommonLoader,
        },

        data() {
            return {
                loading: true,
            }
        },

        computed: {
            ...mapGetters([
                'currentCarnivalEntry'
            ])
        },

        created() {
            if (this.currentCarnivalEntry !== 'finding-ditto')
                return this.handleInvalidEntry()
        },

        methods: {
            handleInvalidEntry() {
                this.$router.push('/mode/carnival')
            }
        }
    }

</script>

<style lang="scss" src="@/styles/modes/carnival/findingDitto.scss"></style>