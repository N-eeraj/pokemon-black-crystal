<template>
    <div
        id="splash_screen"
        :class="{ loaded : !isLoading }"
        @click="emitLoaded">

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

    export default {
        name: 'splash-screen',
        
        data() {
            return {
                isLoading: true,
            }
        },

        created() {
            this.versionMigrations()
            this.loadData()
        },
        
        methods: {
            async loadData() {
                await Promise.all([
                    this.fetchMoves(),
                    this.fetchGrowthRates(),
                    this.fetchTypes()
                ])

                if (localStorage.gameData)
                    await this.loadGameData()
                else
                    this.$router.push('/welcome')

                this.isLoading = false
            },

            versionMigrations() {
                const latestVersion = '1.8.0'
                const currentVersion = localStorage.version
                if (!(currentVersion && currentVersion === latestVersion)) {
                    localStorage.setItem('version', latestVersion)

                    if (localStorage.pokemonData && (!currentVersion || currentVersion < '1.8.0'))
                        localStorage.removeItem('pokemonData')
                }
            },

            emitLoaded() {
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