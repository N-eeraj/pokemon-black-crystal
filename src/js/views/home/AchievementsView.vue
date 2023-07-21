<template>
    <div>
        <div id="achievements">
            <navigation-bar
                title="Achievements"
                icon="cross-mark"
                @icon-event="$router.push('/')" />

            <div class="achievements-list">
                <achievements-group
                    v-for="({title, achievements}, index) in allAchievements"
                    :title="title"
                    :achievements="achievements"
                    :key="index" />
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import AchievementsGroup from '@/js/components/achievements/AchievementsGroup.vue'

    import { mapGetters, mapActions } from 'vuex'

    import achievements from '@/assets/data/achievements'

    export default {
        name: 'achievements-view',

        components: {
            NavigationBar,
            AchievementsGroup
        },

        data() {
            return {
                allAchievements: null
            }
        },

        computed: {
            ...mapGetters([
                'playerAchievements'
            ])
        },

        created() {
            this.allAchievements = achievements
            this.updateAudio('achievements.mp3')
            this.setCurrentArcade()
            this.setCurrentOwnedPokemon()
        },

        methods: {
            getPecentage(achievement) {
                return Math.round(achievement.victories / achievement.attempts * 100, 2) || 0
            },

            setCurrentArcade() {
                const arcadeAchievements = this.allAchievements.find(({ id }) => id === 'arcade')
                arcadeAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'battle':
                            return event.current = this.playerAchievements.arcade.battle
                        case 'tent':
                            return event.current = this.playerAchievements.arcade.tent
                        case 'tower':
                            return event.current = this.playerAchievements.arcade.tower
                    }
                })
            },

            setCurrentOwnedPokemon() {
                const ownedPokemonAchievements = this.allAchievements.find(({ id }) => id === 'pokemonOwned')
                ownedPokemonAchievements.achievements.forEach(event => {
                    switch (event.id) {
                        case 'owned':
                            return event.current = this.playerAchievements.ownedPokemon
                    }
                })
            },

            ...mapActions([
                'updateAudio'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/main.scss"></style>