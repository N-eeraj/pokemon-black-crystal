<template>
    <div>
        <div id="achievements">
            <navigation-bar
                title="Achievements"
                icon="cross-mark"
                @iconEvent="$router.push('/')" />

            <div class="achievements-list">
                <div
                    v-for="([event, achievement], index) in Object.entries(playerAchievements)"
                    :key="`event-${index}`"
                    class="achievement-card">

                    <div class="details">
                        <strong v-if="event">
                            {{ $filters.toTitleCase(event) }}
                        </strong>
                        <ul>
                            <li
                                v-for="([key, value], index) in Object.entries(achievement)"
                                :key="`list-${index}`">
                                <span>
                                    {{ $filters.toTitleCase(key) }}:
                                </span>
                                <span>
                                    {{ value }}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div class="chart-container">
                        <doughnut-chart :value="getPecentage(achievement)" />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import NavigationBar from '@/js/components/UI/NavigationBar.vue'
    import DoughnutChart from '@/js/components/UI/DoughnutChart.vue'

    import { mapGetters } from 'vuex'


    export default {
        name: 'achievements-view',

        components: {
            NavigationBar,
            DoughnutChart
        },

        computed: {
            ...mapGetters([
                'playerAchievements'
            ])
        },

        methods: {
            getPecentage(achievement) {
                return Math.round(achievement.victories / achievement.attempts * 100, 2)
            }
        },
    }
</script>

<style lang="scss" src="@/styles/achievements.scss"></style>