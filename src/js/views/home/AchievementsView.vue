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


    export default {
        name: 'achievements-view',

        components: {
            NavigationBar,
            AchievementsGroup
        },

        data() {
            return {
                allAchievements: [
                    {
                        title: 'group 1',
                        achievements: [
                            {
                                name: 'Test1',
                                badge: 'Test',
                                required: [
                                    1,
                                    5,
                                    10,
                                    25
                                ],
                                current: 0
                            },
                            {
                                name: 'Test2',
                                badge: 'Test',
                                required: [
                                    1,
                                    5,
                                    10,
                                    25
                                ],
                                current: 0
                            }
                        ]
                    },
                    {
                        title: 'group 2',
                        achievements: [
                            {
                                name: 'Test3',
                                badge: 'Test',
                                required: [
                                    1,
                                    5,
                                    10,
                                    25
                                ],
                                current: 0
                            },
                            {
                                name: 'Test4',
                                badge: 'Test',
                                required: [
                                    1,
                                    5,
                                    10,
                                    25
                                ],
                                current: 0
                            }
                        ]
                    }
                ]
            }
        },

        computed: {
            ...mapGetters([
                'playerAchievements'
            ])
        },

        created() {
            this.updateAudio('achievements.mp3')
        },

        methods: {
            getPecentage(achievement) {
                return Math.round(achievement.victories / achievement.attempts * 100, 2) || 0
            },

            ...mapActions([
                'updateAudio'
            ])
        }
    }
</script>

<style lang="scss" scoped src="@/styles/home/achievements/main.scss"></style>