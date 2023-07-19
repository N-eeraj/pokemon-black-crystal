<template>
    <div
        id="splash_screen"
        :class="{ loaded : !isLoading }"
        @click="handleLoaded">

        <div id="title">
            <img
                src="@/assets/images/pokemon-logo.png"
                alt="Pokémon" />
            <h1>Black Crystal</h1>
        </div>
        <div id="loading">
            <span v-if="isLoading">
                Loading
            </span>
            <span v-else>
                Click to continue
            </span>
        </div>

    </div>
</template>

<script>

    import { mapActions } from 'vuex'

    import { appName } from '@/js/mixins/common'
    import updateVersion from '@/js/mixins/migrations'
    import { getStorage } from '@/js/mixins/storage'

    export default {
        name: 'splash-screen',
        
        data() {
            return {
                isLoading: true,
            }
        },

        created() {
            updateVersion()
            this.loadData()
        },
        
        methods: {
            async loadData() {
                await Promise.all([
                    this.fetchMoves(),
                    this.fetchGrowthRates(),
                    this.fetchTypes()
                ])

                if (getStorage(appName))
                    await this.loadGameData()
                else
                    this.$router.push('/welcome')

                this.isLoading = false
            },

            handleLoaded() {
                if (this.isLoading) return
                this.$emit('loading-complete')
            },

            ...mapActions([
                'fetchMoves',
                'fetchGrowthRates',
                'fetchTypes',
                'loadGameData'
            ])
        },
    }
</script>

<style lang="scss" scoped src="@/styles/screens/splashScreen.scss"></style>